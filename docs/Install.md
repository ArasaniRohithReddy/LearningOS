# Installing LearningOS

LearningOS is a **portable Copilot plugin**: 129 teaching agents (`.github/agents/`), 509 skills
(`.github/skills/`), a shared constitution ([`AGENTS.md`](../AGENTS.md)), and a bundled chart MCP
([`.mcp.json`](../.mcp.json)). The same content works across every host that reads Copilot/agent
customizations — you install it once per host you use.

> **Progress charts are silent-on-install.** Every manifest points at [`.mcp.json`](../.mcp.json), which
> declares the **Flint-Chart MCP** (`npx -y flint-chart-mcp`). Hosts that honor a plugin's `mcpServers`
> register it automatically when the plugin is installed — no manual MCP setup. Charts render locally
> (SVG/PNG); **your data never leaves your machine**. See [MCP.md](./MCP.md) and the `progress-charts` skill.

## Quick start (all hosts) — one command

From the repo root:

```powershell
pwsh ./install.ps1            # detects installed hosts and wires each one
pwsh ./install.ps1 -WhatIf    # preview only, change nothing
pwsh ./install.ps1 -Target cli  # target a single host: cli | vscode | vscode-insiders | claude | cursor | gemini
```

The script is **idempotent** and only touches config it recognizes. It never deletes your data.

## Per-host details

### GitHub Copilot CLI
The manifest is [`plugin.json`](../plugin.json) (agents + skills + `mcpServers`).
- **From a GitHub repo:** `copilot plugin install <owner>/<repo>` → installs to
  `~/.copilot/installed-plugins/`, registering all agents/skills and the flint-chart MCP.
- **Local/dev:** point the CLI at this folder, or let `install.ps1` add flint-chart to
  `~/.copilot/mcp-config.json` and use the workspace `.github/agents` + `.github/skills` directly.

### VS Code & VS Code Insiders (GitHub Copilot)
Copilot in VS Code discovers workspace customizations under `.github/` (agents, `AGENTS.md`) automatically
when the repo is open. For charts, the MCP lives in `.vscode/mcp.json` (workspace) — `install.ps1` writes
it, or add it yourself:
```json
{ "servers": { "flint-chart": { "type": "stdio", "command": "npx", "args": ["-y", "flint-chart-mcp"] } } }
```
Insiders uses the same workspace file; user-level config differs only by the `Code - Insiders` profile path.

> **Prefer a one-click install?** Use the prebuilt **`.vsix`** — it adds the **`@drona`** chat participant
> and a setup command, no Marketplace account needed. See [Extension.md](./Extension.md):
> `code --install-extension extension/learningos-drona-1.4.0.vsix`

### GitHub Copilot Desktop
Open this folder as your workspace (agents/skills load from `.github/`) and add the same MCP entry to the
Desktop MCP config (`install.ps1 -Target cli` covers the shared `~/.copilot` config it uses).

### Claude Code
Manifest: [`.claude-plugin/plugin.json`](../.claude-plugin/plugin.json). Install via your Claude plugin
marketplace flow (or `apm` — see below); the bundled `.mcp.json` registers flint-chart.

### Cursor
Manifest: [`.cursor-plugin/plugin.json`](../.cursor-plugin/plugin.json). Install via Cursor's plugin flow;
`.mcp.json` registers flint-chart.

### Gemini CLI
Manifest: [`gemini-extension.json`](../gemini-extension.json) (includes the flint-chart MCP inline).

## Editing / customizing after install
Everything is plain Markdown + YAML — add, edit, or disable any skill or agent and re-index. See
[Customize.md](./Customize.md).

## Publishing to a marketplace (optional)
To distribute via a plugin marketplace, package with Microsoft's [`apm`](https://github.com/microsoft/apm)
tool (`apm pack`) from an `apm.yml`, then submit per the target host's marketplace process. Update the
`homepage`/`repository` fields in the manifests to your real repo first.

## Notes / honest limitations
- There is **no single command that force-installs into every IDE at once** — you run the installer (or the
  host's `plugin install`) per host. `install.ps1` automates every host it detects on this machine.
- Auto-registered MCPs run `npx -y flint-chart-mcp` on first use (downloads the package on demand), exactly
  like other Copilot plugins that ship an MCP. Review [`.mcp.json`](../.mcp.json) before installing if you
  prefer explicit opt-in.
