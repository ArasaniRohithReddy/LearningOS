---
name: git-rebase-lab
description: "Hands-on Git lab on rebase: interactive rebase (squash, fixup, reword, reorder, drop), replaying commits onto a new base, autosquash, and the rebase vs merge trade-off — practiced safely on a throwaway branch. Use for 'rebase lab', 'interactive rebase', 'squash commits', 'reorder commits', 'rebase vs merge', 'clean up my history', or a guided hands-on rebase exercise. Teaches the model, not just commands."
argument-hint: "The history to tidy"
---

# Git Rebase Lab

A guided, hands-on lab on rebasing — *replaying* your commits onto a new base to tidy history — following
the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`git-coach`](../git-coach/SKILL.md), [`git-workflow-designer`](../git-workflow-designer/SKILL.md), and [`worked-example`](../worked-example/SKILL.md).

## When to use

- The learner wants clean, linear history and to understand what rebase *rewrites*, not memorize commands.
- Messy WIP commits, or "rebase vs merge?" confusion, before opening a pull request.

## Procedure

1. **Concept.** Rebase **replays** each commit onto a new base, creating **new commits with new SHAs** — it
   rewrites history, unlike merge which records a join (`git-rebase(1)`, git-scm.com/docs, 2024).
2. **Safe setup.** Work on a throwaway branch: `git switch -c rebase-lab`; note the tip SHA so you can recover.
3. **Squash & reword.** Run `git rebase -i HEAD~3`; in the todo list change `pick`→`squash`/`fixup` to combine
   commits, `reword` to fix a message, `drop` to delete. Save to apply; `git rebase --abort` cancels safely.
4. **Reorder.** Swap the `pick` lines in the todo list, replay, then confirm with `git log --oneline --graph`.
5. **Autosquash.** `git commit --fixup <sha>`, then `git rebase -i --autosquash <base>` slots the fix in for you.
6. **Rebase vs merge.** Rebase = linear history (rewrites SHAs); merge = preserves context (adds a merge commit).
   Rebase **local** work only; never rebase shared/pushed commits others have built on.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Branch: rebase-lab (throwaway)   Base: main
Todo verbs: pick | reword | squash | fixup | edit | drop   (reorder = move lines)
Verify: git log --oneline --graph   Recover: git reflog → git reset --hard HEAD@{n}
⚠ Rewrites history → push with git push --force-with-lease; never rebase shared commits
```

## Tips

- If a push is rejected after rebasing, use `git push --force-with-lease` — never a bare `--force` on shared branches.
- Lost a commit mid-rebase? `git reflog` lists every HEAD move; `git reset --hard HEAD@{n}` restores it.
- `git rebase --abort` returns you to the exact pre-rebase state — experiment fearlessly on a copy.
- End with the **Learning Footer** (`AGENTS.md`) — the model to keep + a rebase drill to practice.
