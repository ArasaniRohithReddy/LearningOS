# Run code without installing a language (setup guide)

LearningOS lets you **practice coding in 90+ languages without installing any toolchain**, via the
[`remote-code-runner`](../.github/skills/remote-code-runner/SKILL.md) skill and the VS Code extension's
`@drona` **run-code tool** (`learningos_runcode`). This page shows how to set it up and where to get an
API key when one is needed.

> **Reality check (verified 2026-07-20):** the free public Piston endpoint still lists languages
> (`GET https://emkc.org/api/v2/piston/runtimes` → 200, 87 languages) but **`POST …/execute` now returns
> `401` (whitelist-only)**. So the best *free, no-key, unlimited* path is **self-hosting Piston locally**.
> Pick whichever option fits you:

## Option 1 — Self-host Piston with Docker (recommended: free, offline, no key, unlimited)

This runs the same Piston sandbox on your machine — no account, no rate limit, works offline.

```bash
# 1) Start Piston (needs Docker Desktop / Podman)
docker run -d --name piston -p 2000:2000 ghcr.io/engineer-man/piston

# 2) Install the language runtimes you want (via Piston's package API)
#    List installable packages:
curl http://localhost:2000/api/v2/packages
#    Install e.g. Python and Node:
curl -X POST http://localhost:2000/api/v2/packages -H "Content-Type: application/json" -d "{\"language\":\"python\",\"version\":\"3.12.0\"}"
curl -X POST http://localhost:2000/api/v2/packages -H "Content-Type: application/json" -d "{\"language\":\"node\",\"version\":\"20.11.1\"}"
```

Then point LearningOS at it — VS Code **Settings** → search "LearningOS":
- `learningos.codeRunner.baseUrl` = `http://localhost:2000/api/v2`  (leave `apiKey` empty)

Now `@drona`, run this: `console.log(1+1)` works with **no cloud, no key**. See the official
[engineer-man/piston](https://github.com/engineer-man/piston) repo for the current image tag, package
list, and self-host details (always prefer the official instructions over this snapshot).

## Option 2 — onlinecompiler.io / OneCompiler (hosted, needs a free API key)

Set **`learningos.codeRunner.provider` = `onlinecompiler`** (the other value is `piston`) — both are
first-class; it's your choice.

1. Go to **https://onlinecompiler.io/** and sign up (free tier).
2. Open your account/dashboard and **create an API key** (copy it).
3. In VS Code **Settings → LearningOS**:
   - `learningos.codeRunner.provider` = `onlinecompiler`
   - `learningos.codeRunner.onlinecompilerEndpoint` = `https://api.onecompiler.com/v1/run` (default; adjust to your account's docs)
   - `learningos.codeRunner.apiKey` = *your key* (sent as `Authorization: Bearer <key>` and `X-API-Key: <key>`)
4. Run `Drona: Set up code execution` (Command Palette) — it walks you through the same steps.

The API it calls (verified): `POST {endpoint}` with an `X-API-Key` header, body
`{ "language":"python", "stdin":"…", "files":[{ "name":"main.py", "content":"…" }] }` → response
`{ "stdout", "stderr", "status", "executionTime", … }`.

## Option 3 — public Piston (may need whitelisting)

Leave the default `learningos.codeRunner.baseUrl` (`https://emkc.org/api/v2/piston`). It works only if your
IP is whitelisted; otherwise you'll see a `401` — use Option 1 or 2 instead. (The tool surfaces this and
tells you what to do.)

## How it's used
- **Skill (plugin + deployed to the extension):** `remote-code-runner` — the agent runs your snippet and
  teaches from the real `stdout`/`stderr`/exit code.
- **Extension tool:** `@drona run this python: print(sum(range(10)))` → executes and shows output inline.
- **Languages:** any of Piston's 90+ (resolved live from `/runtimes` — Python, JS/TS, Go, Rust, Java, C/C++,
  C#, Ruby, PHP, Kotlin, Swift, Bash, SQL, and many more).

## Good practice
- Never paste secrets into code you run remotely.
- The public endpoint is rate-limited (~5 req/s) even when whitelisted; self-hosting removes limits.
- Use remote execution to *practice*; install a language locally when you need native deps, a debugger,
  performance work, or a real project ([LocalPractice.md](./LocalPractice.md)).
