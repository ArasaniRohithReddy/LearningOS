# LearningOS — Drona · MCP server

A [Model Context Protocol](https://modelcontextprotocol.io) server that exposes the **LearningOS**
catalog and capabilities to **any MCP client** (Claude Desktop, VS Code, Cursor, and others). Point your
client at it and your assistant can browse the 129 specialist agents and 779 skills, recommend **free**
learning resources, list roadmap.sh paths, pull a curated tech-news digest, run code with no local
install, and load Drona's teaching persona.

## What it exposes

**Tools**
| Tool | What it does |
|---|---|
| `search_skills` | Search the 779 skills by keyword/domain |
| `get_skill` | Full instructions (SKILL.md) for one skill |
| `search_agents` | Search the 129 specialist agents |
| `get_agent` | Full persona for one agent |
| `find_learning_resources` | Best **free** resources (YouTube, MOOCs, interactive, docs, books) — link-out |
| `list_roadmaps` | roadmap.sh learning paths (link-out) |
| `tech_news` | Recent items from ~190 curated RSS/Atom feeds (SSRF-guarded fetch) |
| `run_code` | Execute code in 90+ languages via a Piston runner |
| `fetch_page` | Readable text of a public https page (SSRF-guarded) |

**Resources:** `learningos://constitution` (AGENTS.md) · `learningos://catalog` (counts + domains)
**Prompts:** `drona` (become the teaching mentor) · `teach` · `plan`

## Run it

```sh
# from a clone of the repo
cd mcp
npm install          # also builds (prepare) + bundles the catalog
node out/index.js    # speaks MCP over stdio
```

Once published to npm you'll be able to run it with **`npx learningos-mcp`** (no clone needed).

### Environment
- `LEARNINGOS_ROOT` *(optional)* — path to a LearningOS repo checkout, so `get_skill`/`get_agent` can
  return the **full** SKILL.md / agent.md bodies. Without it, those tools return the description + path
  (search, resources, roadmaps, news and run-code work standalone from the bundled catalog).
- `PISTON_URL` *(optional)* — a Piston runner base URL for `run_code`. Default is the public
  `https://emkc.org/api/v2/piston` (often whitelist-only → HTTP 401); **self-host Piston** and set
  `PISTON_URL=http://localhost:2000/api/v2` for reliable, offline execution.

## Client configuration

**Claude Desktop** — `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "learningos": {
      "command": "node",
      "args": ["/absolute/path/to/LearningOS/mcp/out/index.js"],
      "env": { "LEARNINGOS_ROOT": "/absolute/path/to/LearningOS" }
    }
  }
}
```

**VS Code** — `.vscode/mcp.json` (or the global MCP config):
```json
{
  "servers": {
    "learningos": { "type": "stdio", "command": "node", "args": ["/absolute/path/to/LearningOS/mcp/out/index.js"] }
  }
}
```

**Cursor** — `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "learningos": { "command": "node", "args": ["/absolute/path/to/LearningOS/mcp/out/index.js"] }
  }
}
```

After publishing to npm, replace `"command": "node", "args": ["…/out/index.js"]` with
`"command": "npx", "args": ["-y", "learningos-mcp"]`.

## Develop

```sh
npm run build   # bundle the catalog into content/ + tsc
npm test        # build + a stdio smoke test (initialize, tools/list, real tool calls)
```

## Safety
`tech_news` and `fetch_page` run through the same **SSRF guard** as the extension (private / loopback /
link-local / cloud-metadata hosts refused; every redirect hop re-validated). `run_code` sends snippets to
the configured Piston runner — don't paste secrets into code you run. Resources are **link-out only**;
roadmaps are courtesy of [roadmap.sh](https://roadmap.sh) by Kamran Ahmed. MIT licensed.
