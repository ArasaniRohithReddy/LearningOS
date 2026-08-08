---
name: pre-commit-lab
description: "Hands-on lab to wire local Git hooks with the pre-commit framework (open-source, no subscription) — add a .pre-commit-config.yaml, install the hook, and auto-run lint/format/secret checks before every commit across any language. Use for 'pre-commit hooks', 'lint before commit', 'local git hooks', 'format on commit', 'block secrets', or learning shift-left checks by doing."
argument-hint: "The checks/hooks to run before commit"
---

# pre-commit Lab

Learn shift-left quality by catching issues *before* they're committed — the open-source `pre-commit`
framework manages Git hooks in any language, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [git-hooks-lab](../git-hooks-lab/SKILL.md) and [secure-code-review](../secure-code-review/SKILL.md).

## When to use

- You want lint/format/secret checks to run automatically on `git commit`, locally, with no CI round-trip.
- Learning how shared, reproducible hooks replace copy-pasted bash scripts across projects.

## Mental model

- `pre-commit` is a **multi-language package manager for hooks**. A `.pre-commit-config.yaml` lists hook
  **repos** pinned by `rev`; `pre-commit install` writes `.git/hooks/pre-commit`, then fetches and runs
  each hook in its own isolated environment on your staged files.

## Procedure

1. **Install the tool:** `pip install pre-commit` (or Scoop/Brew), then `pre-commit --version` to
   confirm (pre-commit docs, *Quick start*).
2. **Add config:** create `.pre-commit-config.yaml` — start from `pre-commit sample-config` (e.g.
   `trailing-whitespace`, `end-of-file-fixer`, `check-yaml`), pinning each `repo` + `rev`.
3. **Install the hook:** `pre-commit install` wires it into `.git/hooks/` so checks run on every `git commit`.
4. **Run on demand:** `pre-commit run --all-files` when you add hooks, so the whole repo is brought
   into line — not just changed files.
5. **Maintain:** `pre-commit autoupdate` bumps `rev`s to current releases; run the same hooks in CI so nothing is skipped.

## Output shape

```
Tool: pre-commit (OSS) | Config: .pre-commit-config.yaml
Hooks: repo + rev + [id …]  (pinned, per language)
Install: pre-commit install → .git/hooks/pre-commit
Run: git commit (staged) | pre-commit run --all-files
Update: pre-commit autoupdate | also run in CI | pre-commit.com (2025)
```

## Tips

- Pin every `rev` for reproducibility; unpinned hooks drift silently across machines.
- Hooks fail the commit — keep them fast, and add a secrets check so credentials never land ([secure-code-review](../secure-code-review/SKILL.md)).
- End with the **Learning Footer** (`AGENTS.md`) — one hook you enabled + one check to add yourself.
