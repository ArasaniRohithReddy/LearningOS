# LearningOS — Roadmap

This maps the original 10-part vision to what LearningOS has actually built, and what comes next. The
core is intentionally small and high-quality; breadth comes from configuration and can grow
indefinitely.

## Vision → status

| # | Blueprint part | Status | Where |
|---|---|---|---|
| 1 | Master Architect / Orchestrator | ✅ Done | `Drona` + [Architecture.md](./Architecture.md) |
| 2 | Learning OS System Prompt (shared brain) | ✅ Done | [`AGENTS.md`](../AGENTS.md) + [Standards.md](./Standards.md) |
| 3 | Plugin & Skill Framework | ✅ Done | skills + [PluginSDK.md](./PluginSDK.md) |
| 4 | MCP Integration Framework | ✅ Design + sample | [MCP.md](./MCP.md), [`mcp.sample.json`](./mcp.sample.json) |
| 5 | Memory, Knowledge & RAG | ✅ Design + templates + skills | [Memory.md](./Memory.md), `knowledge-graph` + `spaced-repetition-scheduler` skills, [`templates/`](../templates) |
| 6 | News, RSS & Research | ✅ Done | Research analyst + `research-brief` + [News.md](./News.md) |
| 7 | Career Role Framework | ✅ Done | [`roles/`](../.github/roles) + `role-composer` + [Roles.md](./Roles.md) |
| 8 | Coding & Teaching Standards | ✅ Done | [Standards.md](./Standards.md) |
| 9 | Implementation Roadmap | ✅ Done | this file |
| 10 | Enterprise Enhancements | 🔄 In progress | see Phase 4 below |

## Phases

### Phase 1 — Core (done)
Constitution, Drona orchestrator, 6 specialist mentors, 8 skills, config-driven roles + composer.

### Phase 2 — Breadth & docs (done — this build)
Full `docs/` set; a role catalog spanning Software, AI/ML, Data/BI, Cloud, DevOps/SRE, Security, QA,
Architecture, and Product/Management; MCP sample; community files.

### Phase 3 — Depth (done — this build)
- **10 new skills shipped**: `mock-exam`, `mind-map`, `teach-back`, `daily-digest`, `knowledge-graph`,
  `spaced-repetition-scheduler`, `note-generator`, `debugging-coach`, plus `project-mentor` and
  `feed-curator` (see [Skills.md](./Skills.md)).
- **First-class templates** in [`templates/`](../templates): `learning-profile.template.md`,
  `lesson-notes.template.md`, `study-plan.template.md`, `project-plan.template.md`, and `feeds.opml`.
- **All 24 role configs generated into `.agent.md` files** and wired into Drona's delegation list
  (see [Agents.md](./Agents.md) and [Roles.md](./Roles.md)).
- MCP wiring remains sample-level ([`mcp.sample.json`](./mcp.sample.json)); live server enablement is
  client-dependent and carried into Phase 4.

### Phase 4 — Enterprise & breadth (in progress)
- **Breadth toward the 100+ agent / 500+ skill vision** — added in reviewed, high-quality batches of
  role-agents and skills across every domain (no stubs; each follows the constitution). **Progress:
  the roster grew 24 → 50 → 98 → 122 role-agents (129 agents total — well past the 100+ milestone),
  and the skill library grew 8 → 18 → 21 → 39 → 75 → 123 → 171 → 261 → 336 → 444 → 510 → 520 → 536** (added source-discovery,
  assessment, code, career, architecture, writing/docs, AI/data, testing, defensive security,
  DevOps/cloud, data, frontend, backend, product, databases, networking/OS, paradigms, ML-in-production,
  soft-skills, teaching, enterprise-tools, distributed-systems, observability/SRE, GenAI-production, and
  **256 hands-on labs** (languages, frameworks, cloud, data, ML, DevOps) — including **Floci** and
  **LocalStack/Azurite/MinIO/Ollama/Postgres/Redpanda/minikube/…** so learners practice AWS/Azure/GCP,
  databases, messaging, Kubernetes, and even LLMs/RAG **locally on their laptop, free, no subscription**
  (see [LocalPractice.md](./LocalPractice.md))). **Past the 500-skill milestone — 536 and counting.**
- **Enterprise Plugin Marketplace shipped** (first cut): a generated, machine-readable index
  ([`marketplace/registry.json`](../marketplace/registry.json) + [`CATALOG.md`](../marketplace/CATALOG.md))
  built by [`scripts/build-registry.mjs`](../scripts/build-registry.mjs), plus a pack/install model in
  [Marketplace.md](./Marketplace.md).
- Live MCP wiring (Microsoft Learn, GitHub, Fetch, RSS/arXiv) for grounded, current lessons.
- Learning analytics (progress, gaps, streaks) and an evaluation harness (golden-prompt CI).
- Team/org profiles and shareable role packs; a hosted marketplace index with one-command install.
- Deeper Responsible-AI review and accessibility passes.

## How to contribute to the roadmap
Add a role (one YAML), a skill (one folder), or a doc — then open a PR. See
[`CONTRIBUTING.md`](../CONTRIBUTING.md).
