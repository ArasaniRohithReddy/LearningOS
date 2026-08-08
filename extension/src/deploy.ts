// The `learningos.deployCatalog` command — installs the FULL bundled LearningOS
// catalog (128 agents + 510 skills + roles) into a location VS Code Copilot
// discovers natively:
//   * User profile  `~/.copilot/{agents,skills,roles}`  — roams across every
//     workspace AND the Copilot CLI (recommended default).
//   * This workspace `.github/{agents,skills,roles}`    — also merges
//     `chat.agentSkillsLocations` so `.github/skills/` is picked up, and drops the
//     LearningOS constitution at the workspace-root `AGENTS.md`.
//
// Safety rules honored here:
//   * A modal confirmation states the exact target path and what will be written.
//   * We ONLY add/overwrite LearningOS's own files (read-then-write, folder by
//     folder) — we NEVER delete user files.
//   * A marker file records the deployed version so re-runs are idempotent unless
//     the learner explicitly chooses to redeploy.

import * as vscode from "vscode";
import * as os from "node:os";
import { contentUri } from "./catalog";

const MARKER_FILE = ".learningos-deployed.json";
const SKILLS_LOCATION = ".github/skills/";
const SETTING_KEY = "chat.agentSkillsLocations";

interface TargetPick extends vscode.QuickPickItem {
  target: "user" | "workspace";
}

interface DeployMarker {
  version: string;
  count: number;
  agents: number;
  skills: number;
  roles: number;
  target: string;
  date: string;
}

/** Count immediate children of a bundled content sub-dir (0 if absent). */
async function countChildren(context: vscode.ExtensionContext, sub: string, dirsOnly: boolean): Promise<number> {
  try {
    const entries = await vscode.workspace.fs.readDirectory(contentUri(context, sub));
    return entries.filter(([, type]) =>
      dirsOnly ? (type & vscode.FileType.Directory) !== 0 : (type & vscode.FileType.File) !== 0
    ).length;
  } catch {
    return 0;
  }
}

/** Recursively copy a directory tree, only ever adding/overwriting (never deleting). */
async function copyTree(src: vscode.Uri, dst: vscode.Uri): Promise<void> {
  await vscode.workspace.fs.createDirectory(dst);
  const entries = await vscode.workspace.fs.readDirectory(src);
  for (const [name, type] of entries) {
    const s = vscode.Uri.joinPath(src, name);
    const d = vscode.Uri.joinPath(dst, name);
    if (type & vscode.FileType.Directory) {
      await copyTree(s, d);
    } else if (type & vscode.FileType.File) {
      const bytes = await vscode.workspace.fs.readFile(s);
      await vscode.workspace.fs.writeFile(d, bytes);
    }
  }
}

/**
 * Copy each immediate child of `src` into `dst`, invoking `onItem` after each so
 * the caller can drive a progress bar. Returns the number of children copied.
 */
async function copyChildren(
  src: vscode.Uri,
  dst: vscode.Uri,
  onItem: () => void
): Promise<number> {
  await vscode.workspace.fs.createDirectory(dst);
  let entries: [string, vscode.FileType][];
  try {
    entries = await vscode.workspace.fs.readDirectory(src);
  } catch {
    return 0;
  }
  let count = 0;
  for (const [name, type] of entries) {
    const s = vscode.Uri.joinPath(src, name);
    const d = vscode.Uri.joinPath(dst, name);
    if (type & vscode.FileType.Directory) {
      await copyTree(s, d);
    } else if (type & vscode.FileType.File) {
      const bytes = await vscode.workspace.fs.readFile(s);
      await vscode.workspace.fs.writeFile(d, bytes);
    } else {
      continue;
    }
    count += 1;
    onItem();
  }
  return count;
}

async function readMarker(base: vscode.Uri): Promise<DeployMarker | undefined> {
  try {
    const bytes = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(base, MARKER_FILE));
    const parsed = JSON.parse(Buffer.from(bytes).toString("utf8"));
    return parsed && typeof parsed === "object" ? (parsed as DeployMarker) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Ensure `.github/skills/` is present in the workspace `chat.agentSkillsLocations`
 * setting. Prefers a direct, non-destructive edit of `.vscode/settings.json`; if the
 * file is JSONC (has comments) and can't be parsed, falls back to the configuration
 * API so we never clobber the user's settings.
 * Returns a short status describing what happened.
 */
async function ensureSkillsLocation(folder: vscode.WorkspaceFolder): Promise<"created" | "added" | "present" | "manual"> {
  const settingsUri = vscode.Uri.joinPath(folder.uri, ".vscode", "settings.json");

  let text: string | undefined;
  try {
    text = Buffer.from(await vscode.workspace.fs.readFile(settingsUri)).toString("utf8");
  } catch {
    text = undefined;
  }

  // No settings.json yet → create a minimal, valid one.
  if (text === undefined || text.trim() === "") {
    const body = JSON.stringify({ [SETTING_KEY]: [SKILLS_LOCATION] }, null, 2) + "\n";
    await vscode.workspace.fs.createDirectory(vscode.Uri.joinPath(folder.uri, ".vscode"));
    await vscode.workspace.fs.writeFile(settingsUri, Buffer.from(body, "utf8"));
    return "created";
  }

  // Existing file: only rewrite when it parses as clean JSON, so we never destroy
  // a user's JSONC (comments/trailing commas).
  let parsed: Record<string, unknown> | undefined;
  try {
    parsed = JSON.parse(text) as Record<string, unknown>;
  } catch {
    parsed = undefined;
  }

  if (parsed && typeof parsed === "object") {
    const current = parsed[SETTING_KEY];
    const arr = Array.isArray(current) ? current.slice() : [];
    if (arr.some((v) => typeof v === "string" && v.replace(/\\/g, "/").replace(/\/+$/, "") === ".github/skills")) {
      return "present";
    }
    arr.push(SKILLS_LOCATION);
    parsed[SETTING_KEY] = arr;
    await vscode.workspace.fs.writeFile(settingsUri, Buffer.from(JSON.stringify(parsed, null, 2) + "\n", "utf8"));
    return "added";
  }

  // JSONC we can't safely rewrite → use the configuration API (comment-safe). This
  // throws if the setting isn't registered (e.g. Copilot Chat not installed), so we
  // degrade to asking the user to add it manually.
  try {
    const cfg = vscode.workspace.getConfiguration("chat", folder.uri);
    // Read ONLY the workspace-scoped value: cfg.get(...) returns the merged
    // (default + user + workspace) array, so writing [...merged, SKILLS_LOCATION]
    // back at ConfigurationTarget.Workspace would re-materialize user-level entries
    // into workspace settings. inspect().workspaceValue keeps this workspace-local.
    const existing = cfg.inspect<string[]>("agentSkillsLocations")?.workspaceValue ?? [];
    if (existing.some((v) => typeof v === "string" && v.replace(/\\/g, "/").replace(/\/+$/, "") === ".github/skills")) {
      return "present";
    }
    await cfg.update("agentSkillsLocations", [...existing, SKILLS_LOCATION], vscode.ConfigurationTarget.Workspace);
    return "added";
  } catch {
    return "manual";
  }
}

/** What happened to the workspace-root AGENTS.md during a workspace deploy. */
type ConstitutionOutcome = "written" | "backed-up" | "identical" | "error" | "skip";

/** Result of the workspace-only writes (settings + AGENTS.md) done inside the progress step. */
interface WorkspaceWriteStatus {
  settings: "created" | "added" | "present" | "manual" | "skip";
  agentsMd: ConstitutionOutcome;
  agentsMdBackup?: string;
}

/**
 * Install the bundled LearningOS AGENTS.md at the workspace root WITHOUT silently
 * clobbering a user's own AGENTS.md (it's theirs, and @drona treats it as the project
 * constitution). Behaviour:
 *   - no AGENTS.md there            → write ours ("written");
 *   - an AGENTS.md byte-identical   → leave it ("identical");
 *   - an AGENTS.md that differs     → back it up to AGENTS.md.bak-learningos-<timestamp>
 *                                     in the same folder, then write ours ("backed-up").
 * Never deletes anything. Returns what happened (+ the backup filename) so the caller
 * can report it truthfully.
 */
async function writeConstitution(
  context: vscode.ExtensionContext,
  folder: vscode.WorkspaceFolder
): Promise<{ outcome: ConstitutionOutcome; backup?: string }> {
  let ours: Uint8Array;
  try {
    ours = await vscode.workspace.fs.readFile(contentUri(context, "AGENTS.md"));
  } catch {
    return { outcome: "error" }; // not bundled — best-effort, skip quietly
  }

  const target = vscode.Uri.joinPath(folder.uri, "AGENTS.md");

  // Is there already an AGENTS.md at the workspace root? stat throws when absent.
  let existing: Uint8Array | undefined;
  try {
    await vscode.workspace.fs.stat(target);
    existing = await vscode.workspace.fs.readFile(target);
  } catch {
    existing = undefined;
  }

  try {
    if (existing === undefined) {
      await vscode.workspace.fs.writeFile(target, ours);
      return { outcome: "written" };
    }
    if (Buffer.from(existing).equals(Buffer.from(ours))) {
      return { outcome: "identical" }; // already the LearningOS constitution — no-op
    }
    // The user's own AGENTS.md differs — back it up first, then install ours.
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backup = `AGENTS.md.bak-learningos-${stamp}`;
    await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(folder.uri, backup), existing);
    await vscode.workspace.fs.writeFile(target, ours);
    return { outcome: "backed-up", backup };
  } catch {
    return { outcome: "error" };
  }
}
export interface DeployOptions {
  /** Force the deploy target, skipping the destination QuickPick. */
  target?: "user" | "workspace";
  /** Skip the modal confirmation (the caller has already obtained explicit consent). */
  skipConfirm?: boolean;
  /** Suppress the final success notification (the caller shows its own). */
  silent?: boolean;
}

/** Outcome of a catalog deploy, so callers can compose their own follow-up UI. */
export interface DeployResult {
  ok: boolean;
  cancelled?: boolean;
  alreadyDeployed?: boolean;
  target?: "user" | "workspace";
  targetLabel?: string;
  agents: number;
  skills: number;
  roles: number;
  /** For a workspace deploy: what happened to the workspace-root AGENTS.md. */
  agentsMd?: ConstitutionOutcome;
  /** For a workspace deploy that backed up an existing AGENTS.md: the backup filename. */
  agentsMdBackup?: string;
}

/**
 * Deploy the bundled LearningOS catalog. Interactive by default (destination
 * QuickPick + modal confirmation). Pass `options.target` to force a destination
 * and `options.skipConfirm` when the caller already has explicit consent (e.g. the
 * first-run "Set up everything" button), and `options.silent` to suppress the
 * final toast so the caller can show a combined message.
 */
export async function deployCatalog(
  context: vscode.ExtensionContext,
  options: DeployOptions = {}
): Promise<DeployResult> {
  const version = String(context.extension.packageJSON?.version ?? "0.0.0");

  // How many of each we actually bundle (truthful, read from content/).
  const agents = await countChildren(context, "agents", false);
  const skills = await countChildren(context, "skills", true);
  const roles = await countChildren(context, "roles", false);
  const fail: DeployResult = { ok: false, agents, skills, roles };
  if (agents === 0 && skills === 0) {
    void vscode.window.showErrorMessage(
      "The LearningOS catalog isn't bundled in this build. Re-package the extension (npm run package) and try again."
    );
    return fail;
  }

  // 1) Where to deploy? Honor a forced target, otherwise ask.
  const folder = vscode.workspace.workspaceFolders?.[0];
  let target: "user" | "workspace";
  if (options.target) {
    target = options.target;
  } else {
    const items: TargetPick[] = [
      {
        target: "user",
        label: "$(account) User profile  (~/.copilot)",
        description: "Recommended",
        detail: "Roams across every workspace and the Copilot CLI. No workspace changes.",
      },
      {
        target: "workspace",
        label: "$(root-folder) This workspace  (.github)",
        description: folder ? folder.name : "no folder open",
        detail: folder
          ? "Installs into .github/ and sets chat.agentSkillsLocations for this workspace."
          : "Open a folder first to use this option.",
      },
    ];
    const pick = await vscode.window.showQuickPick(items, {
      title: "Deploy LearningOS catalog",
      placeHolder: `Where should Drona install ${agents} agents + ${skills} skills?`,
      ignoreFocusOut: true,
    });
    if (!pick) {
      return { ...fail, cancelled: true };
    }
    target = pick.target;
  }
  if (target === "workspace" && !folder) {
    void vscode.window.showWarningMessage("Open a folder first, then deploy the LearningOS catalog to the workspace.");
    return fail;
  }

  const targetBase =
    target === "user"
      ? vscode.Uri.joinPath(vscode.Uri.file(os.homedir()), ".copilot")
      : vscode.Uri.joinPath((folder as vscode.WorkspaceFolder).uri, ".github");
  const targetLabel = targetBase.fsPath;

  // 2) Idempotency: already deployed at this version?
  const marker = await readMarker(targetBase);
  if (marker && marker.version === version) {
    if (options.skipConfirm) {
      // Programmatic re-run (e.g. "Set up everything"): already satisfied — no-op.
      return { ok: true, alreadyDeployed: true, target, targetLabel, agents, skills, roles };
    }
    const choice = await vscode.window.showInformationMessage(
      `LearningOS v${version} is already deployed to ${targetLabel}.`,
      "Redeploy",
      "Cancel"
    );
    if (choice !== "Redeploy") {
      return { ...fail, cancelled: true, target, targetLabel };
    }
  }

  // 3) Modal confirmation stating the exact path + what gets written (skipped when
  // the caller already obtained explicit consent, e.g. the first-run button).
  if (!options.skipConfirm) {
    const confirm = await vscode.window.showInformationMessage(
      `Deploy the LearningOS catalog to:\n${targetLabel}`,
      {
        modal: true,
        detail:
          `This writes ${agents} agents, ${skills} skills and ${roles} roles` +
          (target === "workspace"
            ? `, the LearningOS AGENTS.md constitution, and updates .vscode/settings.json`
            : "") +
          `. Only LearningOS's own files are added or overwritten and nothing is deleted` +
          (target === "workspace"
            ? `; if you already have a workspace AGENTS.md, it is backed up (AGENTS.md.bak-learningos-…) before the LearningOS one is installed.`
            : `.`),
      },
      "Deploy"
    );
    if (confirm !== "Deploy") {
      return { ...fail, cancelled: true, target, targetLabel };
    }
  }

  // 4) Copy under a progress notification (~640 files).
  const totalUnits = Math.max(1, agents + skills + roles);
  let writeStatus: WorkspaceWriteStatus;
  try {
    writeStatus = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Deploying LearningOS catalog",
        cancellable: false,
      },
      async (progress): Promise<WorkspaceWriteStatus> => {
        const step = 100 / totalUnits;
        const bump = (label: string) => progress.report({ increment: step, message: label });

        progress.report({ message: "Installing agents…" });
        await copyChildren(contentUri(context, "agents"), vscode.Uri.joinPath(targetBase, "agents"), () =>
          bump("Installing agents…")
        );

        progress.report({ message: `Installing ${skills} skills…` });
        await copyChildren(contentUri(context, "skills"), vscode.Uri.joinPath(targetBase, "skills"), () =>
          bump(`Installing skills…`)
        );

        progress.report({ message: "Installing roles…" });
        await copyChildren(contentUri(context, "roles"), vscode.Uri.joinPath(targetBase, "roles"), () =>
          bump("Installing roles…")
        );

        const result: WorkspaceWriteStatus = { settings: "skip", agentsMd: "skip" };
        if (target === "workspace" && folder) {
          progress.report({ message: "Writing AGENTS.md + settings…" });
          // Never silently clobber a user's own workspace AGENTS.md — back it up first.
          const md = await writeConstitution(context, folder);
          result.agentsMd = md.outcome;
          result.agentsMdBackup = md.backup;
          result.settings = await ensureSkillsLocation(folder);
        }

        // Marker for idempotency.
        const record: DeployMarker = {
          version,
          count: agents + skills + roles,
          agents,
          skills,
          roles,
          target,
          date: new Date().toISOString(),
        };
        await vscode.workspace.fs.writeFile(
          vscode.Uri.joinPath(targetBase, MARKER_FILE),
          Buffer.from(JSON.stringify(record, null, 2) + "\n", "utf8")
        );
        return result;
      }
    );
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    void vscode.window.showErrorMessage(`Deploy failed: ${reason}`);
    return { ...fail, target, targetLabel };
  }

  // 5) Result + guidance (unless the caller wants to show its own message).
  if (!options.silent) {
    const extra =
      writeStatus.settings === "manual"
        ? ` Add "${SKILLS_LOCATION}" to "${SETTING_KEY}" in settings to enable /skills.`
        : "";
    const agentsNote =
      writeStatus.agentsMd === "backed-up"
        ? ` Backed up your AGENTS.md → ${writeStatus.agentsMdBackup} and installed the LearningOS constitution.`
        : writeStatus.agentsMd === "written"
          ? ` Installed the LearningOS constitution at AGENTS.md.`
          : "";
    void vscode.window.showInformationMessage(
      `Deployed ${agents} agents + ${skills} skills to ${targetLabel}. ` +
        `Open the agent picker or type / in Chat to use them.${agentsNote}${extra}`
    );
  }
  return {
    ok: true,
    target,
    targetLabel,
    agents,
    skills,
    roles,
    agentsMd: writeStatus.agentsMd,
    agentsMdBackup: writeStatus.agentsMdBackup,
  };
}

/** Register the deploy command; safe to call once on activation. */
export function registerDeployCommand(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("learningos.deployCatalog", () => void deployCatalog(context))
  );
}
