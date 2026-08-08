---
name: act-github-actions-lab
description: "Hands-on lab to run GitHub Actions workflows locally with act (nektos/act) in Docker — no subscription, no cloud minutes. List and run jobs, trigger events (push, pull_request), pass secrets/variables, and pick runner images to debug .github/workflows fast. Use for 'run Actions locally', 'test my workflow without pushing', 'act nektos', 'local CI for GitHub Actions', or learning CI by doing."
argument-hint: "The workflow/job to run locally"
---

# act GitHub Actions Lab

Learn CI by running your *real* GitHub Actions workflows on your own machine — fast feedback, no
pushes, no cloud minutes — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [ci-pipeline-builder](../ci-pipeline-builder/SKILL.md) and [gitea-local-lab](../gitea-local-lab/SKILL.md).

## When to use

- You're iterating on `.github/workflows/*` and don't want to push commits just to test them.
- Learning what a workflow / job / step actually does before it runs in the cloud.

## Mental model

- `act` reads `.github/workflows/`, maps each `runs-on` label to a **Docker image**, and runs jobs in
  containers on your host — the same YAML the cloud runs, minus GitHub-hosted infra and some contexts.

## Procedure

1. **Install & list:** install via WinGet/Scoop/Choco (act User Guide, *Installation*), then `act -l`
   to list the workflows/jobs act can see — verify discovery before running anything.
2. **Pick a runner image:** on first run choose **Medium** (`catthehacker/ubuntu:act-latest`); map
   labels with `-P ubuntu-latest=catthehacker/ubuntu:act-latest`. Images are close to, not identical to, GitHub runners.
3. **Run an event:** bare `act` triggers the default **push** event; `act pull_request` or
   `act -j <job>` runs a specific event/job.
4. **Feed secrets/vars:** pass `-s TOKEN=…` / `--secret-file .secrets` and `--var`/`--var-file`;
   keep `.secrets` out of git.
5. **Dry-run & debug:** `act -n` prints the plan without executing; check the *Unsupported
   functionality* matrix when behavior differs from the cloud.

## Output shape

```
Tool: act (nektos/act) | Reads: .github/workflows/*.yml
Discover: act -l | Event: push (default) | act pull_request | act -j <job>
Runner: -P ubuntu-latest=catthehacker/ubuntu:act-latest (Medium)
Secrets/vars: -s K=V | --secret-file .secrets ; --var K=V
Dry run: act -n | Docs: nektosact.com (2025)
Not 1:1 with GitHub-hosted → consult the support matrix
```

## Tips

- act needs a running Docker engine; the first run writes your image choice to `~/.actrc`.
- Green in act is fast feedback, **not** a cloud guarantee — wire the real gate with [ci-pipeline-builder](../ci-pipeline-builder/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one workflow you ran locally + one job to add yourself.
