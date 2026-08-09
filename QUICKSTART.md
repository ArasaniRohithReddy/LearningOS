# LearningOS — Quick Start

Your AI **Learning Operating System**: **Drona** (the mentor) + **129 agents**, **536 skills**, **122
roles**, cross-session memory, local labs (no subscriptions), and progress charts.

## Fastest path — install the extension (no account needed)

> ⚠️ **Don't double-click the `.vsix`** — on Windows that opens the *Visual Studio* installer (wrong
> product) and fails. Instead double-click **`Install-in-VSCode.cmd`**, or run:

```bash
code --install-extension extension/learningos-drona-1.4.0.vsix       # VS Code
code-insiders --install-extension extension/learningos-drona-1.4.0.vsix   # Insiders
```
Then open **Chat** and type **`@drona teach me how HTTPS works`**. Slash commands: `/learn`, `/plan`,
`/interview`, `/resume`, `/charts`.

> The same `.vsix` also installs in **Cursor / Windsurf / VSCodium** (Extensions → *Install from VSIX…*).

## Other hosts — pick your file (see [docs/Extension.md](docs/Extension.md))
| Host | Install |
|---|---|
| GitHub Copilot CLI | the plugin — `copilot plugin install <owner>/<repo>` (uses `plugin.json` + `.mcp.json` + `.github/`) |
| Claude Code | `.claude-plugin/plugin.json` |
| Gemini CLI | `gemini-extension.json` |
| Any host, auto-wire | `pwsh ./install.ps1` (detects your hosts) |

## Learn more
- **[README.md](README.md)** — full overview · **[AGENTS.md](AGENTS.md)** — the teaching constitution
- **[docs/Install.md](docs/Install.md)** — install on every host · **[docs/Extension.md](docs/Extension.md)** — the `.vsix`
- **[docs/Customize.md](docs/Customize.md)** — add/edit/disable your own skills & agents
- **[docs/LocalPractice.md](docs/LocalPractice.md)** — practice everything locally, free
- **[docs/Memory.md](docs/Memory.md)** — how progress persists across sessions

## Rebuild the extension (after edits)
```bash
cd extension && npm install && npm run package    # → extension/learningos-drona-<version>.vsix
```

## Verify the framework is consistent
```bash
node scripts/build-registry.mjs && node scripts/validate.mjs
```
