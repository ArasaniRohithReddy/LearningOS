// Loads the LearningOS catalog for the MCP server.
//
// Small data (the generated registry, the 3 data catalogs, the constitution) is
// read from the bundled `content/` dir, so the server works standalone. Full
// skill/agent BODIES are read from a resolved LearningOS repo root when available
// (env LEARNINGOS_ROOT, the repo the package lives in, or a walk-up from cwd);
// otherwise the registry description + path is returned.

import { promises as fs } from "node:fs";
import { existsSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(PKG_ROOT, "content");

export interface RegistryAgent {
  slug: string;
  name: string;
  description?: string;
  tools?: string[];
  path?: string;
}
export interface RegistrySkill {
  name: string;
  description?: string;
  argumentHint?: string;
  path?: string;
}
export interface Registry {
  counts?: { agents?: number; skills?: number; roles?: number };
  generatedAt?: string;
  packs?: { domain: string; agents?: string[] }[];
  skillPacks?: { domain: string; skills?: string[] }[];
  agents?: RegistryAgent[];
  skills?: RegistrySkill[];
  roles?: { slug: string; name: string }[];
}
export interface Resource {
  name: string;
  url: string;
  type: string;
  domain: string;
  level: string;
  cost: string;
  description?: string;
}
export interface Roadmap {
  title: string;
  slug: string;
  url: string;
  type: string;
  description?: string;
}
export interface FeedSource {
  id: string;
  name: string;
  url: string;
  type: string;
  category: string;
  topics?: string[];
  homepage?: string;
}

const cache = new Map<string, unknown>();

async function readContent<T>(file: string): Promise<T> {
  if (cache.has(file)) return cache.get(file) as T;
  const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
  const parsed = file.endsWith(".json") ? (JSON.parse(raw) as T) : (raw as unknown as T);
  cache.set(file, parsed);
  return parsed;
}

/** Resolve a LearningOS repo root (for full skill/agent bodies), or undefined. */
export function learningosRoot(): string | undefined {
  const looksRight = (dir: string) =>
    existsSync(path.join(dir, "marketplace", "registry.json")) && existsSync(path.join(dir, ".github", "skills"));
  const envRoot = process.env.LEARNINGOS_ROOT;
  if (envRoot && looksRight(envRoot)) return envRoot;
  // The package may live inside the repo (…/LearningOS/mcp) → its parent is the root.
  const parent = path.resolve(PKG_ROOT, "..");
  if (looksRight(parent)) return parent;
  // Walk up from the current working directory.
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    if (looksRight(dir)) return dir;
    const up = path.dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return undefined;
}

export const getRegistry = () => readContent<Registry>("registry.json");
export const getConstitution = () => readContent<string>("AGENTS.md");
export const getResources = async () => (await readContent<{ resources: Resource[] }>("learning-resources.json")).resources ?? [];
export const getRoadmaps = async () => (await readContent<{ roadmaps: Roadmap[] }>("roadmaps.json")).roadmaps ?? [];
export const getFeeds = async () =>
  (await readContent<{ feeds: FeedSource[]; categories?: Record<string, { label: string }> }>("news-feeds.json"));

const norm = (s: string) => s.toLowerCase();

export async function searchSkills(query?: string, domain?: string, limit = 40) {
  const reg = await getRegistry();
  const domainOf = new Map<string, string>();
  for (const p of reg.skillPacks ?? []) for (const n of p.skills ?? []) domainOf.set(n, p.domain);
  const q = query ? norm(query) : "";
  const d = domain ? norm(domain) : "";
  const out = (reg.skills ?? [])
    .map((s) => ({ ...s, domain: domainOf.get(s.name) ?? "General" }))
    .filter((s) => (!q || norm(s.name).includes(q) || norm(s.description ?? "").includes(q)))
    .filter((s) => (!d || norm(s.domain).includes(d)))
    .slice(0, Math.max(1, Math.min(limit, 100)));
  return out;
}

export async function searchAgents(query?: string, domain?: string, limit = 40) {
  const reg = await getRegistry();
  const domainOf = new Map<string, string>();
  for (const p of reg.packs ?? []) for (const slug of p.agents ?? []) domainOf.set(slug, p.domain);
  const q = query ? norm(query) : "";
  const d = domain ? norm(domain) : "";
  return (reg.agents ?? [])
    .map((a) => ({ ...a, domain: domainOf.get(a.slug) ?? "General" }))
    .filter((a) => (!q || norm(a.slug).includes(q) || norm(a.name).includes(q) || norm(a.description ?? "").includes(q)))
    .filter((a) => (!d || norm(a.domain).includes(d)))
    .slice(0, Math.max(1, Math.min(limit, 100)));
}

async function readBody(relFromRepo: string): Promise<string | undefined> {
  const root = learningosRoot();
  if (!root) return undefined;
  try {
    return await fs.readFile(path.join(root, relFromRepo), "utf8");
  } catch {
    return undefined;
  }
}

export async function getSkillBody(name: string): Promise<{ found: boolean; text: string }> {
  const reg = await getRegistry();
  const s = (reg.skills ?? []).find((x) => x.name === name);
  if (!s) return { found: false, text: `No skill named "${name}". Try search_skills.` };
  const body = await readBody(s.path ?? `.github/skills/${name}/SKILL.md`);
  if (body) return { found: true, text: body };
  return {
    found: true,
    text:
      `# ${name}\n\n${s.description ?? ""}\n\n(Full skill body available when the LearningOS repo is present — ` +
      `set LEARNINGOS_ROOT to the repo path, or clone https://github.com/ArasaniRohithReddy/LearningOS. Path: ${s.path})`,
  };
}

export async function getAgentBody(nameOrSlug: string): Promise<{ found: boolean; text: string }> {
  const reg = await getRegistry();
  const a = (reg.agents ?? []).find((x) => x.slug === nameOrSlug || norm(x.name) === norm(nameOrSlug));
  if (!a) return { found: false, text: `No agent "${nameOrSlug}". Try search_agents.` };
  const body = await readBody(a.path ?? `.github/agents/${a.slug}.agent.md`);
  if (body) return { found: true, text: body };
  return {
    found: true,
    text:
      `# ${a.name}\n\n${a.description ?? ""}\n\n(Full agent body available when the LearningOS repo is present — ` +
      `set LEARNINGOS_ROOT or clone the repo. Path: ${a.path})`,
  };
}

export async function findResources(opts: { topic?: string; domain?: string; type?: string; level?: string; limit?: number }) {
  const all = await getResources();
  const q = opts.topic ? norm(opts.topic) : "";
  const d = opts.domain ? norm(opts.domain) : "";
  const t = opts.type ? norm(opts.type) : "";
  const l = opts.level ? norm(opts.level) : "";
  return all
    .filter((r) => (!d || norm(r.domain) === d))
    .filter((r) => (!t || norm(r.type) === t))
    .filter((r) => (!l || norm(r.level) === l || r.level === "all"))
    .filter((r) => (!q || norm(r.name).includes(q) || norm(r.description ?? "").includes(q) || norm(r.domain).includes(q)))
    .slice(0, Math.max(1, Math.min(opts.limit ?? 25, 80)));
}

export async function findRoadmaps(query?: string, type?: string, limit = 60) {
  const all = await getRoadmaps();
  const q = query ? norm(query) : "";
  const t = type ? norm(type) : "";
  return all
    .filter((r) => (!t || norm(r.type) === t))
    .filter((r) => (!q || norm(r.title).includes(q) || norm(r.slug).includes(q) || norm(r.description ?? "").includes(q)))
    .slice(0, Math.max(1, Math.min(limit, 140)));
}
