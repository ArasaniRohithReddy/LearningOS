---
name: git-reflog-lab
description: "Hands-on Git lab on reflog and recovery: reading the reflog of HEAD moves, recovering commits lost to a bad reset --hard or rebase, rescuing work from a detached HEAD, and understanding gc expiry. Use for 'reflog lab', 'recover lost commits', 'undo a bad reset', 'undo a rebase', 'I lost my work in git', 'detached HEAD', or a guided hands-on recovery exercise. Teaches the model, not just commands."
argument-hint: "The thing to recover"
---

# Git Reflog Lab

A guided, hands-on lab on `git reflog` — Git's local diary of where HEAD has been, and your safety net for
lost work — following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Pairs
with [`git-coach`](../git-coach/SKILL.md) and [`worked-example`](../worked-example/SKILL.md); design flow via [`git-workflow-designer`](../git-workflow-designer/SKILL.md).

## When to use

- The learner ran a destructive op (`reset --hard`, a bad rebase, a deleted branch) and thinks work is gone.
- Teaching the reassuring truth: commits are rarely deleted immediately — reflog usually finds them.

## Procedure

1. **Concept.** Every HEAD move is logged locally as `HEAD@{n}`; the commits are still reachable until garbage
   collection prunes unreferenced objects (reachable ~90 days, loose ~30) (`git-reflog(1)`, git-scm.com, 2024).
2. **Read it.** `git reflog` shows recent moves (commit, checkout, reset, rebase) newest-first with `HEAD@{n}` refs.
3. **Undo a bad reset.** Make commits, run `git reset --hard HEAD~2` (they "vanish"), then `git reflog` finds the
   old tip and `git reset --hard HEAD@{1}` brings them back.
4. **Recover from a rebase.** After a rebase you dislike, find the pre-rebase SHA in the reflog and
   `git switch -c recovered <sha>` (or `git reset --hard <sha>`) to restore the original line.
5. **Rescue a detached HEAD.** Commits made while detached aren't on a branch; before switching away, capture them
   with `git branch keep <sha>` — otherwise only the reflog remembers them.
6. **Restore a deleted branch.** `git reflog` (or `git reflog show <branch>`) surfaces its last SHA → `git branch <name> <sha>`.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Inspect: git reflog            → HEAD@{0}, HEAD@{1}, … (newest first)
Undo reset/rebase: git reset --hard HEAD@{n}   (or git switch -c recover <sha>)
Detached HEAD: git branch keep <sha> before you switch away
⚠ Recovery is time-boxed by gc; act before pruning, and prefer a new branch over reset --hard
```

## Tips

- Reflog is **local and per-clone** — it can't recover work that was never committed on this machine.
- Before any risky recovery, branch the current state (`git switch -c backup`) so you can't make things worse.
- Don't run `git reflog expire --expire=now --all` or `git gc --prune=now` while hunting — that deletes the net.
- End with the **Learning Footer** (`AGENTS.md`) — the model to keep + a recovery drill to practice.
