// Build-time bundler for the LearningOS MCP server.
//
// Copies the small catalog data the server serves (the generated registry, the
// three data catalogs, and the constitution) from the repo root into `mcp/content/`
// so the published npm package works standalone (no repo checkout required).
//
// Full skill/agent BODIES are NOT bundled (they are large); `get_skill`/`get_agent`
// read those from a resolved LearningOS root when available and otherwise return the
// registry description + path. Reads the repo root one level up; writes ONLY inside
// `mcp/content/`.

import { promises as fs } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MCP_DIR = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(MCP_DIR, "..");
const CONTENT = path.join(MCP_DIR, "content");

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyInto(rel) {
  const src = path.join(REPO_ROOT, rel);
  if (!(await exists(src))) {
    throw new Error(`missing expected source: ${rel}`);
  }
  const dest = path.join(CONTENT, path.basename(rel));
  await fs.copyFile(src, dest);
  return path.basename(rel);
}

async function main() {
  await fs.rm(CONTENT, { recursive: true, force: true });
  await fs.mkdir(CONTENT, { recursive: true });

  const copied = [];
  copied.push(await copyInto("marketplace/registry.json"));
  copied.push(await copyInto("AGENTS.md"));
  for (const f of ["news-feeds.json", "roadmaps.json", "learning-resources.json"]) {
    copied.push(await copyInto(path.join("data", f)));
  }

  console.log(`LearningOS MCP content bundled -> mcp/content/: ${copied.join(", ")}`);
}

main().catch((err) => {
  console.error("bundle failed:", err.message);
  process.exit(1);
});
