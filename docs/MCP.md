# LearningOS — MCP Integration

**Model Context Protocol (MCP)** servers give LearningOS agents live, first-party access to docs,
code, feeds, and data — so lessons are grounded in *current* reality, not the model's memory. This is
the vision's "MCP-first / MCP-ready" principle.

> MCP is **optional**. LearningOS works fully without it (agents fall back to `web`/`search`). Enable
> servers as you need them.

## LearningOS *as* an MCP server (`learningos-mcp`)

LearningOS now ships its **own** MCP server ([`mcp/`](../mcp/), see [`mcp/README.md`](../mcp/README.md)) so
**any** MCP client — Claude Desktop, VS Code, Cursor — can use LearningOS directly, not just the VS Code
extension. It exposes:

- **Tools:** `search_skills`, `get_skill`, `search_agents`, `get_agent` (browse the 129 agents + 520
  skills), `find_learning_resources` (best **free** resources — link-out), `list_roadmaps` (roadmap.sh),
  `tech_news` (curated, SSRF-guarded RSS/Atom digest), `run_code` (90+ languages via Piston), `fetch_page`
  (SSRF-guarded readable text).
- **Resources:** `learningos://constitution` (AGENTS.md), `learningos://catalog` (counts + domains).
- **Prompts:** `drona` (load the teaching persona), `teach`, `plan`.

```jsonc
// Claude Desktop (claude_desktop_config.json) — or .vscode/mcp.json / ~/.cursor/mcp.json
{ "mcpServers": { "learningos": {
  "command": "node",
  "args": ["/absolute/path/to/LearningOS/mcp/out/index.js"],
  "env": { "LEARNINGOS_ROOT": "/absolute/path/to/LearningOS" }
} } }
```

Build it with `cd mcp && npm install` (then point your client at `mcp/out/index.js`); once published you'll
run it via `npx learningos-mcp`. Full setup, env vars (`LEARNINGOS_ROOT`, `PISTON_URL`) and per-client
configs are in [`mcp/README.md`](../mcp/README.md).

## Bundled: Flint-Chart (progress charts, silent-on-install)

LearningOS ships **one** MCP server so progress visualization works out of the box: **Flint-Chart**
([`microsoft/flint-chart`](https://github.com/microsoft/flint-chart)). It's declared in the repo's
[`.mcp.json`](../.mcp.json) and referenced by every plugin manifest's `mcpServers`, so installing the
LearningOS plugin **registers it automatically** — no manual setup. It renders charts (SVG/PNG) **locally;
your data never leaves the machine**. The [`progress-charts`](../.github/skills/progress-charts/SKILL.md)
skill uses it to draw activity/streak, topics-by-domain, mastery, and review burn-down; it degrades to
Mermaid/tables if the server isn't present.

```jsonc
// .mcp.json (bundled) — auto-registered on install; also mirrored in .vscode/mcp.json for VS Code
{ "mcpServers": { "flint-chart": { "command": "npx", "args": ["-y", "flint-chart-mcp"] } } }
```

See [Install.md](./Install.md) for how each host picks this up.

## Design: the MCP layer is abstracted

Agents never hard-code a provider. They ask for a *capability* ("fetch this doc", "search this repo",
"read this table"); whichever MCP server is configured fulfills it. This means you can add or swap
providers **without changing Drona or any agent** — exactly the decoupling the blueprint required.

## Recommended servers by capability

| Capability | MCP server(s) | Powers |
|---|---|---|
| Official docs | Microsoft Learn, and vendor docs | `research-brief`, all role-agents |
| Web fetch / search | Fetch, a web-search server | Research & News Analyst |
| Source code | GitHub, Git | Coding Mentor, repo learning |
| Browser automation | Playwright | verifying UI lessons, scraping allowed pages |
| Local files | Filesystem | reading the learner's project |
| Databases | SQLite, PostgreSQL | Data roles, hands-on SQL practice |
| Feeds & papers | an RSS server, arXiv | [News.md](./News.md) digests, paper tracking |
| Data platforms | Databricks, Snowflake, Fabric, Power BI | Data/BI role-agents |
| Work tracking | Azure DevOps, Jira, Confluence, Notion | Career/PM roles, planning |
| Knowledge base | Obsidian, Markdown, PDF | Memory / RAG ([Memory.md](./Memory.md)) |

Role configs advertise what they'd like via the `mcp:` field (see [Roles.md](./Roles.md)); it is
advisory — the agent degrades gracefully if a server isn't present.

## Enabling servers

**VS Code / Insiders** — add an `.vscode/mcp.json` (workspace) or configure via the MCP UI. A ready
sample is provided at [`docs/mcp.sample.json`](./mcp.sample.json). Copy the servers you want into
`.vscode/mcp.json` and let VS Code start them on demand.

**Copilot CLI** — configure MCP servers per the CLI's MCP documentation; the same servers apply.

> ⚠️ Only enable servers you trust and need. Each server can read/act on the data you point it at.
> Treat tokens as secrets (use `inputs`/environment variables, never commit them). See
> [Security.md](./Security.md).

## Example (excerpt)

```jsonc
// .vscode/mcp.json
{
  "servers": {
    "fetch":        { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-fetch"] },
    "filesystem":   { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-filesystem", "${workspaceFolder}"] },
    "git":          { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "${workspaceFolder}"] }
  }
}
```

Server names, packages, and availability change over time — always confirm the current package/command
from the server's official source before adding it (don't trust memory; verify).
