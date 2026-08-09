import * as vscode from "vscode";
import * as os from "node:os";
import { DRONA_SYSTEM, frameTask } from "./drona";
import { FETCH_TOOL_NAME, registerFetchTool } from "./fetchTool";
import { RUN_TOOL_NAME, registerRunTool, CODE_RUNNER_API_KEY_SECRET } from "./runTool";
import { DashboardViewProvider } from "./dashboard";
import { NewsViewProvider, RoadmapsViewProvider } from "./newsView";
import { NEWS_TOOL_NAME, registerNewsTool } from "./newsTool";
import { loadFeedCatalog, buildOpml } from "./feeds";
import { buildCatalogIndex, loadRegistry } from "./catalog";
import { registerDeployCommand, deployCatalog } from "./deploy";
import { getData, recordTurn, registerRememberTool, renderMemorySummary, REMEMBER_TOOL_NAME, writeProfile } from "./store";

const PARTICIPANT_ID = "learningos.drona";
/** Hard cap on tool-calling rounds to avoid infinite loops. */
const MAX_TOOL_ROUNDS = 5;

export function activate(context: vscode.ExtensionContext): void {
  // Fires after every @drona turn so the dashboard can refresh live.
  const dataChanged = new vscode.EventEmitter<void>();
  context.subscriptions.push(dataChanged);

  // --- Live-info fetch tool ---------------------------------------------------------
  registerFetchTool(context);

  // --- Run-code tool: execute snippets remotely (no local toolchain needed) ---------
  registerRunTool(context);

  // --- Cross-session memory: let the model persist learner facts --------------------
  registerRememberTool(context);

  // --- Curated tech-news tool: pull recent items from the bundled feed catalog -------
  registerNewsTool(context);

  // --- Deploy the full LearningOS catalog into a Copilot-discoverable location ------
  registerDeployCommand(context);

  // Warm the compact catalog index (from the bundled registry) at activation so it's
  // ready to inject into Drona's first turn. Best-effort; cached after first build.
  void getCatalogIndex(context);

  // --- Dashboard webview view -------------------------------------------------------
  const dashboard = new DashboardViewProvider(context, dataChanged.event);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(DashboardViewProvider.viewType, dashboard, {
      webviewOptions: { retainContextWhenHidden: true },
    })
  );

  // --- Tech News + Roadmaps webview views -------------------------------------------
  const newsView = new NewsViewProvider(context);
  const roadmapsView = new RoadmapsViewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(NewsViewProvider.viewType, newsView, {
      webviewOptions: { retainContextWhenHidden: true },
    }),
    vscode.window.registerWebviewViewProvider(RoadmapsViewProvider.viewType, roadmapsView, {
      webviewOptions: { retainContextWhenHidden: true },
    })
  );

  // --- @drona chat participant ------------------------------------------------------
  const handler: vscode.ChatRequestHandler = async (request, chatContext, stream, token) => {
    const model = request.model;
    if (!model) {
      stream.markdown("Pick a language model in the chat model dropdown, then ask **@drona** again.");
      return {};
    }

    // Build Drona's instructions, enriched with the workspace constitution if present.
    let system = DRONA_SYSTEM;
    const agentsMd = await readWorkspaceText("AGENTS.md");
    if (agentsMd) {
      system += "\n\nProject constitution (excerpt from this workspace's AGENTS.md):\n" + agentsMd.slice(0, 4000);
    }

    // Inject the compact catalog index so Drona can route to the right specialist
    // agent / skill (bundled with the extension; built once and cached).
    const catalog = await getCatalogIndex(context);
    if (catalog) {
      system += "\n\n" + catalog;
    }

    // Inject the learner's persisted cross-session memory so every turn is
    // personalized (this is what makes /resume and "cross-session memory" real).
    // We fold in the skills-maintained profile file(s) so the model sees ONE
    // coherent learner memory (store summary + the same profile the skills keep).
    const memory = await buildUnifiedMemory(context);
    if (memory) {
      system +=
        "\n\nLearner memory (persisted across sessions — personalize to it and continue where the learner left off):\n" +
        memory;
    }

    const messages: vscode.LanguageModelChatMessage[] = [
      vscode.LanguageModelChatMessage.User(system),
      ...historyToMessages(chatContext),
      vscode.LanguageModelChatMessage.User(frameTask(request.command, request.prompt, memory)),
    ];

    let answerText = "";
    try {
      stream.progress("Drona is thinking…");
      answerText = await runWithTools(model, messages, request, stream, token);
    } catch (err) {
      handleChatError(err, stream);
    }

    // Persist this turn (history/progress) to globalState only. The human-readable
    // profile file is exported on demand (see showProgress), never written per turn,
    // so it can never clobber the skills' learning-profile.md. Never break chat.
    try {
      await recordTurn(context, {
        command: request.command,
        prompt: request.prompt,
        response: answerText,
      });
      dataChanged.fire();
    } catch {
      /* persistence is best-effort */
    }

    // Gentle nudges toward active learning.
    stream.button({ command: "learningos.openDashboard", title: "$(mortar-board) Open dashboard" });
    stream.button({ command: "learningos.setup", title: "$(gear) Enable progress charts" });
    return {};
  };

  const drona = vscode.chat.createChatParticipant(PARTICIPANT_ID, handler);
  drona.iconPath = new vscode.ThemeIcon("mortar-board");
  drona.followupProvider = {
    provideFollowups() {
      return [
        { prompt: "Turn this into a 7-day study plan", label: "📅 Make a plan", command: "plan" },
        { prompt: "Quiz me on what we just covered", label: "🧠 Quiz me" },
        { prompt: "Give me a hands-on exercise", label: "🛠️ Practice" },
      ];
    },
  };
  context.subscriptions.push(drona);

  // --- Commands ---------------------------------------------------------------------
  context.subscriptions.push(
    vscode.commands.registerCommand("learningos.setup", () => setupWorkspace()),
    vscode.commands.registerCommand("learningos.setupEverything", () => setupEverything(context)),
    vscode.commands.registerCommand("learningos.setupCodeExecution", () => setupCodeExecution(context)),
    vscode.commands.registerCommand("learningos.showProgress", () => showProgress(context)),
    vscode.commands.registerCommand("learningos.openDashboard", async () => {
      // `<viewId>.focus` is auto-registered by VS Code and reveals the view.
      await vscode.commands.executeCommand("learningos.dashboard.focus");
    }),
    vscode.commands.registerCommand("learningos.openNews", async () => {
      await vscode.commands.executeCommand("learningos.news.focus");
    }),
    vscode.commands.registerCommand("learningos.openRoadmaps", async () => {
      await vscode.commands.executeCommand("learningos.roadmaps.focus");
    }),
    vscode.commands.registerCommand("learningos.exportFeedsOpml", () => exportFeedsOpml(context))
  );

  // --- First-run auto-setup (one-time, consent-based) -------------------------------
  // Offer to install the whole catalog + charts the first time the extension runs,
  // so installing the extension effectively sets up the plugin system-wide. Never
  // writes anything until the learner clicks a button; never nags twice.
  void offerFirstRunSetup(context);
}

export function deactivate(): void {
  /* nothing to clean up */
}

// --- tool-calling loop -------------------------------------------------------------

/**
 * Run the model with tools available, streaming text to the user and resolving
 * any tool calls, looping until the model stops requesting tools (capped).
 * Returns the concatenated assistant text (used for the history summary).
 */
async function runWithTools(
  model: vscode.LanguageModelChat,
  messages: vscode.LanguageModelChatMessage[],
  request: vscode.ChatRequest,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<string> {
  const options: vscode.LanguageModelChatRequestOptions = {};
  const tools = collectTools();
  if (tools.length) {
    options.tools = tools;
    options.toolMode = vscode.LanguageModelChatToolMode.Auto;
  }

  let answer = "";

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    if (token.isCancellationRequested) {
      break;
    }

    let response: vscode.LanguageModelChatResponse;
    try {
      response = await model.sendRequest(messages, options, token);
    } catch (err) {
      // Some models (e.g. o1 family) don't support tools. Degrade gracefully:
      // drop tools and retry this round once as a plain answer.
      if (options.tools && isToolUnsupportedError(err)) {
        stream.markdown(
          "\n\n_(The selected model can't call tools, so Drona will answer without fetching live pages. " +
            "For latest-news questions, switch to a tool-capable model.)_\n\n"
        );
        delete options.tools;
        delete options.toolMode;
        round--; // retry without tools
        continue;
      }
      throw err;
    }

    // Stream text, collect tool calls.
    const toolCalls: vscode.LanguageModelToolCallPart[] = [];
    const assistantParts: Array<vscode.LanguageModelTextPart | vscode.LanguageModelToolCallPart> = [];
    for await (const part of response.stream) {
      if (part instanceof vscode.LanguageModelTextPart) {
        stream.markdown(part.value);
        answer += part.value;
        assistantParts.push(part);
      } else if (part instanceof vscode.LanguageModelToolCallPart) {
        toolCalls.push(part);
        assistantParts.push(part);
      }
    }

    if (toolCalls.length === 0) {
      break; // model produced a final answer
    }
    if (round === MAX_TOOL_ROUNDS - 1) {
      // Cap reached while the model still wants tools. We must NOT send a dangling
      // assistant tool-call message (OpenAI/Anthropic reject a tool_calls message
      // that isn't followed by matching tool results — the request would 400).
      // So: fulfil the pending calls, feed their results back (bundled with the
      // nudge in a single user message so roles stay clean), then ask for a final
      // answer with tools disabled. Wrap the final request so any failure still
      // yields a user-visible message instead of an unhandled throw.
      messages.push(vscode.LanguageModelChatMessage.Assistant(assistantParts));

      const finalParts: Array<vscode.LanguageModelTextPart | vscode.LanguageModelToolResultPart> = [];
      for (const call of toolCalls) {
        let result: vscode.LanguageModelToolResult;
        try {
          result = await vscode.lm.invokeTool(
            call.name,
            { input: call.input, toolInvocationToken: request.toolInvocationToken },
            token
          );
        } catch (err) {
          const reason = err instanceof Error ? err.message : String(err);
          result = new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(`Tool "${call.name}" failed: ${reason}`),
          ]);
        }
        finalParts.push(new vscode.LanguageModelToolResultPart(call.callId, result.content));
      }
      finalParts.push(
        new vscode.LanguageModelTextPart(
          "You've reached the tool-use limit. Answer now using what you've gathered, and cite the source URLs."
        )
      );
      messages.push(vscode.LanguageModelChatMessage.User(finalParts));

      delete options.tools;
      delete options.toolMode;
      try {
        const finalResp = await model.sendRequest(messages, options, token);
        for await (const part of finalResp.stream) {
          if (part instanceof vscode.LanguageModelTextPart) {
            stream.markdown(part.value);
            answer += part.value;
          }
        }
      } catch (err) {
        handleChatError(err, stream);
      }
      break;
    }

    // Record the assistant turn (text + tool calls), then invoke the tools and
    // feed their results back as a user message (per the Language Model API).
    messages.push(vscode.LanguageModelChatMessage.Assistant(assistantParts));

    const resultParts: vscode.LanguageModelToolResultPart[] = [];
    for (const call of toolCalls) {
      if (token.isCancellationRequested) {
        break;
      }
      let result: vscode.LanguageModelToolResult;
      try {
        result = await vscode.lm.invokeTool(
          call.name,
          { input: call.input, toolInvocationToken: request.toolInvocationToken },
          token
        );
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        result = new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(`Tool "${call.name}" failed: ${reason}`),
        ]);
      }
      resultParts.push(new vscode.LanguageModelToolResultPart(call.callId, result.content));
    }
    messages.push(vscode.LanguageModelChatMessage.User(resultParts));
    stream.progress("Reading sources…");
  }

  return answer;
}

/**
 * The tools to expose to the model: our own fetch, run-code and remember tools, plus
 * any other fetch/search/web-style tools the user has installed (e.g. an MCP), so a
 * better retrieval tool is also usable. We deliberately don't pass *every* registered
 * tool — a teaching participant shouldn't be handed editor/terminal tools.
 */
function collectTools(): vscode.LanguageModelChatTool[] {
  const all = vscode.lm.tools;
  const picked = new Map<string, vscode.LanguageModelToolInformation>();

  for (const t of all) {
    if (t.name === FETCH_TOOL_NAME || t.name === REMEMBER_TOOL_NAME || t.name === RUN_TOOL_NAME || t.name === NEWS_TOOL_NAME) {
      picked.set(t.name, t);
    }
  }
  const relevant = /(fetch|search|web|http|url|browse|crawl|scrape)/i;
  for (const t of all) {
    if (picked.has(t.name)) {
      continue;
    }
    const haystack = `${t.name} ${t.description} ${t.tags.join(" ")}`;
    if (relevant.test(haystack)) {
      picked.set(t.name, t);
    }
  }

  return [...picked.values()].map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema ?? { type: "object", properties: {} },
  }));
}

function isToolUnsupportedError(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return (
    msg.includes("does not support tool") ||
    msg.includes("doesn't support tool") ||
    msg.includes("tool calling") ||
    msg.includes("tool_calls") ||
    msg.includes("function calling") ||
    (msg.includes("tool") && msg.includes("not support"))
  );
}

// --- helpers -----------------------------------------------------------------------

function historyToMessages(chatContext: vscode.ChatContext): vscode.LanguageModelChatMessage[] {
  const out: vscode.LanguageModelChatMessage[] = [];
  for (const turn of chatContext.history) {
    if (turn instanceof vscode.ChatRequestTurn) {
      out.push(vscode.LanguageModelChatMessage.User(turn.prompt));
    } else if (turn instanceof vscode.ChatResponseTurn) {
      const text = turn.response
        .map((part) => (part instanceof vscode.ChatResponseMarkdownPart ? part.value.value : ""))
        .join("");
      if (text) {
        out.push(vscode.LanguageModelChatMessage.Assistant(text));
      }
    }
  }
  return out;
}

function handleChatError(err: unknown, stream: vscode.ChatResponseStream): void {
  if (err instanceof vscode.LanguageModelError) {
    // e.g. off_topic, no permission, or no model available
    stream.markdown(
      `\n\n_Drona couldn't complete that (${err.code || err.message}). Try rephrasing or pick another model._`
    );
    return;
  }
  const msg = err instanceof Error ? err.message : String(err);
  stream.markdown(`\n\n_Unexpected error: ${msg}_`);
}

async function readWorkspaceText(relativePath: string): Promise<string | undefined> {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    return undefined;
  }
  try {
    const uri = vscode.Uri.joinPath(folder.uri, relativePath);
    const bytes = await vscode.workspace.fs.readFile(uri);
    return Buffer.from(bytes).toString("utf8");
  } catch {
    return undefined;
  }
}

// --- catalog index (built once, cached) --------------------------------------------
let catalogIndexCache: string | undefined;

/** Load the bundled registry and build the compact routing index, cached after first use. */
async function getCatalogIndex(context: vscode.ExtensionContext): Promise<string> {
  if (catalogIndexCache !== undefined) {
    return catalogIndexCache;
  }
  const reg = await loadRegistry(context);
  catalogIndexCache = reg ? buildCatalogIndex(reg) : "";
  return catalogIndexCache;
}

// --- unified learner memory --------------------------------------------------------
/** Total budget for the profile-file excerpt folded into the injected memory. */
const PROFILE_EXCERPT_BUDGET = 1_200;

/**
 * The learner memory shown to the model = the store's compact summary PLUS a short
 * excerpt of the skills-maintained profile file(s) if present, so `@drona` reasons
 * over the same learner memory the LearningOS skills keep (one coherent memory).
 */
async function buildUnifiedMemory(context: vscode.ExtensionContext): Promise<string> {
  const parts: string[] = [];
  const summary = renderMemorySummary(getData(context));
  if (summary) {
    parts.push(summary);
  }
  const excerpt = await readLearnerProfileExcerpt(context);
  if (excerpt) {
    parts.push(excerpt);
  }
  return parts.join("\n\n");
}

/**
 * Read the skills-maintained learner profile file(s) — the workspace-root
 * `learning-profile.md` and the extension's own `.learningos/profile.md` (its
 * configured path) — and return a bounded excerpt. Best-effort; returns "" if none.
 */
async function readLearnerProfileExcerpt(context: vscode.ExtensionContext): Promise<string> {
  const configured = vscode.workspace
    .getConfiguration("learningos")
    .get<string>("profilePath", ".learningos/profile.md");
  // Skills' file first (most valuable), then our own export, then a differing config path.
  const candidates: string[] = [];
  for (const f of ["learning-profile.md", ".learningos/profile.md", configured]) {
    if (f && !candidates.includes(f)) {
      candidates.push(f);
    }
  }

  const out: string[] = [];
  let used = 0;
  for (const rel of candidates) {
    if (used >= PROFILE_EXCERPT_BUDGET) {
      break;
    }
    const text = await readWorkspaceText(rel);
    const trimmed = text?.trim();
    if (!trimmed) {
      continue;
    }
    const remaining = PROFILE_EXCERPT_BUDGET - used;
    const excerpt =
      trimmed.length > remaining ? trimmed.slice(0, remaining).trimEnd() + "\n…[truncated]" : trimmed;
    out.push(`Learner profile file "${rel}" (maintained by the LearningOS skills):\n${excerpt}`);
    used += excerpt.length;
  }
  return out.join("\n\n");
}

/** Build the curated feeds OPML from the bundled catalog and save it via a dialog. */
async function exportFeedsOpml(context: vscode.ExtensionContext): Promise<void> {
  const catalog = await loadFeedCatalog(context);
  if (!catalog) {
    void vscode.window.showErrorMessage("LearningOS: the feed catalog is unavailable in this build.");
    return;
  }
  const opml = buildOpml(catalog);
  const target = await vscode.window.showSaveDialog({
    title: "Export LearningOS curated feeds (OPML)",
    saveLabel: "Export OPML",
    defaultUri: vscode.Uri.file("LearningOS-feeds.opml"),
    filters: { OPML: ["opml"], XML: ["xml"] },
  });
  if (!target) {
    return;
  }
  try {
    await vscode.workspace.fs.writeFile(target, Buffer.from(opml, "utf8"));
    const open = await vscode.window.showInformationMessage(
      `Exported ${catalog.feeds.length} curated feeds to OPML — import it into any RSS reader.`,
      "Reveal"
    );
    if (open === "Reveal") {
      await vscode.commands.executeCommand("revealFileInOS", target);
    }
  } catch (e) {
    void vscode.window.showErrorMessage(
      `LearningOS: could not write the OPML file — ${e instanceof Error ? e.message : String(e)}`
    );
  }
}

/** Register the local Flint-Chart MCP into this workspace's .vscode/mcp.json (idempotent). */
async function setupWorkspace(): Promise<void> {
  await setupFlintChart({ announce: true });

  // Also offer to deploy the full catalog so VS Code discovers every agent + skill.
  const pick = await vscode.window.showInformationMessage(
    "Make all 128 LearningOS specialist agents + 619 skills available in Chat (agent picker + /skills)?",
    "Deploy agents & skills",
    "Not now"
  );
  if (pick === "Deploy agents & skills") {
    await vscode.commands.executeCommand("learningos.deployCatalog");
  }
}

type FlintSetupResult = "registered" | "present" | "disabled" | "no-folder";

/**
 * Register the local Flint-Chart MCP server in this workspace's .vscode/mcp.json.
 * Idempotent and non-destructive. When `announce` is true it shows status toasts
 * (used by the standalone "Set up LearningOS" command); when false it stays quiet
 * (used by "Set up everything", which shows one combined message).
 */
async function setupFlintChart(opts: { announce: boolean }): Promise<FlintSetupResult> {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    if (opts.announce) {
      void vscode.window.showWarningMessage("Open a folder first, then run 'Drona: Set up LearningOS'.");
    }
    return "no-folder";
  }
  const enable = vscode.workspace.getConfiguration("learningos").get<boolean>("enableFlintCharts", true);
  if (!enable) {
    if (opts.announce) {
      void vscode.window.showInformationMessage(
        "Flint-Chart setup is disabled in settings (learningos.enableFlintCharts)."
      );
    }
    return "disabled";
  }

  const mcpUri = vscode.Uri.joinPath(folder.uri, ".vscode", "mcp.json");
  let config: { servers?: Record<string, unknown> } = { servers: {} };
  try {
    const existing = await vscode.workspace.fs.readFile(mcpUri);
    config = JSON.parse(Buffer.from(existing).toString("utf8"));
    config.servers = config.servers ?? {};
  } catch {
    /* file doesn't exist yet — start fresh */
  }

  if (config.servers && (config.servers as Record<string, unknown>)["flint-chart"]) {
    // Idempotent: leave an already-configured mcp.json untouched.
    if (opts.announce) {
      void vscode.window.showInformationMessage("Flint-Chart MCP already configured for this workspace.");
    }
    return "present";
  }

  (config.servers as Record<string, unknown>)["flint-chart"] = {
    type: "stdio",
    command: "npx",
    args: ["-y", "flint-chart-mcp"],
  };
  const bytes = Buffer.from(JSON.stringify(config, null, 2) + "\n", "utf8");
  await vscode.workspace.fs.writeFile(mcpUri, bytes);
  if (opts.announce) {
    void vscode.window.showInformationMessage(
      "Flint-Chart MCP registered for this workspace. Ask '@drona /charts' or click 'Render with Flint-Chart' on the dashboard."
    );
  }
  return "registered";
}

const FIRST_RUN_KEY = "learningos.firstRunOffered";

/** True if the catalog marker already exists under ~/.copilot (already deployed to user). */
async function isCatalogDeployedToUser(): Promise<boolean> {
  try {
    const uri = vscode.Uri.joinPath(vscode.Uri.file(os.homedir()), ".copilot", ".learningos-deployed.json");
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch {
    return false;
  }
}

/**
 * One-time, consent-based first-run offer. Shows a single prominent prompt with
 * [Set up everything] / [Later] buttons; "Set up everything" deploys the full
 * catalog to ~/.copilot and enables Flint-Chart. The flag is set up front so the
 * offer never appears twice (even if dismissed or the window reloads mid-prompt),
 * and it never writes anything to disk without an explicit button click.
 */
async function offerFirstRunSetup(context: vscode.ExtensionContext): Promise<void> {
  if (context.globalState.get<boolean>(FIRST_RUN_KEY)) {
    return;
  }
  // Already deployed on this machine → just remember and stay quiet.
  if (await isCatalogDeployedToUser()) {
    await context.globalState.update(FIRST_RUN_KEY, true);
    return;
  }
  // Mark as offered before awaiting the prompt so it can never nag twice.
  await context.globalState.update(FIRST_RUN_KEY, true);

  const choice = await vscode.window.showInformationMessage(
    "Set up LearningOS — deploy 128 specialist agents + 619 skills to ~/.copilot " +
      "(works in VS Code Chat AND the Copilot CLI) and enable progress charts?",
    "Set up everything",
    "Later"
  );
  if (choice === "Set up everything") {
    await setupEverything(context, { consented: true });
  }
}

/**
 * Deploy the full catalog to the user profile (~/.copilot) AND enable the
 * Flint-Chart MCP — the "install everything" path (parity with the plugin).
 * Consent-based: shows its own confirmation unless the caller already obtained it
 * (e.g. the first-run button), and never writes to ~/.copilot without a click.
 */
async function setupEverything(context: vscode.ExtensionContext, opts: { consented?: boolean } = {}): Promise<void> {
  if (!opts.consented) {
    const go = await vscode.window.showInformationMessage(
      "Set up LearningOS: deploy the full catalog (128 specialist agents + 619 skills) to your user " +
        "profile (~/.copilot) so it works in VS Code Chat AND the Copilot CLI, and enable Flint-Chart progress charts?",
      {
        modal: true,
        detail:
          "Only LearningOS's own files are written under ~/.copilot — nothing is deleted. " +
          "You can re-run this anytime; it's idempotent.",
      },
      "Set up everything"
    );
    if (go !== "Set up everything") {
      return;
    }
  }

  // Deploy to the user profile with consent already granted (skip the extra modal),
  // silent so we can show a single combined completion message.
  const result = await deployCatalog(context, { target: "user", skipConfirm: true, silent: true });
  const flint = await setupFlintChart({ announce: false });

  if (!result.ok) {
    if (!result.cancelled) {
      void vscode.window.showWarningMessage(
        "LearningOS setup didn't complete. Try 'Drona: Deploy all LearningOS agents & skills'."
      );
    }
    return;
  }

  const parts: string[] = [
    result.alreadyDeployed
      ? `The catalog was already deployed to ${result.targetLabel}.`
      : `Deployed ${result.agents} agents + ${result.skills} skills to ${result.targetLabel}.`,
  ];
  if (flint === "registered") {
    parts.push("Flint-Chart MCP enabled for this workspace.");
  } else if (flint === "present") {
    parts.push("Flint-Chart MCP was already enabled here.");
  } else if (flint === "no-folder") {
    parts.push("Open a folder and run 'Drona: Set up LearningOS' to enable Flint-Chart progress visuals.");
  }
  parts.push("Open the agent picker or type / in Chat to use them.");
  void vscode.window.showInformationMessage("LearningOS is ready. " + parts.join(" "));
}

/**
 * Guide the learner through enabling real code execution. The public Piston
 * `/execute` is now whitelist-only (HTTP 401), so we steer to a self-hosted
 * Piston (free/offline) first, then a keyed provider, then the public runner.
 */
async function setupCodeExecution(context: vscode.ExtensionContext): Promise<void> {
  interface RunnerPick extends vscode.QuickPickItem {
    id: "selfhost" | "keyed" | "public";
  }
  const items: RunnerPick[] = [
    {
      id: "selfhost",
      label: "$(server-environment) Self-host Piston (free, offline, no key)",
      description: "Recommended",
      detail: "Run Piston locally with Docker — unlimited, private, works offline, 90+ languages.",
    },
    {
      id: "keyed",
      label: "$(key) Use onlinecompiler.io (needs an API key)",
      detail: "Sign up, create an API key, and paste it. Runs in the cloud.",
    },
    {
      id: "public",
      label: "$(globe) Just use the public Piston (may require whitelist / 401)",
      detail: "No setup, but keyless public execution is often blocked now (HTTP 401).",
    },
  ];
  const pick = await vscode.window.showQuickPick(items, {
    title: "Set up code execution (run code with no local install)",
    placeHolder: "How should Drona run your code (90+ languages)?",
    ignoreFocusOut: true,
  });
  if (!pick) {
    return;
  }

  const cfg = vscode.workspace.getConfiguration("learningos.codeRunner");

  if (pick.id === "selfhost") {
    await openCodeExecGuide(context);
    const done = await vscode.window.showInformationMessage(
      "Start Piston locally, then point Drona at it:\n\n" +
        "docker run -d --name piston -p 2000:2000 ghcr.io/engineer-man/piston",
      {
        modal: true,
        detail:
          "After the container is running, install languages via the Piston package API, e.g.:\n" +
          'curl -s -X POST http://localhost:2000/api/v2/packages -H "Content-Type: application/json" ' +
          '-d \'{"language":"python","version":"3.12.0"}\'\n\n' +
          "Then Drona will run code offline with no rate limits. Full steps are in the guide that just opened.",
      },
      "Use http://localhost:2000/api/v2"
    );
    if (done === "Use http://localhost:2000/api/v2") {
      await cfg.update("provider", "piston", vscode.ConfigurationTarget.Global);
      await cfg.update("baseUrl", "http://localhost:2000/api/v2", vscode.ConfigurationTarget.Global);
      await cfg.update("apiKey", "", vscode.ConfigurationTarget.Global);
      void vscode.window.showInformationMessage(
        "Drona will now run code on your self-hosted Piston (http://localhost:2000/api/v2)."
      );
    }
    return;
  }

  if (pick.id === "keyed") {
    await vscode.env.openExternal(vscode.Uri.parse("https://onlinecompiler.io/"));
    const key = await vscode.window.showInputBox({
      title: "onlinecompiler.io API key",
      prompt: "Sign up at onlinecompiler.io / onecompiler, create an API key, and paste it here.",
      placeHolder: "Paste your API key",
      password: true,
      ignoreFocusOut: true,
    });
    if (!key || !key.trim()) {
      void vscode.window.showInformationMessage(
        "No key entered. Get one at onlinecompiler.io, then run 'Drona: Set up code execution' again."
      );
      return;
    }
    // Confirm/adjust the run endpoint (hosts differ across sources — onlinecompiler.io vs
    // onecompiler.com), defaulting to the documented OneCompiler run API.
    const endpoint = await vscode.window.showInputBox({
      title: "onlinecompiler run endpoint",
      prompt: "Your provider's run API URL. Adjust it to match whichever service you signed up for.",
      value: "https://api.onecompiler.com/v1/run",
      ignoreFocusOut: true,
    });
    await cfg.update("provider", "onlinecompiler", vscode.ConfigurationTarget.Global);
    // Store the key in SecretStorage (encrypted, NOT synced) instead of the plaintext settings
    // file, and clear any plaintext value so it never rides along via Settings Sync.
    await context.secrets.store(CODE_RUNNER_API_KEY_SECRET, key.trim());
    await cfg.update("apiKey", "", vscode.ConfigurationTarget.Global);
    if (endpoint && endpoint.trim()) {
      await cfg.update("onlinecompilerEndpoint", endpoint.trim(), vscode.ConfigurationTarget.Global);
    }
    void vscode.window.showInformationMessage(
      "Saved your onlinecompiler API key securely (VS Code SecretStorage). Drona will run code via onlinecompiler. " +
        "Adjust learningos.codeRunner.onlinecompilerEndpoint in Settings if runs fail."
    );
    return;
  }

  // public Piston
  await cfg.update("provider", "piston", vscode.ConfigurationTarget.Global);
  await cfg.update("baseUrl", "https://emkc.org/api/v2/piston", vscode.ConfigurationTarget.Global);
  // Clear the plaintext key so it can never be sent to the public (third-party) Piston host —
  // mirrors the self-host branch. The Piston path is keyless by design; this is belt-and-suspenders.
  await cfg.update("apiKey", "", vscode.ConfigurationTarget.Global);
  void vscode.window.showWarningMessage(
    "Using the public Piston. Keyless public execution is often whitelist-only and can return HTTP 401 — " +
      "if runs fail, re-run 'Drona: Set up code execution' and choose self-hosting."
  );
}

/** Open the bundled code-execution guide (rendered Markdown preview, with fallbacks). */
async function openCodeExecGuide(context: vscode.ExtensionContext): Promise<void> {
  const uri = vscode.Uri.joinPath(context.extensionUri, "media", "codeexec.md");
  try {
    await vscode.commands.executeCommand("markdown.showPreview", uri);
    return;
  } catch {
    /* fall through to opening as a text document */
  }
  try {
    const doc = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(doc);
  } catch {
    /* guide is best-effort */
  }
}

/** Write the latest profile from persisted data and open it. */
async function showProgress(context: vscode.ExtensionContext): Promise<void> {
  try {
    const uri = await writeProfile(context);
    if (uri) {
      const doc = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(doc);
      return;
    }
  } catch {
    /* fall through to guidance below */
  }
  const pick = await vscode.window.showInformationMessage(
    "No learner profile yet. Ask '@drona' to onboard you and it will start one.",
    "Open Chat"
  );
  if (pick === "Open Chat") {
    void vscode.commands.executeCommand("workbench.action.chat.open", { query: "@drona /resume" });
  }
}
