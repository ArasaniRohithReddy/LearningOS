---
name: linux-command-coach
description: "Explain or build a Linux command or pipeline step by step: what each flag does, safer alternatives, and how to compose tools (pipes, redirection, xargs, find) — with a loud warning before destructive commands. Use for 'what does this command do', 'explain this pipeline', 'how do I <task> in the shell', 'is this command safe', or learning the command line."
argument-hint: "A command to explain OR a task to accomplish"
---

# Linux Command Coach

Teach the command line by decomposing every flag and pipe — so the learner can read and write
commands safely — per the teaching approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has a command to understand, or a task to turn into one.
- Any command that could delete or overwrite data — teach the safe path first.

## Mental model

The shell composes **small single-purpose tools** via streams — **stdin/stdout/stderr** — joined by
pipes `|` and redirection `>`. Power comes from combining them, not from one giant command.

## Procedure

1. **State intent.** Explain an existing command, or build one for a goal?
2. **Decompose.** Split into command + flags + arguments; gloss each token in plain words (cite `man <cmd>`).
3. **Trace data flow.** Follow what moves through each `|` and where `>` / `2>` send output.
4. **Safety check.** Flag destructive ops (`rm -rf`, `dd`, `mkfs`, `>` overwrite, `chmod -R`) *before* running.
5. **Safer alternative.** `ls` before `rm`; `rm -i`; `--dry-run` / `-n`; back up; test on a throwaway copy.
6. **Compose & verify.** Build up incrementally, checking output at each stage. End with the **Learning Footer**.

## Output shape

```
Goal: <explain | build>
Breakdown: cmd -flag   # what it does (man <cmd>)
Data flow: stdin → | → | → stdout  ;  > file
⚠ Destructive: <rm -rf / dd / …> → safer: <dry-run / -i / backup>
Verify: <how to confirm the result>
```

## Tips

- ⚠ Never run a destructive command "just to see" — dry-run it or test on a disposable copy first.
- Prefer long flags in scripts (`--recursive`) for readability; **quote** variables to avoid word-splitting.
- Pair with `shell-scripting-coach` and `debugging-coach`; end with the **Learning Footer** (`AGENTS.md`).
