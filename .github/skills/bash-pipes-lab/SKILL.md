---
name: bash-pipes-lab
description: "Hands-on Bash lab on pipes and redirection: stdin/stdout/stderr (fd 0/1/2), building pipelines with |, redirecting with > >> 2> 2>&1, and process substitution <(...). Use for 'practice pipes and redirection', 'hands-on lab', 'what is 2>&1', 'stdin stdout stderr', 'process substitution', or learning to compose Bash command chains by doing."
argument-hint: "The command chain"
---

# Bash Pipes Lab

Learn how data flows between commands by **wiring streams together** yourself — a guided, hands-on
lab following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *understand* `|`, `>`, and `2>&1` by building pipelines, not memorizing them.
- Composing tools into one chain; pairs with [`linux-command-coach`](../linux-command-coach/SKILL.md).

## Procedure
**Concept (60s):** every process has three streams — stdin (0), stdout (1), stderr (2). Pipes join one
program's stdout to the next one's stdin; redirection points a stream at a file (`man bash`, Redirections; POSIX.1-2017).

1. **See the streams:** `echo out; echo err >&2`; split them with `./cmd 1>out.txt 2>err.txt` and inspect.
2. **Pipe:** connect stages — `ps aux | grep ssh | wc -l`; each `|` feeds one stdout into the next stdin.
3. **Redirect:** `>` creates/truncates, `>>` appends, `2>` captures errors; try `set -o noclobber` then `>|`.
4. **Merge errors:** `cmd > run.log 2>&1` sends both streams to one file — order matters (redirect stdout first).
5. **Process substitution:** compare two live outputs with `diff <(sort a.txt) <(sort b.txt)`.

**Reference sketch:**
```bash
set -o pipefail                          # a mid-pipe failure fails the whole chain
grep -c ERROR app.log | tee counts.txt   # tee writes to a file AND passes through
diff <(sort old.txt) <(sort new.txt)     # each <(...) acts like a temporary file
```
**Pitfalls:** `cmd 2>&1 >f` merges *before* the redirect (wrong order); `>` silently truncates;
without `pipefail` a pipeline reports only the *last* command's exit status.

## Output shape
```
Goal: <the command chain>
Flow: stdin → cmd | cmd | cmd → stdout ; 2> errors ; <(...) as a file
Check: streams separated? exit status right (pipefail)? no file clobbered?
```

## Tips
- ⚠ `>` overwrites without asking — use `>>` to append or `set -o noclobber` to block it.
- Build a pipeline one stage at a time, checking output before adding the next `|`.
- Pair with [`linux-command-coach`](../linux-command-coach/SKILL.md) & [`shell-scripting-coach`](../shell-scripting-coach/SKILL.md); version chains with [`git-coach`](../git-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
