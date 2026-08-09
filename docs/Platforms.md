# LearningOS on every platform — individual-level install

LearningOS/Drona is **portable by design**. Two facts make it work almost everywhere, **without a tenant
admin**:

1. **Skills are just `SKILL.md` files** (YAML frontmatter `name` + `description`, then Markdown). This is
   exactly the format GitHub Copilot *and* Anthropic Claude use for agent skills — so the **same 779
   skills** load on both with no rewrite.
2. **The catalog is also an MCP server** (`mcp/`, `learningos-mcp`). The
   [Model Context Protocol](https://modelcontextprotocol.io) is host-neutral, so Claude Desktop, VS Code,
   Cursor, and any other MCP host can consume the same tools (`search_skills`, `get_skill`,
   `search_agents`, `tech_news`, `run_code`, …) and the `drona` teaching prompt.

> **Individual-level is the primary path.** You download the release **zip** (or clone the repo), drop the
> content into your own per-user folder, and use it — no admin upload required. It *also* works at the
> org/admin level, but that is not required for you to start today.

---

## Fastest path (any host) — one command

Download the release zip from
[Releases](https://github.com/ArasaniRohithReddy/LearningOS/releases/latest), unzip it, then:

```powershell
pwsh ./install.ps1              # detects your installed hosts and wires each one (idempotent)
pwsh ./install.ps1 -WhatIf      # preview only — writes nothing
pwsh ./install.ps1 -Target cli  # one host: cli | vscode | vscode-insiders | claude | cursor | gemini
```

`install.ps1` registers **two** local MCP servers per detected host — the LearningOS **Drona** server
(skills/agents/news/run-code) and the **Flint-Chart** charting server — backs up any file it touches, and
never deletes data. It builds the Drona MCP once if needed (`mcp/out` is not shipped in the zip).

---

## Per-platform, individual-level

### 1) GitHub Copilot (CLI, VS Code, coding agent)

Copilot discovers **custom agents** and **agent skills** from user- and repo-level folders
([Custom agents for GitHub Copilot, 2025-10-28](https://github.blog/changelog/2025-10-28-custom-agents-for-github-copilot/);
[Adding agent skills](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills)).

- **Copilot CLI (personal, no admin):** copy the content into your home config —
  `~/.copilot/skills/` (skills) and `~/.copilot/agents/` (agents). Or install from the repo:
  `copilot plugin install ArasaniRohithReddy/LearningOS`.
- **VS Code / Insiders:** open the unzipped folder as your workspace — Copilot reads `.github/agents`,
  `.github/skills`, and `AGENTS.md` automatically. For the richest experience use the prebuilt **`.vsix`**
  (adds the `@drona` chat participant): `code --install-extension extension/learningos-drona-1.8.0.vsix`.
- **MCP:** `install.ps1 -Target cli` adds the Drona + chart servers to `~/.copilot/mcp-config.json`
  (or prints the exact block to paste if that file has comments).

### 2) Claude — Claude Code & Claude Desktop

Claude Agent Skills use the **same `SKILL.md` format** as this repo
([Claude Code — Skills](https://code.claude.com/docs/en/skills);
[Anthropic: Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)).

- **Individual skills:** copy skill folders into `~/.claude/skills/` (personal) or `.claude/skills/`
  (project). Claude auto-discovers them on next start.
- **As a plugin (marketplace):** in Claude Code, `/plugin marketplace add ArasaniRohithReddy/LearningOS`
  then `/plugin install` the pack — the bundled `.claude-plugin/plugin.json` carries agents/skills + MCP.
- **MCP (Claude Desktop):** add to `claude_desktop_config.json`
  (Windows `%APPDATA%\Claude\`, macOS `~/Library/Application Support/Claude/`):
  ```json
  {
    "mcpServers": {
      "learningos": {
        "command": "node",
        "args": ["C:/path/to/LearningOS/mcp/out/index.js"],
        "env": { "LEARNINGOS_ROOT": "C:/path/to/LearningOS" }
      }
    }
  }
  ```
  (Run `npm --prefix mcp install && npm --prefix mcp run build` once first, or let `install.ps1` do it.)

### 3) Cursor

- **Rules/skills:** open the folder in Cursor; it reads project rules and the same `.github` content.
- **MCP:** add the `learningos` server to `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project),
  same shape as above.

### 4) Gemini CLI

- Manifest [`gemini-extension.json`](../gemini-extension.json) declares the extension + MCP inline;
  `install.ps1 -Target gemini` wires `~/.gemini/settings.json`.

### 5) Microsoft 365 Copilot — "Cowork"

Copilot Cowork is agent/plugin-driven, but **marketplace plugins there are generally governed by IT/admin
policy** ([Use plugins with Copilot Cowork](https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-plugins)).
So the honest picture:

- **Where individual use is possible:** enabling/using already-approved plugins in your own workspace.
- **Where admin is required:** importing a *new* plugin that reaches outside the tenant's security boundary
  usually needs admin approval. If you control your own tenant, you can approve it yourself.
- **Best individual-level Copilot experience today:** the **Copilot CLI / VS Code** paths above, which need
  no admin.

---

## Optional: Azure-authenticated scenarios (opt-in, only when needed)

The MCP server works **fully without Azure**. If — and only if — you need an authenticated backend (e.g. a
private endpoint), the server can reuse your **existing `az login` session** instead of asking you for
another credential:

```powershell
az login                                   # you almost certainly already did this
$env:LEARNINGOS_AZURE_AUTH   = "1"         # opt in
$env:LEARNINGOS_AZURE_RESOURCE = "<resource-or-scope>"   # e.g. a specific API audience
```

When enabled, an extra `azure_identity` MCP tool appears; it reports whether auth works (user, tenant,
subscription) but **never returns a token**. How it behaves:

- Tokens come from `az account get-access-token`, are **resource/audience-scoped** and **short-lived**, and
  are **never logged, persisted, or shown to the model**.
- If `az` is missing or you're not signed in, the feature is simply unavailable and **everything else keeps
  working**.
- It is **off by default** — nothing Azure-related runs unless you set `LEARNINGOS_AZURE_AUTH`.

> Honest scope: an audience-scoped token can only call APIs that accept that audience — it is not a
> master key. Request the **minimum** scope you need.

---

## Honest limitations

- There is **no single button that installs into every IDE at once** — you run `install.ps1` (or the host's
  own `plugin install`) per host. The script automates every host it detects on your machine.
- Auto-registered MCPs launch a local process (`node …/mcp/out/index.js`, `npx flint-chart-mcp`) on first
  use. Review [`mcp/README.md`](../mcp/README.md) and [`.mcp.json`](../.mcp.json) if you prefer explicit
  opt-in.
- M365 Copilot Cowork plugin governance is set by your tenant; the individual path there is narrower than on
  Copilot CLI / VS Code / Claude / Cursor.

See also: [Install.md](./Install.md) (host details) · [MCP.md](./MCP.md) (server + tools) ·
[`mcp/README.md`](../mcp/README.md) (client config).
