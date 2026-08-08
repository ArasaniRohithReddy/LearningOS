# Drona as an installable extension (`.vsix`) + per-host files

You don't need a Marketplace account. LearningOS ships as a **prebuilt `.vsix`** for the VS Code family,
and as **plugin manifests** for the agent-harness hosts. Pick the file for your tool:

> ⚠️ **Do NOT double-click the `.vsix`.** On Windows that opens the **Visual Studio** installer, which
> only handles Visual Studio (big IDE) extensions and fails with *"One or more extensions are for Visual
> Studio Code."* This extension is for **VS Code** — install it one of these ways instead:
> - **Easiest:** double-click **`Install-in-VSCode.cmd`** (installs into VS Code + Insiders automatically).
> - **CLI:** `code --install-extension extension/learningos-drona-1.1.10.vsix`
> - **UI:** VS Code → Extensions view → **⋯** → **Install from VSIX…** → pick the file.


| Host / tool | Install this | How |
|---|---|---|
| **VS Code** | `extension/learningos-drona-1.1.10.vsix` | `code --install-extension extension/learningos-drona-1.1.10.vsix` — or Extensions view → ⋯ → **Install from VSIX…** |
| **VS Code Insiders** | same `.vsix` | `code-insiders --install-extension extension/learningos-drona-1.1.10.vsix` |
| **Cursor** | same `.vsix` | Extensions → **Install from VSIX…** (Cursor is VS Code–based) — or use `.cursor-plugin/plugin.json` |
| **Windsurf / VSCodium / other VS Code forks** | same `.vsix` | **Install from VSIX…**, or `<binary> --install-extension …` |
| **GitHub Copilot CLI** | the plugin (this repo: `plugin.json` + `.mcp.json` + `.github/`) | `copilot plugin install <owner>/<repo>` — or point the CLI at this folder ([Install.md](./Install.md)) |
| **Claude Code** | `.claude-plugin/plugin.json` | install via your Claude plugin flow ([Install.md](./Install.md)) |
| **Gemini CLI** | `gemini-extension.json` | install via Gemini extensions ([Install.md](./Install.md)) |

> The `.vsix` gives you the **`@drona` chat participant** (with `/learn`, `/plan`, `/interview`, `/resume`,
> `/charts`) and the **“Drona: Set up LearningOS”** command that registers the local Flint-Chart MCP. The
> plugin manifests give the CLI/Claude/Gemini hosts the same agents, skills, and MCP.

## What the extension does
- Adds **`@drona`** to Copilot Chat — teaches from first principles, cites sources, ends with the Learning
  Footer, using the model you pick in the chat dropdown (VS Code Language Model API).
- A **learning dashboard** (LearningOS icon in the Activity Bar) with your profile, streak, history, and
  progress charts. **"Render with Flint-Chart"** renders richer charts using a **Flint engine bundled in the
  extension** — it works **fully offline** (spawns the bundled `flint-chart-mcp` via Node; no download, no
  network), and falls back to the built-in inline-SVG charts if anything's unavailable.
- **Run code with no install** — the `learningos_runcode` tool executes snippets via your chosen provider
  (**Piston** self-host/public, or **onlinecompiler.io**); pick it with `learningos.codeRunner.provider`.
  See [CodeExecution.md](./CodeExecution.md).
- **"Drona: Deploy all LearningOS agents & skills"** installs the full catalog (128 agents + 510 skills) to
  `~/.copilot` so VS Code Chat **and** the Copilot CLI discover them natively.
- **"Drona: Set up LearningOS"** also registers the Flint-Chart MCP in `.vscode/mcp.json` for `@drona /charts`.
- A **Getting Started** walkthrough.

> **Offline charts & platform note:** the bundled Flint engine renders via the **SVG (Vega-Lite)** path,
> which needs no native modules — so offline SVG rendering works. The engine also ships native modules
> (`@napi-rs/canvas`, `@resvg/resvg-js`) built for the packaging OS (Windows x64 here) for its PNG path; a
> cross-platform release would build a `.vsix` per OS. The built-in inline-SVG charts always work regardless.

## Requirements
- VS Code **1.95+** (or a compatible fork) with a Chat provider (e.g. GitHub Copilot) so a language model
  is available in the chat model picker.
- The dashboard's **Flint** charts run on the bundled engine via VS Code's own Node (offline) — no external
  Node/npx needed. `@drona /charts` (the MCP route) still uses `npx`.

## Build the `.vsix` yourself (or after editing)
```bash
cd extension
npm install
npm run compile        # type-check + emit out/
npm run package        # → extension/learningos-drona-<version>.vsix  (uses npx @vscode/vsce)
```
Press **F5** in the `extension/` folder to launch an **Extension Development Host** and try `@drona` live
before packaging.

## Publishing later (optional)
If you ever get a publisher account, the same project publishes to both marketplaces:
```bash
npx @vscode/vsce publish     # VS Code Marketplace (needs an Azure DevOps PAT + publisher)
npx ovsx publish             # Open VSX (needs an Open VSX token)
```
Add a `media/icon.png` (already included) and set `publisher` in `extension/package.json` to your id first.

## Uninstall
Extensions view → **LearningOS — Drona** → **Uninstall**, or `code --uninstall-extension learningos.learningos-drona`.
