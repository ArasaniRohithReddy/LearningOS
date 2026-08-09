#!/usr/bin/env node
// LearningOS — Drona · Model Context Protocol server.
//
// Exposes the LearningOS catalog and capabilities to any MCP client:
//   Tools     — search_skills, get_skill, search_agents, get_agent,
//               find_learning_resources, list_roadmaps, tech_news, run_code, fetch_page
//   Resources — learningos://constitution (AGENTS.md), learningos://catalog (registry summary)
//   Prompts   — drona (load Drona's teaching persona), teach, plan
//
// Transport: stdio (the standard for locally-launched MCP servers). All diagnostics
// go to stderr so stdout stays a clean JSON-RPC channel.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  getRegistry,
  getConstitution,
  getFeeds,
  searchSkills,
  searchAgents,
  getSkillBody,
  getAgentBody,
  findResources,
  findRoadmaps,
  type FeedSource,
} from "./catalog.js";
import { fetchRaw, htmlToText, runPiston } from "./net.js";
import { parseFeedItems } from "./feedParse.js";

const PISTON_URL = process.env.PISTON_URL || "https://emkc.org/api/v2/piston";

const text = (s: string) => ({ content: [{ type: "text" as const, text: s }] });

const DRONA_PROMPT = [
  "You are Drona, the master learning mentor of LearningOS. Optimize for TEACHING and UNDERSTANDING, not just answering.",
  "1) Teach from first principles; build up, don't just state conclusions. 2) Break hard topics into smaller concepts.",
  "3) Use concrete examples and analogies. 4) Explain WHY and the trade-offs. 5) Connect to what the learner knows.",
  "6) Name knowledge gaps and recommend the next step. 7) Adapt depth to their level; prefer Socratic questions.",
  "Verify before you teach: re-examine your reasoning, cross-check official/primary sources, and for code trace or run it before showing it; if you can't verify, say so — never present a guess as fact.",
  "Source discipline: prefer official docs and primary sources; cite them with dates; never fabricate APIs, versions, or citations.",
  "Teach visually by default, and vary the format to fit the idea — pick from the full palette, not always a flowchart: Mermaid flowchart/sequenceDiagram/classDiagram/erDiagram/stateDiagram-v2/mindmap/timeline/journey/pie/quadrantChart/xychart-beta/gitGraph/sankey-beta/C4Context/requirementDiagram, KaTeX ($...$) for math, Markdown tables for comparisons, and ASCII step-tables/number-lines for tracing. Keep visuals correct, minimal, labelled, with a caption + short alt-text.",
  "Ask their style first: at the start of a learning journey, ask how the learner likes to learn (visual density + preferred formats: diagrams / worked examples / hands-on / concise) and then match every answer to it; default to rich, varied visuals.",
  "You have LearningOS MCP tools available — use them: search_skills / get_skill (520 skills) and search_agents / get_agent (129 specialists) to route to the right helper; find_learning_resources to suggest the best FREE resources (YouTube, MOOCs, interactive) link-out only; list_roadmaps for roadmap.sh paths; tech_news for a dated, cited digest; run_code to execute and teach from real output; fetch_page to read an official page.",
  "End every substantive answer with the Learning Footer:",
  "---",
  "Recap: <2–4 bullets> · Common pitfalls: <1–3> · Next topic: <the single best next thing> · Try it: <one hands-on exercise> · Level: <Beginner|Intermediate|Advanced> · Est. study time: <e.g. 30 min>",
].join("\n");

/** Fetch recent items from the curated feed catalog (SSRF-guarded, bounded). */
async function fetchNews(category?: string, topic?: string, limit = 25) {
  const { feeds } = await getFeeds();
  const textFeeds = feeds.filter((f) => f.type === "rss" || f.type === "atom");
  let sources: FeedSource[];
  const t = topic?.trim().toLowerCase();
  const c = category?.trim().toLowerCase();
  if (t) {
    sources = textFeeds.filter((f) => (f.topics || []).some((x) => x.toLowerCase() === t));
  } else if (c && c !== "all" && c !== "top") {
    sources = textFeeds.filter((f) => f.category.toLowerCase() === c);
  } else if (c === "all") {
    sources = textFeeds;
  } else {
    const per: Record<string, number> = {};
    sources = [];
    for (const f of textFeeds) {
      per[f.category] = (per[f.category] || 0) + 1;
      if (per[f.category] <= 2) sources.push(f);
    }
  }
  const deadline = Date.now() + 22_000;
  const queue = [...sources];
  const all: { title: string; link: string; isoDate: string; source: string }[] = [];
  async function worker() {
    for (;;) {
      if (Date.now() > deadline) return;
      const s = queue.shift();
      if (!s) return;
      try {
        const body = await fetchRaw(s.url, {
          accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
          timeoutMs: 10_000,
          maxBytes: 1_500_000,
        });
        for (const it of parseFeedItems(body).slice(0, 5)) all.push({ ...it, source: s.name });
      } catch {
        /* skip unreachable feed */
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, () => worker()));
  all.sort((a, b) => (a.isoDate && b.isoDate ? b.isoDate.localeCompare(a.isoDate) : a.isoDate ? -1 : b.isoDate ? 1 : 0));
  return { items: all.slice(0, Math.max(5, Math.min(limit, 50))), fetched: sources.length };
}

async function main() {
  const server = new McpServer({ name: "learningos-drona", version: "1.0.0" });

  // --- Tools -----------------------------------------------------------------

  server.registerTool(
    "search_skills",
    {
      title: "Search LearningOS skills",
      description:
        "Search the 520 LearningOS skills (labs, coaches, drills) by keyword and/or domain. Returns matching skill names, one-line descriptions, and domains. Follow up with get_skill to load a skill's full instructions.",
      inputSchema: { query: z.string().optional(), domain: z.string().optional(), limit: z.number().int().optional() },
    },
    async ({ query, domain, limit }) => {
      const rows = await searchSkills(query, domain, limit ?? 40);
      if (!rows.length) return text(`No skills matched (query=${query ?? ""}, domain=${domain ?? ""}).`);
      const body = rows.map((s) => `- /${s.name}  [${s.domain}] — ${(s.description ?? "").split(".")[0]}.`).join("\n");
      return text(`${rows.length} skill(s):\n${body}`);
    }
  );

  server.registerTool(
    "get_skill",
    {
      title: "Get a LearningOS skill",
      description: "Return the full instructions (SKILL.md) for one skill by exact name (e.g. 'dynamic-programming-coach').",
      inputSchema: { name: z.string() },
    },
    async ({ name }) => text((await getSkillBody(name)).text)
  );

  server.registerTool(
    "search_agents",
    {
      title: "Search LearningOS specialist agents",
      description:
        "Search the 129 LearningOS specialist agents (mentors/coaches by domain) by keyword and/or domain. Returns names + descriptions. Follow up with get_agent for one agent's full persona.",
      inputSchema: { query: z.string().optional(), domain: z.string().optional(), limit: z.number().int().optional() },
    },
    async ({ query, domain, limit }) => {
      const rows = await searchAgents(query, domain, limit ?? 40);
      if (!rows.length) return text(`No agents matched (query=${query ?? ""}, domain=${domain ?? ""}).`);
      const body = rows.map((a) => `- ${a.name}  [${a.domain}] — ${(a.description ?? "").split(".")[0]}.`).join("\n");
      return text(`${rows.length} agent(s):\n${body}`);
    }
  );

  server.registerTool(
    "get_agent",
    {
      title: "Get a LearningOS specialist agent",
      description: "Return the full persona/instructions for one specialist agent by name or slug (e.g. 'Coding Mentor').",
      inputSchema: { name: z.string() },
    },
    async ({ name }) => text((await getAgentBody(name)).text)
  );

  server.registerTool(
    "find_learning_resources",
    {
      title: "Find free learning resources",
      description:
        "Recommend the best FREE learning resources (YouTube channels/playlists, MOOCs, interactive sites, docs, free books) from a curated, verified catalog. Filter by topic, domain (programming|web|data|ai-ml|cloud|devops|security|cs-fundamentals|dsa|system-design|databases|mobile|game-dev|math), type (youtube-channel|youtube-playlist|mooc|interactive|docs|book|practice), and level. Link-out only.",
      inputSchema: {
        topic: z.string().optional(),
        domain: z.string().optional(),
        type: z.string().optional(),
        level: z.string().optional(),
        limit: z.number().int().optional(),
      },
    },
    async (args) => {
      const rows = await findResources(args);
      if (!rows.length) return text("No matching free resources found — broaden the filters.");
      const body = rows
        .map((r) => `- ${r.name} [${r.type} · ${r.domain} · ${r.level} · ${r.cost}] — ${r.description ?? ""}\n  ${r.url}`)
        .join("\n");
      return text(`${rows.length} free resource(s):\n${body}`);
    }
  );

  server.registerTool(
    "list_roadmaps",
    {
      title: "List roadmap.sh learning paths",
      description:
        "List roadmap.sh learning paths (role-based / skill-based / best-practices / project-ideas) with canonical URLs. Link-out only — roadmaps courtesy of roadmap.sh by Kamran Ahmed. Adapt their structure; never copy node content.",
      inputSchema: { query: z.string().optional(), type: z.string().optional(), limit: z.number().int().optional() },
    },
    async ({ query, type, limit }) => {
      const rows = await findRoadmaps(query, type, limit ?? 60);
      if (!rows.length) return text("No matching roadmaps.");
      const body = rows.map((r) => `- ${r.title} [${r.type}] — ${r.description ?? ""}\n  ${r.url}`).join("\n");
      return text(`${rows.length} roadmap(s) (source: roadmap.sh):\n${body}`);
    }
  );

  server.registerTool(
    "tech_news",
    {
      title: "Curated tech-news digest",
      description:
        "Fetch recent headlines from the curated RSS/Atom feed catalog (AI, cloud, release-notes, DevOps, data, security, web, languages, engineering, research, news). Optionally narrow by category or topic tag. Returns newest-first items (title · source · date · link) for you to cluster and summarize with why each matters.",
      inputSchema: { category: z.string().optional(), topic: z.string().optional(), limit: z.number().int().optional() },
    },
    async ({ category, topic, limit }) => {
      const { items, fetched } = await fetchNews(category, topic, limit ?? 25);
      if (!items.length) return text(`No items fetched (feeds may be temporarily unreachable; tried ${fetched}).`);
      const body = items.map((it) => `- ${it.title} — ${it.source} (${it.isoDate ? it.isoDate.slice(0, 10) : "undated"})\n  ${it.link}`).join("\n");
      return text(`${items.length} item(s) from ${fetched} curated feeds, newest first:\n${body}`);
    }
  );

  server.registerTool(
    "run_code",
    {
      title: "Run code (no local install)",
      description:
        "Execute a code snippet remotely and return real stdout/stderr/exit code — for practicing/testing code in 90+ languages without installing a toolchain. Uses a Piston runner (set PISTON_URL to a self-hosted Piston for reliability; the public one is often whitelist-only).",
      inputSchema: {
        language: z.string().describe("Language name or alias, e.g. python, js, cpp, go, rust, java"),
        code: z.string().describe("The complete source to execute"),
        stdin: z.string().optional(),
        version: z.string().optional().describe("Optional exact runtime version"),
      },
    },
    async ({ language, code, stdin, version }) => {
      const r = await runPiston(PISTON_URL, { language, code, stdin, version });
      if (!r.ok) return text(`Could not run ${language}: ${r.message}`);
      const parts = [`language: ${r.language}${r.version ? " " + r.version : ""} · exit code: ${r.code ?? "?"}`];
      if (r.stdout) parts.push(`--- stdout ---\n${r.stdout}`);
      if (r.stderr) parts.push(`--- stderr ---\n${r.stderr}`);
      if (!r.stdout && !r.stderr) parts.push("(no output)");
      return text(parts.join("\n"));
    }
  );

  server.registerTool(
    "fetch_page",
    {
      title: "Fetch a public page (readable text)",
      description:
        "Fetch the readable text of a public https page (an official docs / 'what's new' / release-notes / blog page) so you can summarize current, dated information. Private/loopback/link-local/metadata hosts are refused (SSRF-guarded). Returns HTML-stripped text truncated to ~8000 chars.",
      inputSchema: { url: z.string().describe("Absolute https URL of an official source page") },
    },
    async ({ url }) => {
      try {
        const html = await fetchRaw(url, { accept: "text/html,text/plain,*/*", timeoutMs: 12_000, maxBytes: 2_000_000 });
        const readable = htmlToText(html).slice(0, 8_000);
        return text(`Source: ${url}  ·  retrieved ${new Date().toISOString()}\n\n${readable}`);
      } catch (e) {
        return text(`Could not fetch ${url}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  );

  // --- Resources -------------------------------------------------------------

  server.registerResource(
    "constitution",
    "learningos://constitution",
    { title: "LearningOS constitution (AGENTS.md)", description: "The shared teaching constitution all LearningOS agents follow.", mimeType: "text/markdown" },
    async (uri) => ({ contents: [{ uri: uri.href, text: await getConstitution() }] })
  );

  server.registerResource(
    "catalog",
    "learningos://catalog",
    { title: "LearningOS catalog summary", description: "Counts and domain packs of the LearningOS agents and skills.", mimeType: "text/markdown" },
    async (uri) => {
      const reg = await getRegistry();
      const lines = [
        `# LearningOS catalog`,
        `${reg.counts?.agents ?? 0} agents · ${reg.counts?.skills ?? 0} skills · ${reg.counts?.roles ?? 0} roles` +
          (reg.generatedAt ? ` (generated ${reg.generatedAt})` : ""),
        "",
        "## Agent domains",
        ...(reg.packs ?? []).map((p) => `- ${p.domain} (${(p.agents ?? []).length})`),
        "",
        "## Skill domains",
        ...(reg.skillPacks ?? []).map((p) => `- ${p.domain} (${(p.skills ?? []).length})`),
      ];
      return { contents: [{ uri: uri.href, text: lines.join("\n") }] };
    }
  );

  // --- Prompts ---------------------------------------------------------------

  server.registerPrompt(
    "drona",
    {
      title: "Become Drona (teaching mentor)",
      description: "Load Drona's teaching persona (teach-not-answer, verify, cite, teach-visually, Learning Footer) and optionally frame a topic.",
      argsSchema: { topic: z.string().optional() },
    },
    async ({ topic }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: DRONA_PROMPT + (topic ? `\n\nNow, as Drona, teach me: ${topic}` : "\n\nIntroduce yourself briefly and ask what I'd like to learn."),
          },
        },
      ],
    })
  );

  server.registerPrompt(
    "teach",
    { title: "Teach a topic (Drona)", description: "Explain a topic from first principles with a worked example and a diagram.", argsSchema: { topic: z.string() } },
    async ({ topic }) => ({
      messages: [
        {
          role: "user" as const,
          content: { type: "text" as const, text: `${DRONA_PROMPT}\n\nExplain from first principles, with a worked example and a Mermaid diagram if useful: ${topic}` },
        },
      ],
    })
  );

  server.registerPrompt(
    "plan",
    { title: "Study plan (Drona)", description: "Build a dated, phased study roadmap toward a goal, with milestones and free resources.", argsSchema: { goal: z.string() } },
    async ({ goal }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `${DRONA_PROMPT}\n\nBuild a dated, phased study roadmap (milestones + checkpoints) toward: ${goal}. Use find_learning_resources and list_roadmaps to attach the best FREE resources for each phase.`,
          },
        },
      ],
    })
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("LearningOS MCP server (learningos-drona) running on stdio.");
}

main().catch((err) => {
  console.error("LearningOS MCP fatal:", err);
  process.exit(1);
});
