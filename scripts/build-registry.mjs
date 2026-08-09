#!/usr/bin/env node
// LearningOS — Marketplace registry generator
//
// Scans the repo's Copilot primitives (agents, skills, roles) and emits a
// machine-readable registry plus a human-readable catalog, so LearningOS can be
// browsed and distributed like a plugin marketplace (see docs/Marketplace.md).
//
// Usage:  node scripts/build-registry.mjs
// Output: marketplace/registry.json  and  marketplace/CATALOG.md
//
// No external dependencies — uses a minimal, defensive frontmatter reader so it
// runs anywhere Node 18+ is available.

import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const AGENTS_DIR = join(ROOT, ".github", "agents");
const SKILLS_DIR = join(ROOT, ".github", "skills");
const ROLES_DIR = join(ROOT, ".github", "roles");
const OUT_DIR = join(ROOT, "marketplace");

// --- tiny helpers ------------------------------------------------------------

// Grab the YAML frontmatter block (between the first two `---` fences).
function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : "";
}

// Read a scalar `key: value` from a block; strips matching surrounding quotes.
function scalar(block, key, { indent = "" } = {}) {
  const re = new RegExp(`^${indent}${key}:\\s*(.+?)\\s*$`, "m");
  const m = block.match(re);
  if (!m) return null;
  let v = m[1].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  return v;
}

// Parse an inline list like `[a, b, c]`.
function inlineList(block, key) {
  const raw = scalar(block, key);
  if (!raw) return [];
  const m = raw.match(/^\[(.*)\]$/);
  if (!m) return [];
  return m[1].split(",").map((s) => s.trim()).filter(Boolean);
}

// Best-effort domain tag from a slug/name (for marketplace browsing).
const CORE_MENTORS = new Set([
  "coding-mentor", "research-analyst", "interview-coach",
  "exam-coach", "career-mentor", "meeting-prep",
]);
const DOMAIN_RULES = [
  ["Security", /(security|soc|grc|privacy|iam|devsecops|pentest|cyber)/i],
  ["AI & ML", /(\bai\b|ml-|mlops|llm|nlp|vision|deep-learning|prompt|recommendation|ml-platform)/i],
  ["Data & BI", /(data|analytics|\bbi\b|power-bi|fabric|databricks|snowflake|tableau|warehouse|streaming|big-data|database|dba|looker)/i],
  ["Cloud & Platform", /(cloud|azure|aws|gcp|serverless|terraform|platform|kubernetes|network|native)/i],
  ["DevOps & SRE", /(devops|sre|reliability|observability|finops|release|chaos|performance|linux|windows-server)/i],
  ["QA & Testing", /(\bqa\b|qa-|automation-engineer|\bsdet\b|tester|test-)/i],
  ["Web & Software", /(frontend|backend|full-stack|react|angular|vue|next|node|typescript|javascript|python|java|csharp|dotnet|golang|rust|cpp|kotlin|php|ruby|wordpress|api-designer|mobile|game|embedded)/i],
  ["Design, Docs & Advocacy", /(ux|ui|design|writer|advocate|accessibility|content)/i],
  ["Product & Delivery", /(product|engineering-manager|program-manager|business-analyst|scrum|delivery)/i],
  ["Enterprise Platforms", /(salesforce|servicenow|sap|dynamics|power-platform|blockchain|robotics)/i],
  ["Architecture", /(architect)/i],
  ["Programming languages", /(scala|elixir|haskell|dart|clojure|swift|r-developer)/i],
  ["Emerging & specialized", /(ar-vr|quantum|edge|computer-graphics|bioinformatics|hpc|gis|quantitative)/i],
  ["Support & Growth", /(growth|sales-engineer|customer-success|it-support|localization)/i],
];
function domainFor(slug = "", name = "") {
  if (CORE_MENTORS.has(slug)) return "Learning & Career Coaching";
  const hay = `${slug} ${name}`.toLowerCase();
  for (const [domain, re] of DOMAIN_RULES) if (re.test(hay)) return domain;
  return "General";
}

// Best-effort domain tag for skills (marketplace browsing). First match wins.
const SKILL_RULES = [
  ["Hands-on labs", /-lab$/],
  ["Learn & understand", /(concept-explainer|mind-map|note-generator|teach-back|knowledge-graph|glossary|worked-example|cheat-sheet|socratic|misconception|analogy|visual-explainer)/],
  ["Teaching & curriculum", /(curriculum-designer|lesson-plan|reading-list|peer-review|hackathon|exam-strategy)/],
  ["Plan & track", /(roadmap|schedul|spaced-repetition|project-mentor|progress|onboarding|career-ladder|learner-memory|learning-profile|learning-resource|session-resume)/],
  ["Testing & QA", /(tdd-coach|bdd-scenario|test-plan|flaky-test|mutation-testing|accessibility-audit|api-testing|contract-testing|load-testing|test-data|test-doubles|property-based|e2e-testing|code-coverage)/],
  ["Security", /(secure-code|owasp|security-hardening|incident-postmortem|dependency-audit|auth-designer|incident-response|jwt-security|secrets-management|csp-headers|sql-injection|api-security|cryptography|supply-chain-security)/],
  ["Practice & assess", /(practice|quiz|flashcard|mock-exam|assessment|gap-analysis|rubric|exam-blueprint)/],
  ["Databases & storage", /(database-selection|sql-query-explainer|database-migration|nosql-data-modeling|transaction-isolation|sharding)/],
  ["Networking & OS", /(networking-fundamentals|tls-ssl|load-balancing|dns-coach|linux-command|shell-scripting)/],
  ["Code & engineering", /(code-review|debug|refactor|test-writer|algorithm|complexity|walkthrough|system-design|pair-program|regex|sql-coach|git-coach|dockerfile|code-optimizer|functional-programming|oop-design|design-patterns|memory-management|type-system|error-handling|remote-code-runner|code-runner|competitive-programming|contest-prep|dsa-patterns|dynamic-programming|graph-algorithms|bit-manipulation|recursion-backtracking|math-for-programming)/],
  ["DevOps & Cloud", /(ci-pipeline|kubernetes-manifest|terraform-module|slo-designer|observability-plan|aws-well-architected|azure-landing-zone|gcp-project|cloud-cost|serverless-designer|cloud-migration|git-workflow|alerting-strategy|logging-strategy|distributed-tracing|capacity-planning|postmortem-facilitator|oncall-runbook|gitops|feature-flags|disaster-recovery)/],
  ["Data & analytics", /(data-pipeline|streaming-pipeline|dbt-model|dashboard-designer|data-quality|spark-job|power-bi|dax|excel-formula|data-warehouse|cdc-pipeline|data-catalog|airflow-dag|data-contract|lakehouse)/],
  ["Frontend & web", /(component-designer|css-layout|web-perf|state-management|responsive-design|seo-optimizer|accessibility-remediation|form-design|animation-coach|design-tokens|micro-frontend|pwa-coach)/],
  ["Backend & systems", /(caching-strategy|rate-limiter|message-queue|database-index|concurrency-coach|microservices|webhook|idempotency|saga-pattern|event-sourcing|api-pagination|graphql-schema|grpc|cqrs|circuit-breaker)/],
  ["Architecture & design", /(architecture|api-design|data-modeling|threat-model|tech-comparison|estimation|openapi|consistency-models)/],
  ["Research & news", /(research|digest|feed-curator|docs-finder|blog-finder|repo-finder|paper|literature)/],
  ["Communication & soft skills", /(conflict-resolution|feedback-giver|negotiation-coach|email-writing|public-speaking|time-management)/],
  ["Writing & docs", /(writing|readme|adr-writer|runbook|documentation|changelog)/],
  ["Career & communication", /(resume|star-story|portfolio|slide|demo-script|case-study|cover-letter|linkedin|salary|whiteboard|coding-interview)/],
  ["Product & process", /(user-story|prd-writer|okr-coach|retrospective|standup|one-on-one|competitive-analysis|pricing-strategy|feature-prioritization|metrics-definition|stakeholder-management|business-case)/],
  ["Statistics & experimentation", /(hypothesis-testing|experiment-analysis|confidence-interval|regression-diagnostics|bayesian|sampling-methods)/],
  ["Mobile", /(ios-lifecycle|android-lifecycle|mobile-)/],
  ["Game development", /(game-|shader)/],
  ["Engineering management", /(hiring-process|performance-review|delegation|team-health|tech-debt|engineering-culture)/],
  ["Web3 & blockchain", /(smart-contract|solidity|gas-optimization|defi|nft|web3)/],
  ["AI & data", /(prompt|rag-designer|rag-evaluation|eval-designer|dataset|fine-tuning|model-selection|feature-engineering|ml-pipeline|agent-designer|embeddings|model-monitoring|ml-experiment|llm-guardrails|vector-db|data-labeling|ab-test|context-window|multi-agent|llm-cost|structured-output|hallucination|mcp-server|function-calling)/],
  ["Build & extend", /(role-composer)/],
];
function domainForSkill(name = "") {
  for (const [domain, re] of SKILL_RULES) if (re.test(name.toLowerCase())) return domain;
  return "General";
}

function slugFromFile(file, suffix) {
  return file.slice(0, -suffix.length);
}

// --- scanners ----------------------------------------------------------------

async function scanAgents() {
  if (!existsSync(AGENTS_DIR)) return [];
  const files = (await readdir(AGENTS_DIR)).filter((f) => f.endsWith(".agent.md"));
  const out = [];
  for (const file of files) {
    const text = await readFile(join(AGENTS_DIR, file), "utf8");
    const fm = frontmatter(text);
    const slug = slugFromFile(file, ".agent.md");
    const name = scalar(fm, "name") ?? slug;
    out.push({
      slug,
      name,
      description: scalar(fm, "description") ?? "",
      tools: inlineList(fm, "tools"),
      orchestrator: /^\s*agents:/m.test(fm), // Drona has an agents: allow-list
      path: `.github/agents/${file}`,
    });
  }
  return out.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function scanSkills() {
  if (!existsSync(SKILLS_DIR)) return [];
  const dirs = (await readdir(SKILLS_DIR, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  const out = [];
  for (const dir of dirs) {
    const p = join(SKILLS_DIR, dir, "SKILL.md");
    if (!existsSync(p)) continue;
    const fm = frontmatter(await readFile(p, "utf8"));
    out.push({
      name: scalar(fm, "name") ?? dir,
      description: scalar(fm, "description") ?? "",
      argumentHint: scalar(fm, "argument-hint") ?? "",
      path: `.github/skills/${dir}/SKILL.md`,
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

async function scanRoles() {
  if (!existsSync(ROLES_DIR)) return [];
  const files = (await readdir(ROLES_DIR)).filter(
    (f) => f.endsWith(".role.yml") && !f.startsWith("_")
  );
  const out = [];
  for (const file of files) {
    const text = await readFile(join(ROLES_DIR, file), "utf8");
    const slug = slugFromFile(file, ".role.yml");
    // name is indented under `agent:`
    const name = scalar(text, "name", { indent: "  " }) ?? slug;
    // count certification bullets (best-effort)
    let certs = 0;
    const cm = text.match(/^\s*certifications:\s*$([\s\S]*?)(?=^\s*\w[\w-]*:\s*|\Z)/m);
    if (cm) certs = (cm[1].match(/^\s*-\s+/gm) || []).length;
    out.push({ slug, name, hasConfig: true, certifications: certs, path: `.github/roles/${file}` });
  }
  return out.sort((a, b) => a.slug.localeCompare(b.slug));
}

// --- build -------------------------------------------------------------------

function groupByDomain(items, keyFns) {
  const groups = {};
  for (const it of items) {
    const d = domainFor(keyFns.slug(it), keyFns.name(it));
    (groups[d] ||= []).push(it);
  }
  return groups;
}

async function main() {
  const [agents, skills, roles] = await Promise.all([scanAgents(), scanSkills(), scanRoles()]);

  const mentors = agents.filter((a) => !a.orchestrator && !roles.some((r) => r.name === a.name));
  const agentDomains = groupByDomain(
    agents.filter((a) => !a.orchestrator),
    { slug: (a) => a.slug, name: (a) => a.name }
  );

  const registry = {
    $schema: "https://learningos.dev/marketplace/registry.schema.json",
    generatedAt: new Date().toISOString().slice(0, 10),
    generator: "scripts/build-registry.mjs",
    counts: { agents: agents.length, skills: skills.length, roles: roles.length },
    packs: Object.keys(agentDomains)
      .sort()
      .map((domain) => ({
        id: domain.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        domain,
        agents: agentDomains[domain].map((a) => a.slug),
      })),
    skillPacks: (() => {
      const g = {};
      for (const s of skills) (g[domainForSkill(s.name)] ||= []).push(s.name);
      return Object.keys(g)
        .sort()
        .map((domain) => ({
          id: "skills-" + domain.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
          domain,
          skills: g[domain].sort(),
        }));
    })(),
    agents,
    skills,
    roles,
  };

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(join(OUT_DIR, "registry.json"), JSON.stringify(registry, null, 2) + "\n", "utf8");

  // Human-readable catalog
  const lines = [];
  lines.push("# LearningOS Marketplace — Catalog");
  lines.push("");
  lines.push(`> Auto-generated by \`scripts/build-registry.mjs\` on ${registry.generatedAt}. Do not edit by hand — re-run the generator.`);
  lines.push("");
  lines.push(`**${registry.counts.agents} agents · ${registry.counts.skills} skills · ${registry.counts.roles} role configs**`);
  lines.push("");
  lines.push("## Packs (auto-grouped by domain)");
  lines.push("");
  for (const pack of registry.packs) {
    lines.push(`### ${pack.domain}  \`(${pack.agents.length})\``);
    lines.push("");
    for (const slug of pack.agents) {
      const a = agents.find((x) => x.slug === slug);
      lines.push(`- **${a.name}** — \`@${a.name}\``);
    }
    lines.push("");
  }
  lines.push("## Skill packs (auto-grouped by domain)");
  lines.push("");
  for (const pack of registry.skillPacks) {
    lines.push(`### ${pack.domain}  \`(${pack.skills.length})\``);
    lines.push("");
    for (const name of pack.skills) {
      const s = skills.find((x) => x.name === name);
      lines.push(`- \`/${name}\` — ${(s.description || "").split(".")[0]}.`);
    }
    lines.push("");
  }
  await writeFile(join(OUT_DIR, "CATALOG.md"), lines.join("\n"), "utf8");

  console.log(
    `Wrote marketplace/registry.json and marketplace/CATALOG.md — ` +
      `${registry.counts.agents} agents, ${registry.counts.skills} skills, ${registry.counts.roles} roles, ` +
      `${registry.packs.length} packs.`
  );
}

main().catch((err) => {
  console.error("Registry build failed:", err);
  process.exit(1);
});
