---
name: git-workflow-designer
description: "Design a team Git branching and release workflow as a lesson — choose trunk-based, GitHub Flow, or GitFlow for the team's release cadence, then define branch naming, PR/review rules, CI gates, and merge/versioning conventions with explicit trade-offs. Use for 'which branching strategy', 'set up our Git workflow', 'trunk vs GitFlow', 'release process', or 'PR conventions'."
argument-hint: "The team + release cadence"
---

# Git Workflow Designer

Design a branching model that fits how the team actually ships — cadence first, ceremony second — per
the teaching approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). For individual Git
mechanics use [git-coach](../git-coach/SKILL.md); wire gates with [ci-pipeline-builder](../ci-pipeline-builder/SKILL.md).

## When to use

- A team must pick or fix a branching/release strategy and wants the reasoning, not a template.
- Merge pain, long-lived branches, or unclear release steps signal the current flow doesn't fit.

## The choices (teach the trade-off)

- **Trunk-based**: short-lived branches merge to `main` daily behind feature flags — fastest feedback,
  needs strong CI. **GitHub Flow**: branch → PR → review → deploy `main` — simple, ideal for CD.
  **GitFlow**: `develop` + `release`/`hotfix` branches — supports versioned products but adds overhead.
  Match branch **lifetime** to **release cadence**: continuous → trunk; versioned → GitFlow.

## Procedure

1. **Profile the team**: size, release cadence (CD vs. versioned), review culture, CI maturity.
2. **Pick a base model** and justify it against that profile; name what you're trading away.
3. **Define conventions**: branch naming, PR size/review count, required status checks, merge style
   (squash vs. merge commit), and how versions/tags are cut.
4. **Protect `main`**: branch protection, required CI, no direct pushes; keep branches short-lived.
5. **Document the day-to-day**: the exact path from idea → merged → released.

## Output shape

```
Team: <size, cadence, CI maturity>
Model: Trunk-based | GitHub Flow | GitFlow — why + trade-off
Branches: <naming, lifetime>  Merge: squash|merge  Version: <tag/release>
Rules: PR review ≥N, required checks: <build/test>, protected: main
Flow: idea → branch → PR → CI → review → merge → release
```

## Tips

- Base claims on official docs (docs.github.com GitHub Flow; trunkbaseddevelopment.com, 2024) — don't dogmatize.
- Prefer short-lived branches and squash merges to keep history readable; long-lived branches breed conflicts.
- End with the **Learning Footer** (`AGENTS.md`) — the model to keep + a workflow to trial for one sprint.
