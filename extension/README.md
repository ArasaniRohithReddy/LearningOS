# LearningOS — Drona (VS Code extension)

**Drona** is your AI learning mentor. Type **`@drona`** in the Chat view and it teaches from first
principles, cites sources, **runs and tests code for you (no local install needed)**, and helps you
**learn, plan, practice, and prep**. It also **bundles the full
[LearningOS](https://github.com/Rohithreddy7123/LearningOS) catalog** — run **“Drona: Deploy
all LearningOS agents & skills”** and VS Code Copilot discovers **128 specialist agents** (agent
picker) and **510 skills** (`/` in Chat) natively.

Works in **VS Code**, **VS Code Insiders**, and VS Code–family editors that support the Chat + Language
Model APIs.

## Features

- **`@drona` chat participant** — ask anything; Drona explains the *why*, not just the answer, and ends
  with a Learning Footer (Recap · Pitfalls · Next topic · Try it). It also **routes you** to the right
  LearningOS specialist agent or `/skill` once you've deployed the catalog (below).
- **Full catalog, deployed on demand** — the extension **bundles** the complete LearningOS catalog
  (**128 specialist agents**, **510 skills** incl. every offline/Floci lab, and **123 role configs**).
  Run **“Drona: Deploy all LearningOS agents & skills”** to install them where VS Code Copilot finds
  them natively:
  - **User profile `~/.copilot/`** *(recommended)* — roams across **every** workspace **and** the
    Copilot CLI.
  - **This workspace `.github/`** — also merges `chat.agentSkillsLocations` so `.github/skills/` is
    picked up, and writes the LearningOS `AGENTS.md` at the workspace root.

  Deployment is **idempotent** (re-run only replaces LearningOS's own files; a marker records the
  version), gated behind a **modal confirmation**, and **never deletes your files**. After it runs,
  open the **agent picker** or type **`/`** in Chat to use everything.
- **Cross-session memory** — Drona remembers your **goal/target**, **level**, **tech stack** and
  **agreed next step** across sessions. A compact memory summary is fed into every answer so it stays
  personalized, and **`@drona /resume`** continues from it. When you state or change any of those facts,
  Drona saves them via the built-in **`learningos_remember`** tool. Your data stays in local storage.
- **Live, current info** — for "latest news / releases / what's new" questions, Drona uses the built-in
  **`learningos_fetch`** language model tool (a tool-calling loop) to fetch and cite the **official
  source** (Azure, AWS, GCP, Python, Node, .NET, Kubernetes, VS Code, …) instead of refusing. Installed
  fetch/search MCP tools are used too. Fetches are limited to public pages (loopback/private hosts are
  refused). *(Needs a tool-capable chat model and network access; degrades gracefully otherwise.)*
- **First-run setup (one-time)** — the first time the extension activates it offers, with a single
  prominent prompt, to **Set up everything**: deploy the whole catalog to `~/.copilot` (so it works in
  VS Code Chat **and** the Copilot CLI) and enable progress charts. It is **consent-based** — nothing is
  written until you click a button — and never nags twice. You can re-run it anytime via **“Drona: Set up
  everything”**.
- **Run code without installing a language** — for "run this", "test this", or "what does this output"
  requests, Drona uses the built-in **`learningos_runcode`** tool (referenceable as **`#run`**) to
  execute your snippet remotely and teach from the **real** stdout/stderr/exit code — across **90+
  languages**, with **no local toolchain**. You choose the **provider** via
  **`learningos.codeRunner.provider`**: **`piston`** (self-hosted or public Piston) or **`onlinecompiler`**
  (onlinecompiler.io / OneCompiler, with an API key). Because the **public Piston `/execute` is now
  whitelist-only (HTTP 401)**, run **“Drona: Set up code execution”** to pick and configure one: **self-host
  Piston** via Docker (`http://localhost:2000/api/v2`, free/offline/unlimited — recommended),
  **onlinecompiler.io** (opens the site, takes your key, confirms the endpoint), or the public Piston. See
  [Set up code execution](#set-up-code-execution) below. *(The tool fails gracefully with guidance.)*
- **LearningOS dashboard** — a dedicated **Activity Bar** view with a rich, fully-offline set of
  learning metrics built from your persisted data as inline SVG / CSS bars:
  - **Objective** (goal · level · stack · next step, with an Onboard CTA when empty),
  - **Streak & momentum** (current streak · **longest streak** · total sessions · active days · distinct
    topics · last active),
  - **Activity (last 30 days)** — daily activity chart,
  - **Topics by area**, **Commands & tools used** (`/learn`, `/plan`, …, run-code, fetch), **Languages
    practiced** (per-language run counts), **Reviews due** (spaced-repetition prompts), and **Recent
    history**.

  Click **✨ Render with Flint-Chart (local)** to render the activity chart with the **Flint-Chart MCP**,
  fully **offline**: the extension **bundles its own Flint engine** (`flint-chart-mcp` + vega-lite/echarts/chart.js)
  and self-spawns it on the extension host's **own Node** (`process.execPath` + `ELECTRON_RUN_AS_NODE`, no external
  Node/npx, no network), does the MCP handshake → `render_chart`, and shows the returned **SVG** as a sanitized
  `data:` URI. It falls back gracefully — **bundled → `npx` → a registered Flint LM tool → the built-in chart** — with
  a per-attempt timeout so it never hangs, and the caption shows which path rendered it. Data persists **across
  sessions and workspaces**. Export a human-readable profile on demand (**Drona: Show my learning progress** →
  `.learningos/profile.md`, configurable via `learningos.profilePath`; it never touches the skills'
  `learning-profile.md`). Buttons: Onboard · Resume · Refresh · Open profile.md.
- **Slash commands:**
  - `@drona /learn <topic>` — explain from first principles, with an example.
  - `@drona /plan <goal>` — a dated study roadmap with milestones.
  - `@drona /interview <role>` — one mock-interview question, scored.
  - `@drona /resume` — pick up where you left off + the best next step.
  - `@drona /charts` — describe a progress chart (rendered via the Flint-Chart MCP).
- **Commands:** **“Drona: Set up everything”** (deploy catalog to `~/.copilot` + enable charts),
  **“Drona: Deploy all LearningOS agents & skills”** (installs the bundled catalog — see above),
  **“Drona: Set up code execution”** (guided runner setup — see below), **“Drona: Open Dashboard”**,
  **“Drona: Show my learning progress”**, and **“Drona: Set up LearningOS”** — the last registers the
  local **Flint-Chart MCP** (progress charts) into `.vscode/mcp.json` and offers to deploy the catalog.
  Charts render **locally**; your data never leaves the machine.
- **Getting-started walkthrough.**

## Set up code execution

Drona runs code via your chosen **provider** (`learningos.codeRunner.provider`). Run
**“Drona: Set up code execution”** and pick one — it sets the provider and the relevant settings for you:

- **Self-host Piston (recommended — free, offline, no key).** Sets `provider` = `piston`. Run it with Docker,
  then point Drona at it:

  ```bash
  docker run -d --name piston -p 2000:2000 ghcr.io/engineer-man/piston
  # install the languages you want (repeat per language):
  curl -s -X POST http://localhost:2000/api/v2/packages \
    -H "Content-Type: application/json" -d '{"language":"python","version":"3.12.0"}'
  ```

  Then set **`learningos.codeRunner.baseUrl`** to `http://localhost:2000/api/v2` (the command can do this
  for you). Unlimited, private, offline, 90+ languages.
- **onlinecompiler.io (API key).** Sets `provider` = `onlinecompiler`. Sign up at <https://onlinecompiler.io/>
  (or onecompiler.com), create an API key, and paste it when prompted — it's saved to
  **`learningos.codeRunner.apiKey`** and sent as the `X-API-Key` header. The tool POSTs to
  **`learningos.codeRunner.onlinecompilerEndpoint`** (default `https://api.onecompiler.com/v1/run`); the setup
  command lets you confirm/adjust that endpoint to **match whichever service you signed up for** (the host is
  ambiguous across sources — onlinecompiler.io vs onecompiler.com).
- **Public Piston.** Sets `provider` = `piston` with the public base URL. No setup, but often returns
  **HTTP 401** — switch to one of the above if runs fail.

## Requirements

- VS Code **1.95+** (or a compatible fork) with GitHub Copilot Chat (or another Chat provider) enabled so
  a language model is available in the chat model picker.
- For **live "latest news / what's new"** answers: a chat model that supports **tool calling** and
  **network access** (Drona fetches official pages). Without either, Drona still answers and points you to
  the official source URLs.
- **Node.js** is **optional** for charts — the dashboard's **✨ Render with Flint-Chart (local)** button ships a
  **bundled** Flint engine and renders **offline** on the extension host's own Node. External Node/`npx` is only used
  as an online fallback (or if you point `learningos.flintChart.command`/`args` at another launcher).

## Install

**From the `.vsix` file** (no Marketplace account needed):

```bash
code --install-extension learningos-drona-1.1.9.vsix
# VS Code Insiders:
code-insiders --install-extension learningos-drona-1.1.9.vsix
```

Or in the UI: **Extensions** view → **⋯** menu → **Install from VSIX…** → pick the file.

## Build it yourself

```bash
cd extension
npm install
npm run bundle         # copy the repo catalog into content/  (run automatically by package/prepublish)
npm run compile        # type-check + emit out/
npm run package        # → learningos-drona-<version>.vsix   (uses npx @vscode/vsce)
```

`npm run package` runs the bundle step automatically (via `prepackage` and `vscode:prepublish`), so the
packaged `.vsix` always ships the full catalog under `content/`.

Press **F5** in this folder to launch an **Extension Development Host** and try `@drona` live.

## Privacy

Drona uses the model you pick in the chat dropdown (via VS Code's Language Model API). The Flint-Chart MCP
renders on-device. Your learner data lives in local extension storage; the on-demand profile export is a
local Markdown file (`.learningos/profile.md`) you control, kept separate from the skills'
`learning-profile.md`. See the LearningOS `docs/Security.md`.

## License

MIT — see [LICENSE](./LICENSE).
