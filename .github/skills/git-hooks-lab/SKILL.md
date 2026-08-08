---
name: git-hooks-lab
description: "Hands-on Git lab on hooks: writing client-side pre-commit and pre-push scripts to run linters and tests, understanding the commit-msg hook, bypassing safely, and sharing hooks across a team with core.hooksPath. Use for 'hooks lab', 'pre-commit hook', 'pre-push hook', 'run tests before commit', 'share git hooks', 'block bad commits', or a guided hands-on automation exercise. Teaches the model, not just commands."
argument-hint: "The automation"
---

# Git Hooks Lab

A guided, hands-on lab on Git hooks — scripts Git fires at lifecycle events to automate checks — following the
teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`git-coach`](../git-coach/SKILL.md) and [`git-workflow-designer`](../git-workflow-designer/SKILL.md); walk an example via [`worked-example`](../worked-example/SKILL.md).

## When to use

- The learner wants to catch problems (lint, tests, secrets) *before* they enter history, not in CI later.
- Standardizing a team's local checks and understanding why hooks aren't shared by default.

## Procedure

1. **Concept.** Hooks are executable scripts in `.git/hooks/`; Git runs the one named for an event. A **non-zero
   exit aborts** the action. They live outside version control, so cloning doesn't copy them (`githooks(5)`, git-scm.com, 2024).
2. **Inspect samples.** List `.git/hooks/` — the `*.sample` files show each hook's inputs; drop `.sample` to enable one.
3. **pre-commit.** Create `.git/hooks/pre-commit`, `chmod +x` it, run your linter, and `exit 1` on failure to block
   the commit. Test it by committing clean vs. dirty code.
4. **pre-push.** Add `.git/hooks/pre-push` to run the test suite; a non-zero exit stops the push before it leaves your machine.
5. **Bypass safely.** `git commit --no-verify` skips pre-commit/commit-msg for a genuine one-off — never make it a habit.
6. **Share across the team.** Commit scripts to a tracked `hooks/` dir, then `git config core.hooksPath hooks` (Git 2.9+);
   or adopt a manager (pre-commit.com, Husky) so everyone runs the same checks.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Event → script: pre-commit (lint) · commit-msg (message rules) · pre-push (tests)
Enable: create .git/hooks/<name>, chmod +x, exit non-zero to block
Bypass: git commit --no-verify   (deliberate, rare)
Share: track hooks/ + git config core.hooksPath hooks   (or pre-commit/Husky)
```

## Tips

- Hooks in `.git/hooks/` are **not** cloned — use `core.hooksPath` or a manager so the team actually shares them.
- Keep hooks fast and deterministic; slow pre-commit checks train people to reach for `--no-verify`.
- Client-side hooks are advisory (bypassable) — enforce real gates in CI (`ci-pipeline-builder`), not only locally.
- End with the **Learning Footer** (`AGENTS.md`) — the model to keep + a hook to write and test.
