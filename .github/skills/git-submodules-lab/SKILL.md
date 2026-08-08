---
name: git-submodules-lab
description: "Hands-on Git lab on submodules: adding a nested repo, cloning with --recurse-submodules, init/update, pinning to a specific commit, updating to a new upstream, and the common detached-HEAD and forgotten-push pitfalls. Use for 'submodules lab', 'add a git submodule', 'nested repo', 'clone with submodules', 'pin a submodule', 'update submodule', or a guided hands-on exercise. Teaches the model, not just commands."
argument-hint: "The nested repo"
---

# Git Submodules Lab

A guided, hands-on lab on submodules — embedding one repo inside another, pinned to an exact commit — following
the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`git-coach`](../git-coach/SKILL.md) and [`git-workflow-designer`](../git-workflow-designer/SKILL.md); walk it via [`worked-example`](../worked-example/SKILL.md).

## When to use

- The learner must vendor a shared library or nested repo and keep its version pinned and reproducible.
- Cloning "empty" submodule folders or "modified" submodule diffs are confusing the team.

## Procedure

1. **Concept.** A submodule is a **pinned pointer** (a gitlink storing one commit SHA) plus a `.gitmodules` map;
   the parent tracks *which commit*, not the files (`git-submodule(1)` / Pro Git 7.11, git-scm.com, 2024).
2. **Add.** `git submodule add <url> libs/dep` creates `.gitmodules` and the gitlink; commit both in the parent.
3. **Clone correctly.** `git clone --recurse-submodules <url>`; for an existing clone run
   `git submodule update --init --recursive` — otherwise submodule folders are empty.
4. **Pin / change version.** `cd libs/dep`, `git checkout <sha-or-tag>`, then in the parent `git add libs/dep` and
   commit — this moves the pin. `git submodule status` shows the recorded SHA.
5. **Update to upstream.** `git submodule update --remote libs/dep` fetches the tracked branch's latest; review, then
   commit the new pin in the parent.
6. **Set defaults.** `git config submodule.recurse true` so pulls/checkouts update submodules automatically.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Add: git submodule add <url> libs/dep   → commit .gitmodules + gitlink
Clone: git clone --recurse-submodules …  | existing: git submodule update --init --recursive
Pin: (in submodule) git checkout <sha> → (in parent) git add libs/dep && commit
Update: git submodule update --remote    Inspect: git submodule status
```

## Tips

- After updating a submodule, `git checkout` inside it leaves a **detached HEAD** — that's expected; the parent stores the SHA.
- Push the **submodule** repo before pushing the parent, or teammates get a pin pointing at a commit they can't fetch.
- `git submodule update` resets the submodule to the recorded commit — commit or stash local submodule work first.
- End with the **Learning Footer** (`AGENTS.md`) — the model to keep + a submodule drill to practice.
