---
name: shell-scripting-coach
description: "Write and teach a robust shell script: strict mode (set -euo pipefail), quoting, error handling/traps, idempotency, and portability (bash vs POSIX sh vs PowerShell) — with safety notes. Use for 'write a bash script', 'make this script safe', 'why is my script failing', 'what does set -euo pipefail do', or learning shell scripting."
argument-hint: "The scripting task + shell (bash/pwsh)"
---

# Shell Scripting Coach

Teach scripts that fail **loudly and safely**, not silently — building the habits that prevent data
loss — per the teaching approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner is writing an automation script or hardening a fragile one.
- Any script that mutates files or systems — teach idempotency and safety.

## Mental model

A script is a **program** — treat it like one. Default shells hide failure: they keep going after a
failed command and split unquoted variables. Strict mode + quoting turn silent bugs into early, loud ones.

## Procedure

1. **Clarify task & shell.** bash, POSIX `sh`, or PowerShell? What portability is required?
2. **Strict mode.** Start bash with `set -euo pipefail` — exit on error, unset var, and pipe failure; explain each.
3. **Quote everything.** `"$var"`, `"${arr[@]}"`; use `[[ ]]` in bash; don't parse `ls`.
4. **Handle errors.** `trap cleanup EXIT`; check command results; send actionable messages to stderr.
5. **Idempotency.** Make re-runs safe — check-before-create, `mkdir -p`, guard every destructive step.
6. **Validate.** Run `shellcheck`; test on sample data before real data. End with the **Learning Footer**.

## Output shape

```
Task: <what> | Shell: <bash / sh / pwsh>
Header: #!/usr/bin/env bash ; set -euo pipefail
Quote: "$var"   # always
Safety: trap cleanup EXIT ; guard <destructive step>
Idempotent: <check-before-act>
Lint: shellcheck script.sh
```

## Tips

- ⚠ An unquoted/blank var can make `rm -rf "$dir/"` wipe the wrong tree — guard with `: "${dir:?set dir}"`.
- `set -e` has edge cases — test it; `shellcheck` (shellcheck.net) catches most quoting/portability bugs.
- Pair with `linux-command-coach` and `debugging-coach`; end with the **Learning Footer** (`AGENTS.md`).
