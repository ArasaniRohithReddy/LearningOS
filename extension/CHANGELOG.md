# Change Log

## 1.2.0

Tech News + Roadmaps: stay current and find your path — without leaving VS Code.

- **Tech News view** — a new Activity Bar view that pulls recent headlines from a curated catalog of
  ~190 vetted RSS/Atom sources (AI, cloud, release-notes, DevOps, data, security, languages, web,
  engineering blogs, research, tech news), grouped by category with a **Top picks** default. Each item
  opens externally or hands off to **🎓 Learn with Drona**. Feeds are fetched only in the extension host
  through the same SSRF guard as the fetch tool; the webview makes no network requests.
- **Roadmaps view** — a searchable, filterable list of 130+ [roadmap.sh](https://roadmap.sh) learning
  paths (role-based, skill-based, best-practices, project-ideas). **📅 Start with Drona** turns any
  roadmap into a personalized, dated plan. Link-out only (credit: roadmaps courtesy of roadmap.sh by
  Kamran Ahmed — © roadmap.sh, all rights reserved).
- **`learningos_news` tool** (also `#news`) + **`@drona /news`** — pull the latest items from your
  curated feeds so Drona can build a clustered, dated, cited digest.
- **Export curated feeds (OPML)** command — take the whole catalog into any RSS reader.
- The curated feed + roadmap catalogs ship as data (`data/news-feeds.json`, `data/roadmaps.json`) and
  are bundled into the packaged extension so both views work offline-first.

## 1.1.10

Security & hardening pass from a rubber-duck review — the code-runner key stays out of third-party hosts and lives in SecretStorage.

- **Never send the code-runner API key to a Piston host.** The `learningos_runcode` Piston path
  (`/runtimes` + `/execute`) is now strictly **keyless** — the shared header builder no longer attaches
  any `Authorization` / `X-API-Key` header, and the API key was removed from the Piston settings entirely.
  Previously a configured key (belonging to the `onlinecompiler` provider) could ride along on a request to
  the public **emkc.org** Piston (a third party) after switching providers. Only the `onlinecompiler` branch
  builds an `X-API-Key` header now, and only to your configured endpoint. **“Drona: Set up code execution”**
  also clears the plaintext key when you pick the public Piston (belt-and-suspenders, mirroring self-host).
- **Store the onlinecompiler key in SecretStorage, not plaintext settings.** The guided setup now saves your
  key via VS Code **SecretStorage** (encrypted, and not roamed by Settings Sync) and clears the plaintext
  `learningos.codeRunner.apiKey` setting. The run-code tool reads the key from SecretStorage first and, if it
  finds a key only in the (legacy) plaintext setting, **migrates it** into SecretStorage and clears the
  setting. The `learningos.codeRunner.apiKey` setting is kept as a documented fallback.
- **Flint-Chart client: cap the stdout buffer.** A newline-less / runaway MCP response can no longer grow
  memory until the timeout — the buffered stdout is capped at ~8 MB (mirroring the existing stderr cap), and
  exceeding it force-finishes the render and kills the child process.
- **Flint-Chart client: guard the taskkill spawn.** The Windows `taskkill` tree-kill now has an `error`
  listener, so a spawn failure can’t surface as an unhandled `uncaughtException`.
- **OneCompiler language aliases normalized.** Since OneCompiler has no `/runtimes` to resolve against, common
  aliases (`js`/`node`→`javascript`, `py`→`python`, `ts`→`typescript`, `rb`→`ruby`, `cs`→`csharp`,
  `kt`→`kotlin`, `sh`→`bash`, `c++`→`cpp`, `golang`→`go`, `rs`→`rust`, …) are mapped to canonical names before
  the run request (unknown/already-canonical values pass through unchanged).

## 1.1.9

Two real features — the dashboard's Flint-Chart button now renders for real, and you choose your code-execution provider.

- **Dashboard "✨ Render with Flint-Chart" renders locally and OFFLINE, for real.** The extension now
  **bundles its own Flint engine** — `flint-chart-mcp` (with vega-lite / echarts / chart.js) ships inside the
  `.vsix` as a real runtime dependency. Clicking the button **self-spawns the bundled server using the extension
  host's own Node** (`process.execPath` + `ELECTRON_RUN_AS_NODE=1`, no external Node/npx and **no network**),
  performs the MCP handshake over stdio (new **`src/flintClient.ts`**), calls `render_chart` (`format:"svg"`)
  with a `chart_spec` built from your own activity data, and shows the returned **SVG** as a sanitized `data:` URI
  in the dashboard `<img>` (no raw SVG is ever injected). It follows a graceful **fallback chain**, each rung with
  its own timeout and never hanging: **(a) bundled copy [offline, primary] → (b) `npx -y flint-chart-mcp` [online]
  → (c) a registered Flint LM tool via `vscode.lm.invokeTool` → (d) the built-in inline-SVG chart** — and the
  caption shows which path rendered it. A single timeout **always kills the child** (Windows tree-kill / POSIX
  process-group), so it never hangs and never leaves a zombie. New settings: **`learningos.flintChart.command`**
  (online-fallback launcher, default `npx`; empty = bundled only; a custom command is tried first),
  **`learningos.flintChart.args`** (default `["-y","flint-chart-mcp"]`), and **`learningos.flintChart.timeoutMs`**
  (default `35000`). Because the Flint engine is bundled, the packaged `.vsix` is now ~34 MB (up from ~1.2 MB) —
  that's the cost of true offline rendering.
- **Choose your code-execution provider: Piston or onlinecompiler.io.** New setting
  **`learningos.codeRunner.provider`** (`piston` | `onlinecompiler`, default `piston`). With **`piston`**,
  `learningos_runcode` uses `learningos.codeRunner.baseUrl` (self-hosted or public Piston) exactly as before, with all
  the existing hardening. With **`onlinecompiler`**, it POSTs your code to the new
  **`learningos.codeRunner.onlinecompilerEndpoint`** (default `https://api.onecompiler.com/v1/run`) with an
  `X-API-Key: <learningos.codeRunner.apiKey>` header and a `{ language, stdin?, files:[{ name, content }] }` body, then
  formats the returned **stdout / stderr / exception / status / executionTime**. A missing key returns a friendly
  nudge (the tool never throws), and the endpoint is validated as http/https. **“Drona: Set up code execution”** now
  sets the provider for you: self-host Piston, onlinecompiler.io (opens the site, takes your key, confirms the
  endpoint), or public Piston.
- **Runtime notes.** Local Flint rendering now works **offline** using the bundled engine (it runs on the extension
  host's own Node — no external Node/npx needed); the `npx` path remains only as an online fallback. The
  onlinecompiler provider needs an **API key** and the **endpoint** that matches whichever service you signed up for
  (onlinecompiler.io vs onecompiler.com), so the endpoint is configurable.

## 1.1.8

- Fix: 'Render with Flint-Chart' no longer hangs forever. invokeTool cancellation is cooperative, so if the Flint-Chart MCP doesn't respond the await never settled; now raced against a real 25s timeout that always returns a result (graceful message + offline charts remain).
## 1.1.7

- Hardening: null-safe version-sort tiebreak in the run-code tool (defensive vs. a malformed /runtimes payload).
## 1.1.6

- Teach visually by default: strengthened the diagram/visual-aid guidance (Mermaid/tables/KaTeX) in Drona's system prompt to match AGENTS.md 4; re-bundled the updated constitution.
## 1.1.5

Hardening pass from a rubber-duck review — safer deploys, safer code-runner calls.

- **Never silently overwrite your workspace `AGENTS.md`.** Deploying the catalog to a workspace used
  to clobber any existing root `AGENTS.md` (which is yours, and `@drona` treats it as the project
  constitution). Now the deploy **stats** the target first: if you already have a different
  `AGENTS.md`, it's **backed up** to `AGENTS.md.bak-learningos-<timestamp>` before the LearningOS one
  is installed; an identical file is left untouched; a missing one is simply created. The result is
  reported in the completion notification, and the confirmation modal now says so truthfully.
- **Code-runner HTTP reads are now capped.** `learningos_runcode` buffered the entire response body
  with no limit; it now streams with the same **~2 MB cap + Content-Length bail** as `learningos_fetch`
  (output is truncated to ~8000 chars anyway), for both `/execute` and `/runtimes`.
- **Deterministic language version.** When a self-hosted Piston lists multiple versions of a language
  (e.g. Python 3.10 **and** 3.12), the runner now picks the **highest** version (semver-sorted) instead
  of whichever the server listed first.
- **Correct `/runtimes` error labeling.** A reachable-but-rejected `/runtimes` response (e.g. HTTP
  429/403) is no longer mislabeled as an unreachable host — the HTTP **status** is surfaced, while
  genuine transport failures still read as connection errors.
- **Don't forward credentials on a redirect.** The `/execute` and `/runtimes` calls send
  `Authorization`/`X-API-Key` headers and the user's code; they now use `redirect:"manual"` so a 3xx
  can't silently re-issue that request (key + code) to another host — a redirect is reported as a clear
  error instead (defense-in-depth).
- **SSRF guard adds the CGNAT range.** `learningos_fetch` now also blocks `100.64.0.0/10` (RFC 6598
  shared address space, where Alibaba Cloud metadata lives), alongside the existing
  loopback/private/link-local/metadata ranges.
- **Workspace settings merge is workspace-scoped.** Merging `chat.agentSkillsLocations` for a workspace
  deploy now reads the **workspace-scoped** value (`inspect().workspaceValue`) rather than the merged
  value, so user-level entries are no longer re-materialized into workspace settings.
- **`@drona` verifies before it teaches.** Drona's system prompt now mirrors the constitution's new
  "Verify before you teach" principle — re-examine reasoning, cross-check official sources, trace/run
  code to confirm output before showing it, and never present a guess as fact.

## 1.1.4

A much richer dashboard, one-click first-run setup, and a real code-execution guide.

- **Rich learning-metrics dashboard.** The dashboard is now a full learning-analytics view built from
  your persisted data (all offline inline SVG / CSS — no CDN): an **Objective** panel, **Streak &
  momentum** (current + **longest streak**, total sessions, active days, distinct topics, last active), a
  **30-day activity** chart, **Topics by area**, **Commands & tools used** (`/learn`, `/plan`,
  `/interview`, `/resume`, `/charts`, chat, run-code, fetch), **Languages practiced** (per-language code
  runs), **Reviews due** (spaced-repetition prompts derived from your history), and **Recent history**.
- **Flint-Chart MCP rendering (optional).** A new **✨ Render with Flint-Chart** button renders the
  activity chart through the [Flint-Chart](https://github.com/microsoft/flint-chart) MCP when it's
  installed: the extension discovers the flint render tool at runtime in `vscode.lm.tools`, builds a chart
  spec from the same data, invokes it via `vscode.lm.invokeTool`, and displays the returned SVG. If the MCP
  isn't available it shows a hint and keeps the built-in charts — it never breaks offline.
- **First-run auto-setup (one-time, consent-based).** On first activation Drona offers **[Set up
  everything]** — deploy the full catalog (128 agents + 510 skills) to `~/.copilot` (works in VS Code Chat
  **and** the Copilot CLI) and enable Flint-Chart. Nothing is written until you click; it never nags twice.
  Also available anytime as **“Drona: Set up everything”** (`learningos.setupEverything`).
- **New: “Drona: Set up code execution” (`learningos.setupCodeExecution`).** Because the **public Piston
  `/execute` is now whitelist-only (HTTP 401)**, this guided command steers you to a reliable runner:
  **self-host Piston** with Docker (free/offline/unlimited — recommended, sets
  `learningos.codeRunner.baseUrl` to `http://localhost:2000/api/v2`), a **keyed provider** (onlinecompiler.io
  → saves `learningos.codeRunner.apiKey` and lets you confirm the base URL), or the public endpoint (with a
  401 warning). A new **media/codeexec.md** guide + walkthrough step give the exact Docker and package-API
  steps, and the run-code tool's error messages now recommend self-hosting first.
- **Store additions.** `commandCounts` and `languageRuns` usage maps (mutex-guarded, bounded, first-run
  safe) plus a lifetime **`longestStreak`**. `recordTurn` counts each turn's command; a new
  **`recordCodeRun`** is called from the run-code tool, and the fetch tool records its use. The injected
  learner memory and exported profile now include longest streak and languages practiced.
- **90+ languages** is now called out consistently in the run-code tool, Drona's instructions, and setup.

## 1.1.3

Run code without installing a language.

- **New `learningos_runcode` tool — run & test code in 90+ languages with no local install.**
  `@drona` (and any tool-capable model) can now execute a snippet remotely and teach from its
  **real** stdout/stderr/exit code, instead of guessing what code outputs. Reference it in Chat as
  **`#run`**. It uses the free, keyless **[Piston](https://github.com/engineer-man/piston)** sandbox
  by default, resolves the language version automatically from the runner's `/runtimes` (cached for
  the session), and streams back a compact, teachable result (resolved language + version, compiler
  errors when a compile fails, stdout/stderr, and the exit code, truncated to ~8000 chars).
- **Configurable, self-hostable, offline-capable.** Three new settings under **LearningOS — Drona**:
  - `learningos.codeRunner.baseUrl` (default `https://emkc.org/api/v2/piston`) — point it at a
    **self-hosted Piston** (`http://localhost:2000/api/v2`, via Docker) for **unlimited, offline**
    runs, or at any Piston-compatible service.
  - `learningos.codeRunner.apiKey` (default empty) — optional; sent as both `Authorization: Bearer`
    and `X-API-Key` headers to cover **keyed** Piston-compatible providers (e.g. onlinecompiler.io at
    `api.onlinecompiler.io`) — documented, best-effort via the generic base-URL + key knobs.
  - `learningos.codeRunner.timeoutMs` (default `15000`).
- **Graceful by design.** The tool never throws: network errors, non-200s (including the public
  Piston's rate-limit/whitelist responses), an unknown language (returns close matches), or a missing
  key all come back as a concise, actionable message that keeps the chat alive. Unlike
  `learningos_fetch`, it deliberately allows `localhost`/self-hosted targets (no SSRF block) — it only
  ever calls the runner **you** configure — while still requiring an http/https URL.
- **Drona routes to it.** Drona's instructions now tell it to run/test code via `learningos_runcode`
  and teach from the actual output, recommending a local install only when genuinely needed.
- **Catalog parity.** The bundled catalog now ships **510 skills** (adds `remote-code-runner`) and
  **128 specialist agents**.

## 1.1.2

Full-catalog parity + security/correctness fixes.

- **The full LearningOS catalog now ships and deploys.** The extension bundles all **128
  specialist agents**, **509 skills** (every offline/Floci lab included — real content, no
  stubs), and the **123 role configs**, plus `AGENTS.md` and the catalog `registry.json`. A new
  command **“Drona: Deploy all LearningOS agents & skills”** (`learningos.deployCatalog`)
  installs them into a location VS Code Copilot discovers natively — either your **user profile
  `~/.copilot/`** (roams across all workspaces + the Copilot CLI, recommended) or **this
  workspace `.github/`** (also merging `chat.agentSkillsLocations`). Deployment is idempotent, is
  gated behind a modal confirmation, and only ever adds/overwrites LearningOS’s own files — it
  never deletes yours.
- **`@drona` now routes to specialists.** A compact, size-bounded index of the catalog (agents by
  domain + skill packs) is injected into Drona’s system prompt, so it can point you at the exact
  specialist agent or `/skill` to use.
- **One coherent learner memory.** Drona now also folds a short excerpt of the skills-maintained
  profile (`learning-profile.md` / `.learningos/profile.md`) into the memory it sees, alongside its
  own cross-session summary.
- **Security — SSRF guard hardened (`learningos_fetch`).** `isBlockedHost` now blocks the classic
  bypass encodings it previously missed: decimal (`http://2852039166`), octal (`0177.0.0.1`), hex
  (`0x7f000001`), a trailing dot (`127.0.0.1.` / `localhost.`), and expanded / IPv4-mapped IPv6
  loopback (`0:0:0:0:0:0:0:1`, `::ffff:7f00:1`). Public hosts (incl. `172.15/172.32` and public
  IPv6) stay allowed. (Residual: the guard checks the hostname, not the resolved IP, so DNS
  rebinding is out of scope.)
- **Security — redirects validated on the primary path.** `fetchViaGlobal` now follows redirects
  **manually** and runs every hop’s `Location` host through the SSRF guard (previously
  `redirect:"follow"` skipped intermediate hops), keeping the redirect cap, byte cap and
  Content-Length bail.
- **Accurate “distinct topics.”** The lifetime distinct-topic count is now backed by a separate,
  larger “ever seen” set, so a topic evicted from the capped chart map and later revisited is no
  longer recounted.
- **Wording fix.** The exported profile no longer claims Drona reads it on `/resume` (memory is
  injected, not file-read); it’s now labelled “Exported for your reference.”

## 1.1.1

Bug-fix release.

- **Real cross-session memory.** A compact learner-memory summary (goal/target, level,
  stack, current streak, recent topics, agreed next step) is now injected into Drona's
  system prompt on every `@drona` turn, and `@drona /resume` continues from that summary
  directly (it no longer asks the model to read a file it can't access). A new
  **`learningos_remember`** language-model tool lets the model persist those facts, so the
  dashboard profile card is populated and memory actually survives across sessions.
- **Profile no longer collides with the skills' `learning-profile.md`.** Drona used to
  overwrite `learning-profile.md` in the workspace root — the same file the LearningOS
  skills maintain — on every turn. It now writes **`.learningos/profile.md`** (configurable
  via `learningos.profilePath`) and only **on demand** (via *Drona: Show my learning
  progress*), never per turn.
- **Dashboard activity chart is visible on dark themes.** SVG bar/baseline colors moved
  from `var()`-based presentation attributes (which Chromium doesn't resolve) to CSS rules,
  so bars and the baseline render correctly on Dark Modern.
- **Tool-loop final answer no longer errors.** When the tool-use cap is hit, Drona now
  fulfils the pending tool calls (or otherwise avoids a dangling `tool_calls` message) before
  asking for the final answer, and wraps that request in error handling — so it no longer
  throws a provider 400 at the user.
- **Safer fetch tool.** `learningos_fetch` now enforces the ~2 MB body cap on the primary
  (global `fetch`) path by streaming the response, adds an **SSRF guard** that rejects
  loopback/private/link-local/metadata hosts (on the initial URL and every redirect hop), and
  **caps redirects** on the Node fallback path.
- **Bounded storage & no lost turns.** The distinct-topics map is capped (~200 entries) with
  a separate lifetime distinct-topics counter, and all `globalState` writes are serialized
  behind an async mutex so overlapping turns can't clobber each other.
- **Consistent local dates.** History/profile dates now display the **local** calendar day,
  matching the activity chart and streak.
- **Pinned `@types/vscode`** to `~1.95.0` (matching the declared engine floor) and re-synced
  the lockfile.

## 1.1.0

- **Live, current information** — `@drona` can now fetch official pages via a new
  `learningos_fetch` language model tool and a tool-calling loop in the participant. Ask for the
  "latest news / releases / what's new" on any technology and Drona retrieves and cites the official
  source (Azure, AWS, GCP, Python, Node, .NET, Kubernetes, VS Code, and more) instead of refusing.
  Any installed fetch/search MCP tools are used too. Requires a chat model that supports tools;
  Drona degrades gracefully (with a note) on models that don't.
- **LearningOS dashboard** — a dedicated Activity Bar view container with a webview dashboard showing
  your **profile**, **progress** (streak, sessions, distinct topics, last active), an offline
  **inline-SVG activity chart** (last 21 days), a **topics-by-area** breakdown, and **recent history**.
  Buttons: Onboard, Resume, Refresh, Open profile.md.
- **Cross-session persistence** — every `@drona` turn is recorded to global storage (survives across
  sessions and workspaces) and mirrored to a human-readable `learning-profile.md`. New command
  **"Drona: Open Dashboard"**; **"Drona: Show my learning progress"** now opens the up-to-date profile.

## 1.0.0

- Initial release.
- `@drona` chat participant with `/learn`, `/plan`, `/interview`, `/resume`, `/charts` commands.
- "Drona: Set up LearningOS" command registers the local Flint-Chart MCP for progress charts.
- Getting-started walkthrough.
