---
name: git-cherry-pick-lab
description: "Hands-on Git lab on cherry-pick: applying specific commits from one branch onto another, resolving cherry-pick conflicts, recording provenance with -x, picking ranges, and handling merge commits with -m. Use for 'cherry-pick lab', 'apply a specific commit', 'port a commit to another branch', 'backport a fix', 'cherry-pick conflict', '-x provenance', or a guided hands-on exercise. Teaches the model, not just commands."
argument-hint: "The commit to port"
---

# Git Cherry-pick Lab

A guided, hands-on lab on `git cherry-pick` — copying a specific commit's changes onto your current branch as a
**new commit** — following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Pairs
with [`git-coach`](../git-coach/SKILL.md) and [`worked-example`](../worked-example/SKILL.md); branch strategy in [`git-workflow-designer`](../git-workflow-designer/SKILL.md).

## When to use

- The learner needs one fix on another branch (a backport/hotfix) without merging the whole branch.
- Teaching that a pick **replays a diff** into a new commit — new SHA, new author date context — not a move.

## Procedure

1. **Concept.** Cherry-pick applies the diff a commit introduced onto `HEAD`, creating a **new commit with a new
   SHA**; picking the "same" change onto two branches can later conflict on merge (`git-cherry-pick(1)`, git-scm.com, 2024).
2. **Setup.** Two branches with divergent work; `git switch <target>` where the commit should land.
3. **Pick one.** `git cherry-pick <sha>` (find it with `git log --oneline <source>`); confirm with `git log`.
4. **Record provenance.** `git cherry-pick -x <sha>` appends "(cherry picked from commit <sha>)" to the message —
   invaluable for tracing backports later.
5. **Resolve a conflict.** When it stops, edit files, `git add` them, then `git cherry-pick --continue`;
   `--abort` restores the pre-pick state and `--skip` drops the current commit.
6. **Ranges & merges.** `git cherry-pick A..B` picks each commit after A through B; a merge commit needs a parent:
   `git cherry-pick -m 1 <merge-sha>`. Use `-n` to stage without committing.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Target: git switch <branch>   Source commit: <sha> (git log --oneline)
Apply: git cherry-pick -x <sha>        (-x records provenance)
Conflict: edit → git add → git cherry-pick --continue   (| --abort | --skip)
Range: git cherry-pick A..B    Merge commit: git cherry-pick -m 1 <sha>
```

## Tips

- `A..B` is **exclusive** of A — use `A^..B` when you also want commit A itself.
- Prefer `-x` for backports so history records where the change came from; it's a comment, not a link.
- Cherry-picking duplicates commits across branches — overuse breeds merge conflicts; sometimes a merge/rebase is cleaner.
- End with the **Learning Footer** (`AGENTS.md`) — the model to keep + a cherry-pick drill to practice.
