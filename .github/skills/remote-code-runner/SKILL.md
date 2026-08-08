---
name: remote-code-runner
description: "Run and test code WITHOUT installing any language locally — execute snippets in 90+ languages via the free, keyless Piston public API (emkc.org), a self-hosted local Piston (Docker) for fully-offline unlimited practice, or onlinecompiler.io with an API key. Use for 'run this code', 'test my snippet', 'practice coding without installing X', 'what does this output', or quick cross-language experiments. Local installs only when a real project genuinely needs them."
argument-hint: "Language + the code to run (plus optional stdin/args)"
---

# Remote Code Runner

Let the learner practice coding **immediately — no toolchain install** — following
[`AGENTS.md`](../../../AGENTS.md). Execute code on a remote or local sandbox and teach from the *real*
output. Complements the hands-on `*-lab` skills and [LocalPractice.md](../../../docs/LocalPractice.md).

## When to use
- "Run / test this code", "what does this print", quick experiments across languages or versions.
- The learner hasn't installed the language (and doesn't need to yet) — keep them practicing, not configuring.
- Comparing behavior/output across languages.

## Procedure
1. **Pick a provider** (see the full [setup guide](../../../docs/CodeExecution.md) for exact steps + where to get a key):
   - **Self-hosted Piston (recommended — free, offline, no key, unlimited)** — run Piston locally with
     Docker and point at `http://localhost:2000/api/v2`. Best for practice; works air-gapped.
   - **onlinecompiler.io** — hosted; sign up and set an API key (get it from your onlinecompiler.io
     dashboard). Good if you'd rather not run Docker.
   - **Piston public** — `https://emkc.org/api/v2/piston` (discover languages via `GET …/runtimes`), but
     **`POST …/execute` is now whitelist-only (returns `401`)** — use a self-hosted or keyed provider instead.
2. **Build the request:** `{ "language": "<name|alias>", "version": "<semver or *>",
   "files": [{ "content": "<code>" }], "stdin": "<optional>", "args": [..] }`.
3. **Execute & read** `run.stdout`, `run.stderr`, `run.code` (and `compile.*` for compiled languages).
   Show the real output verbatim.
4. **Teach from it:** explain the output/errors and the *why*; propose one small change and re-run.
5. **Safety & limits:** never send secrets in the code; respect the rate limit; and say plainly when a
   **real local install is warranted** (native deps, large projects, step-debugging, performance work).

## Output shape
```
Ran <language> <version> via <provider>
stdout:
<output>
stderr / exit: <…> (code <n>)
Why it did that: <teaching>
Try next: <one variation to run>
```

## Tips
- **Free-first:** Piston public needs no signup; self-hosted Piston (Docker) gives unlimited offline runs.
- In VS Code, the LearningOS extension exposes this inline as the `@drona` **run-code tool** — configure
  the provider/key in Settings (`learningos.codeRunner.*`); same capability, no leaving Chat.
- Pair with `code-review-coach`, `debugging-coach`, and any `*-lab`. End with the **Learning Footer** (`AGENTS.md`).
