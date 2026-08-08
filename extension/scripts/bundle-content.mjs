// Build-time content bundler for the LearningOS — Drona extension.
//
// Copies the FULL LearningOS catalog from the repo root into `extension/content/`
// so the packaged .vsix ships it and the `learningos.deployCatalog` command can
// install every agent + skill into a location VS Code Copilot discovers natively.
//
// Boundaries (enforced below):
//   * READS   : the repo root one level above the extension (../.github, ../AGENTS.md,
//               ../marketplace/registry.json). Read-only.
//   * WRITES  : ONLY inside `extension/content/`. Any attempt to resolve a write
//               outside the extension directory aborts the build.
//
// It copies:
//   ../.github/agents/*.agent.md   -> content/agents/   (EXCEPT drona.agent.md — the
//                                     extension keeps its own branded @drona participant,
//                                     so shipping a second "Drona" agent would collide)
//   ../.github/skills/**           -> content/skills/    (all skill folders, full SKILL.md)
//   ../.github/roles/*.role.yml    -> content/roles/     (incl. _TEMPLATE.role.yml)
//   ../AGENTS.md                   -> content/AGENTS.md
//   ../marketplace/registry.json   -> content/registry.json
//
// No runtime dependencies; uses Node's built-in fs/path/url only.

import { promises as fs } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXTENSION_DIR = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(EXTENSION_DIR, "..");
const CONTENT_DIR = path.join(EXTENSION_DIR, "content");

/** The one agent we deliberately do NOT bundle (the extension is its own Drona). */
const EXCLUDED_AGENT = "drona.agent.md";

/** Refuse to write anything outside `extension/content/`. */
function assertInsideContent(target) {
  const resolved = path.resolve(target);
  const root = path.resolve(CONTENT_DIR);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    throw new Error(`refusing to write outside content/: ${resolved}`);
  }
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function requireSource(p, label) {
  if (!(await exists(p))) {
    throw new Error(`missing expected source ${label}: ${p}`);
  }
}

/** Copy one file into content/, creating parent dirs. */
async function copyFileInto(src, dest) {
  assertInsideContent(dest);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
}

/** Recursively copy a directory tree into content/. Returns the number of files copied. */
async function copyDir(srcDir, destDir) {
  assertInsideContent(destDir);
  await fs.mkdir(destDir, { recursive: true });
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  let files = 0;
  for (const entry of entries) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      files += await copyDir(src, dest);
    } else if (entry.isFile()) {
      await copyFileInto(src, dest);
      files += 1;
    }
  }
  return files;
}

async function main() {
  // Validate sources up front so a broken repo layout fails loudly.
  const agentsSrc = path.join(REPO_ROOT, ".github", "agents");
  const skillsSrc = path.join(REPO_ROOT, ".github", "skills");
  const rolesSrc = path.join(REPO_ROOT, ".github", "roles");
  const agentsMdSrc = path.join(REPO_ROOT, "AGENTS.md");
  const registrySrc = path.join(REPO_ROOT, "marketplace", "registry.json");

  await requireSource(agentsSrc, ".github/agents");
  await requireSource(skillsSrc, ".github/skills");
  await requireSource(rolesSrc, ".github/roles");
  await requireSource(agentsMdSrc, "AGENTS.md");
  await requireSource(registrySrc, "marketplace/registry.json");

  // Start from a clean content/ so counts are exact and stale files never linger.
  assertInsideContent(CONTENT_DIR);
  await fs.rm(CONTENT_DIR, { recursive: true, force: true });
  await fs.mkdir(CONTENT_DIR, { recursive: true });

  // --- agents (exclude drona.agent.md) ---
  const agentsDest = path.join(CONTENT_DIR, "agents");
  await fs.mkdir(agentsDest, { recursive: true });
  let agentCount = 0;
  let excluded = 0;
  for (const entry of await fs.readdir(agentsSrc, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".agent.md")) {
      continue;
    }
    if (entry.name === EXCLUDED_AGENT) {
      excluded += 1;
      continue;
    }
    await copyFileInto(path.join(agentsSrc, entry.name), path.join(agentsDest, entry.name));
    agentCount += 1;
  }

  // --- skills (full recursive copy of every folder) ---
  const skillsDest = path.join(CONTENT_DIR, "skills");
  await copyDir(skillsSrc, skillsDest);
  const skillFolders = (await fs.readdir(skillsSrc, { withFileTypes: true })).filter((e) => e.isDirectory()).length;
  const skillFoldersOut = (await fs.readdir(skillsDest, { withFileTypes: true })).filter((e) => e.isDirectory()).length;

  // --- roles (incl. _TEMPLATE.role.yml) ---
  const rolesDest = path.join(CONTENT_DIR, "roles");
  await fs.mkdir(rolesDest, { recursive: true });
  let roleCount = 0;
  for (const entry of await fs.readdir(rolesSrc, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".role.yml")) {
      await copyFileInto(path.join(rolesSrc, entry.name), path.join(rolesDest, entry.name));
      roleCount += 1;
    }
  }

  // --- single files ---
  await copyFileInto(agentsMdSrc, path.join(CONTENT_DIR, "AGENTS.md"));
  await copyFileInto(registrySrc, path.join(CONTENT_DIR, "registry.json"));

  // --- data catalogs (curated feeds + roadmaps) so the News/Roadmaps views work offline ---
  const dataSrc = path.join(REPO_ROOT, "data");
  let dataCount = 0;
  if (await exists(dataSrc)) {
    const dataDest = path.join(CONTENT_DIR, "data");
    await fs.mkdir(dataDest, { recursive: true });
    for (const entry of await fs.readdir(dataSrc, { withFileTypes: true })) {
      // Ship only the JSON catalogs the extension reads at runtime (skip OPML/README).
      if (entry.isFile() && entry.name.endsWith(".json")) {
        await copyFileInto(path.join(dataSrc, entry.name), path.join(dataDest, entry.name));
        dataCount += 1;
      }
    }
  }
  if (dataCount < 2) {
    throw new Error(`expected news-feeds.json + roadmaps.json in data/, bundled ${dataCount}`);
  }

  // --- summary ---
  console.log("LearningOS content bundled into extension/content/:");
  console.log(`  agents  : ${agentCount} .agent.md  (excluded ${excluded}: ${EXCLUDED_AGENT})`);
  console.log(`  skills  : ${skillFolders} folders -> ${skillFoldersOut} in content/skills`);
  console.log(`  roles   : ${roleCount} .role.yml`);
  console.log(`  data    : ${dataCount} JSON catalog(s)`);
  console.log(`  files   : AGENTS.md, registry.json`);

  if (skillFolders !== skillFoldersOut) {
    throw new Error(`skill folder count mismatch: source ${skillFolders} vs bundled ${skillFoldersOut}`);
  }
}

main().catch((err) => {
  console.error("bundle-content failed:", err.message);
  process.exit(1);
});
