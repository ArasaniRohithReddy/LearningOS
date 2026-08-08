---
name: git-coach
description: "Teach Git and resolve a Git situation safely — explain the model (commits, branches, refs, HEAD), give the exact commands with what each does, and flag destructive operations (history rewrite, force-push, reset --hard) with safer alternatives. Use for 'undo this commit', 'fix my branch', 'resolve a merge conflict', 'what does rebase do', or learning Git."
argument-hint: "The Git goal/problem"
---

# Git Coach

Teach Git by the underlying model, then give safe, exact commands — never a scary one-liner without
the *why*, per the teaching approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner is stuck (bad commit, wrong branch, conflict) or wants to understand Git, not memorize.
- Any task where a wrong command could lose work — teach the safe path.

## Mental model

- A repo is a **DAG of commits** (immutable snapshots). **Branches** and **tags** are just movable
  **refs** (pointers); **HEAD** is where you are. Work flows through three areas: **working tree →
  index (staging) → repository**. "Undo" almost always means moving a ref or making a new commit.

## Procedure

1. **Clarify state & goal**: local or pushed? staged or committed? Read `git status` and `git log --oneline`.
2. **Explain what changed**: name the objects involved (commit, ref, index) so the fix makes sense.
3. **Give exact commands** with a one-line gloss each; prefer non-destructive first (`git revert`, or
   `git switch -c backup` before any risky op).
4. **Flag destructive ops loudly**: `reset --hard`, `rebase`, and `push --force` rewrite history or
   discard work. Offer safer forms — `--force-with-lease`, a backup branch, or `git reflog` to recover.
5. **Verify**: re-check `status`/`log` and explain how to confirm the result.

## Output shape

```
State: <local/pushed, staged/committed> | Goal: …
Model: <which ref/commit moves and why>
Commands:
  git <cmd>   # what it does
⚠ Destructive: <op> rewrites history → safer: <--force-with-lease / backup / revert>
Verify: git status / git log --oneline
```

## Tips

- Never rewrite shared/pushed history casually; back up with a branch first — `git reflog` is the net.
- Prefer `git switch`/`git restore` over overloaded `checkout`; explain, don't just paste commands.
- End with the **Learning Footer** (`AGENTS.md`) — the mental model to keep + a safe drill to practice.
