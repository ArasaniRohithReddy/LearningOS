---
name: bash-functions-lab
description: "Hands-on Bash lab on functions and arguments: defining functions, positional parameters ($1 $@ $#), shift, local variables, return codes vs printed output, and sourcing a reusable library. Use for 'practice bash functions', 'hands-on lab', 'function arguments', 'return code vs output', 'local variables', 'reusable shell script', or learning Bash functions by building them."
argument-hint: "The reusable script"
---

# Bash Functions Lab

Learn to package logic into **reusable functions** — with clean arguments, scoping, and return codes —
a guided, hands-on lab following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *practice* writing functions and passing arguments, not just calling built-ins.
- Refactoring a long script into reusable parts; pairs with [`shell-scripting-coach`](../shell-scripting-coach/SKILL.md).

## Procedure
**Concept (60s):** a function is a named command. Arguments arrive positionally (`$1`, `"$@"`, count `$#`);
`return` yields an exit *status* (0–255), while data is *printed* (`man bash`, Shell Functions; GNU Bash 5.2, 2022).

1. **Define & call:** `greet() { printf 'Hi, %s\n' "$1"; }` then `greet World`; no `()` at the call site.
2. **Read args:** use `"$@"` for all args, `$#` for the count, and `shift` to consume them one by one.
3. **Scope with local:** declare `local name="$1"` so the function can't clobber a caller's variable.
4. **Status vs data:** `return 1` signals failure (check `$?`); to hand back a value, `printf` it and capture `$(fn)`.
5. **Reuse:** move functions to `lib.sh`, `source ./lib.sh`, and validate inputs with `"${1:?usage}"`.

**Reference sketch:**
```bash
# returns a status AND prints a result the caller can capture
divide() { local a="${1:?}" b="${2:?}"; (( b != 0 )) || return 1; printf '%s\n' $(( a / b )); }
if result=$(divide 10 2); then echo "ok: $result"; else echo "divide by zero" >&2; fi
```
**Pitfalls:** `return` only carries 0–255 — never a string or big number; unquoted `$@` word-splits (use `"$@"`);
skipping `local` leaks variables to global scope; `return` exits the function, `exit` kills the whole script.

## Output shape
```
Function: name() { local … ; … ; return <status>; }
Args: "$@" all ; $# count ; shift ; validate "${1:?}"
Check: local used? status vs printed output separated? "$@" quoted?
```

## Tips
- ⚠ `exit` inside a sourced function ends the *caller's* shell — use `return` in library code.
- Keep functions small and single-purpose; take input as args, return a status, print data.
- Pair with [`shell-scripting-coach`](../shell-scripting-coach/SKILL.md) & [`linux-command-coach`](../linux-command-coach/SKILL.md); reuse a lib tracked in [`git-coach`](../git-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
