// Runtime access to the bundled LearningOS catalog (shipped under `content/` by
// scripts/bundle-content.mjs).
//
// Two jobs:
//   1. Give the extension a Uri to the bundled content so `learningos.deployCatalog`
//      can install the whole catalog into a location VS Code Copilot discovers.
//   2. Build a COMPACT, size-bounded catalog index from `content/registry.json` that
//      is injected into Drona's system prompt so `@drona` can route the learner to the
//      exact specialist agent or `/skill` — without dumping all 511 names verbatim.

import * as vscode from "vscode";

/** Shape of the parts of `registry.json` we consume (best-effort, tolerant of extras). */
interface RegistryAgent {
  slug: string;
  name: string;
}
interface AgentPack {
  domain: string;
  agents?: string[];
}
interface SkillPack {
  domain: string;
  skills?: string[];
}
export interface Registry {
  counts?: { agents?: number; skills?: number; roles?: number };
  packs?: AgentPack[];
  skillPacks?: SkillPack[];
  agents?: RegistryAgent[];
}

/** Hard cap on the injected catalog index (~5KB) so it can never bloat the system prompt. */
const CATALOG_INDEX_MAX_CHARS = 5_120;

/** Uri of the bundled `content/` directory inside the packaged extension. */
export function contentUri(context: vscode.ExtensionContext, ...segments: string[]): vscode.Uri {
  return vscode.Uri.joinPath(context.extensionUri, "content", ...segments);
}

/** Read + parse the bundled registry.json, or undefined if it's missing/corrupt. */
export async function loadRegistry(context: vscode.ExtensionContext): Promise<Registry | undefined> {
  try {
    const bytes = await vscode.workspace.fs.readFile(contentUri(context, "registry.json"));
    const parsed = JSON.parse(Buffer.from(bytes).toString("utf8"));
    return parsed && typeof parsed === "object" ? (parsed as Registry) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Build a compact, bounded index of the catalog for Drona's system prompt:
 *   - specialist agents grouped by domain (display names), so Drona can name the
 *     right agent to switch to in the Chat agent picker;
 *   - skill packs by domain with a count + a few example `/skill` names.
 * Never emits all 511 skill names; the whole string is hard-capped.
 */
export function buildCatalogIndex(reg: Registry): string {
  const nameBySlug = new Map<string, string>();
  for (const a of reg.agents ?? []) {
    if (a && typeof a.slug === "string" && typeof a.name === "string") {
      nameBySlug.set(a.slug, a.name);
    }
  }

  const agentCount = reg.counts?.agents ?? reg.agents?.length ?? 0;
  const skillCount = reg.counts?.skills ?? 0;

  const lines: string[] = [];
  lines.push(
    `LEARNINGOS CATALOG — once the learner runs "Drona: Deploy all LearningOS agents & skills", ` +
      `${agentCount} specialist agents (Chat agent picker) and ${skillCount} skills (type "/" in Chat) ` +
      `become available. Point the learner to the most relevant one by name.`
  );

  lines.push("", "Specialist agents by domain:");
  for (const pack of reg.packs ?? []) {
    const names = (pack.agents ?? []).map((s) => nameBySlug.get(s) ?? s);
    if (names.length) {
      lines.push(`- ${pack.domain}: ${names.join(", ")}`);
    }
  }

  lines.push("", "Skill packs (invoke a skill as /<name>):");
  for (const sp of reg.skillPacks ?? []) {
    const all = sp.skills ?? [];
    if (!all.length) {
      continue;
    }
    const examples = all.slice(0, 2).join(", ");
    lines.push(`- ${sp.domain} (${all.length}): ${examples}${all.length > 2 ? ", …" : ""}`);
  }

  let out = lines.join("\n");
  if (out.length > CATALOG_INDEX_MAX_CHARS) {
    out = out.slice(0, CATALOG_INDEX_MAX_CHARS - 24).trimEnd() + "\n…(catalog truncated)";
  }
  return out;
}
