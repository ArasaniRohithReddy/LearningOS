import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

// LearningOS self-check. Verifies the repo is internally consistent and house-style compliant.
// Exit code 1 on any error (usable in CI). Run:  node scripts/validate.mjs

const ROOT = process.cwd();
const AGENTS = join(ROOT, ".github/agents");
const SKILLS = join(ROOT, ".github/skills");
const ROLES = join(ROOT, ".github/roles");
const REG = join(ROOT, "marketplace/registry.json");

const strip = (s) => s.trim().replace(/^["']|["']$/g, "");
const flat = (s) => s.replace(/\s+/g, " ");
const errs = [];
const warns = [];

const reg = existsSync(REG) ? JSON.parse(await readFile(REG, "utf8")) : null;
if (!reg) errs.push("marketplace/registry.json missing — run: node scripts/build-registry.mjs");

const agentFiles = (await readdir(AGENTS)).filter((f) => f.endsWith(".agent.md"));
const skillDirs = (await readdir(SKILLS, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
const roleFiles = (await readdir(ROLES)).filter((f) => f.endsWith(".role.yml") && !f.startsWith("_"));

// Counts vs registry
if (reg) {
  if (reg.counts.agents !== agentFiles.length) errs.push(`agents on-disk ${agentFiles.length} != registry ${reg.counts.agents}`);
  if (reg.counts.skills !== skillDirs.length) errs.push(`skills on-disk ${skillDirs.length} != registry ${reg.counts.skills}`);
  if (reg.counts.roles !== roleFiles.length) errs.push(`roles on-disk ${roleFiles.length} != registry ${reg.counts.roles}`);
}

// Agents: unique names, footer-in-description, frontmatter
const names = new Set();
for (const f of agentFiles) {
  const t = await readFile(join(AGENTS, f), "utf8");
  const m = t.match(/^name:\s*(.+)$/m);
  if (!m) { errs.push(`agent ${f}: no name`); continue; }
  const n = strip(m[1]);
  if (names.has(n)) errs.push(`agent duplicate name: ${n}`);
  names.add(n);
  const desc = (t.match(/^description:\s*(.+)$/m) || [])[1] || "";
  if (!/Learning Footer/i.test(desc)) warns.push(`agent ${f}: description doesn't mention the Learning Footer`);
}

// Drona allow-list
const dronaPath = join(AGENTS, "drona.agent.md");
if (existsSync(dronaPath)) {
  const drona = await readFile(dronaPath, "utf8");
  const am = drona.match(/^agents:\s*(\[.*\])\s*$/m);
  if (!am) errs.push("drona.agent.md: no `agents:` allow-list");
  else {
    let allow;
    try { allow = JSON.parse(am[1]); } catch { errs.push("drona.agent.md: allow-list is not valid JSON"); allow = []; }
    if (new Set(allow).size !== allow.length) errs.push("drona allow-list has duplicates");
    if (allow.length !== agentFiles.length - 1) errs.push(`drona allow-list ${allow.length} != agents-1 (${agentFiles.length - 1})`);
    for (const nm of allow) if (!names.has(nm)) errs.push(`drona lists missing agent: ${nm}`);
  }
}

// Skills: folder==name, 3-level AGENTS.md link, footer, Output shape
for (const dir of skillDirs) {
  const p = join(SKILLS, dir, "SKILL.md");
  if (!existsSync(p)) { errs.push(`skill ${dir}: no SKILL.md`); continue; }
  const t = await readFile(p, "utf8");
  const nm = t.match(/^name:\s*(.+)$/m);
  if (!nm || strip(nm[1]) !== dir) errs.push(`skill ${dir}: name != folder (${nm && strip(nm[1])})`);
  if (!t.includes("../../../AGENTS.md")) errs.push(`skill ${dir}: missing 3-level ../../../AGENTS.md link`);
  if (!/Learning Footer/i.test(flat(t))) errs.push(`skill ${dir}: no Learning Footer note`);
  if (!/##\s*Output shape/i.test(t)) errs.push(`skill ${dir}: no '## Output shape' section`);
}

// Categorization (registry packs)
if (reg) {
  const inSkillPacks = reg.skillPacks.reduce((n, p) => n + p.skills.length, 0);
  if (inSkillPacks !== skillDirs.length) errs.push(`${skillDirs.length - inSkillPacks} skills uncategorized in registry packs`);
  const gen = (reg.packs.find((p) => p.id === "general") || { agents: [] }).agents.length;
  if (gen > 0) warns.push(`${gen} agents in the 'General' pack (consider a DOMAIN_RULES bucket)`);
}

// Manifest count/version consistency — prevents drift across distribution surfaces (plugin, docs, dist)
if (reg) {
  const MANIFESTS = ["plugin.json", ".claude-plugin/plugin.json", ".cursor-plugin/plugin.json", "gemini-extension.json"];
  let refVersion = null;
  const extPkg = join(ROOT, "extension/package.json");
  if (existsSync(extPkg)) {
    try { refVersion = JSON.parse(await readFile(extPkg, "utf8")).version; } catch { /* ignore */ }
  }
  for (const rel of MANIFESTS) {
    const p = join(ROOT, rel);
    if (!existsSync(p)) continue;
    let m;
    try { m = JSON.parse(await readFile(p, "utf8")); } catch { errs.push(`${rel}: invalid JSON`); continue; }
    const cited = /(\d+)\s+skills/i.exec(m.description || "");
    if (cited && Number(cited[1]) !== reg.counts.skills) {
      errs.push(`${rel}: description cites ${cited[1]} skills but registry has ${reg.counts.skills}`);
    }
    if (refVersion && m.version && m.version !== refVersion) {
      warns.push(`${rel}: version ${m.version} != extension version ${refVersion}`);
    }
  }
}

// Report
console.log(`LearningOS validate — ${agentFiles.length} agents / ${skillDirs.length} skills / ${roleFiles.length} roles`);
if (warns.length) console.log(`\nWarnings (${warns.length}):\n- ${warns.join("\n- ")}`);
if (errs.length) {
  console.error(`\n❌ FAIL (${errs.length} error${errs.length > 1 ? "s" : ""}):\n- ${errs.join("\n- ")}`);
  process.exit(1);
} else {
  console.log("\n✅ PASS — repo is consistent and house-style compliant.");
}
