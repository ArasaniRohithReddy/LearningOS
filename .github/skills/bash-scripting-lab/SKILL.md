---
name: bash-scripting-lab
description: "Hands-on Bash lab on shell scripting: variables and quoting, conditionals (if/case), loops (for/while), functions, and strict mode set -euo pipefail. Use for 'practice bash scripting', 'hands-on lab', 'teach me to write a bash script', 'loops and conditionals exercise', or learning Bash automation by building a script step by step."
argument-hint: "The script goal"
---

# Bash Scripting Lab

Learn Bash by **writing and running** a real script yourself, not by copying one — a guided,
hands-on lab following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *practice* scripting — variables, conditionals, loops, functions — by doing.
- Reinforcing safe automation for **Coding Mentor**; pairs with [`shell-scripting-coach`](../shell-scripting-coach/SKILL.md).

## Procedure
**Concept (60s):** a script is a program. Strict mode `set -euo pipefail` makes it stop on the first
error, unset variable, or failed pipe instead of limping on (`man bash`; GNU Bash 5.2, 2022).

1. **Sandbox:** `mkdir -p ~/bash-lab && cd ~/bash-lab` so every experiment is isolated and disposable.
2. **Scaffold:** first line `#!/usr/bin/env bash`, then `set -euo pipefail`; explain each flag aloud.
3. **Variables & args:** capture input with `name="${1:?usage: greet NAME}"`; always expand as `"$name"`.
4. **Branch & loop:** guard with `if [[ -f "$f" ]]` or `case`; iterate `for f in ./*.txt` / `while read -r`.
5. **Refactor:** wrap logic in `greet() { local n="$1"; …; }`, call it, then check its exit code `$?`.

**Reference sketch:**
```bash
#!/usr/bin/env bash
set -euo pipefail                       # exit on error / unset var / pipe fail
greet() { local name="${1:?need a name}"; printf 'Hi, %s\n' "$name"; }
for f in ./*.txt; do [[ -e "$f" ]] && greet "$f"; done
```
**Pitfalls:** unquoted `$var` word-splits on spaces; `set -e` skips some contexts (test it);
⚠ a blank var in `rm -rf "$dir/"` can wipe the wrong tree — guard with `: "${dir:?set dir}"`.

## Output shape
```
Goal: <script goal> | Header: #!/usr/bin/env bash ; set -euo pipefail
Steps 1–5: <what you built>; quoting + guard on every destructive step
Check: shellcheck clean? re-run safe (idempotent)? args validated?
```

## Tips
- ⚠ Dry-run destructive steps on sample files first; lint with `shellcheck` (shellcheck.net) before trusting it.
- Prefer `[[ ]]` over `[ ]`, `printf` over `echo`, and long flags for readability.
- Pair with [`shell-scripting-coach`](../shell-scripting-coach/SKILL.md) & [`linux-command-coach`](../linux-command-coach/SKILL.md); version scripts with [`git-coach`](../git-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
