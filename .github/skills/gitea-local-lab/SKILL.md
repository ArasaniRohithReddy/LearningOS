---
name: gitea-local-lab
description: "Hands-on lab to self-host Git locally with Gitea (lightweight, open-source, no subscription) in Docker — create repos, branches, pull requests, and run built-in Gitea Actions with a local runner. Use for 'self-hosted Git', 'local GitHub alternative', 'Gitea setup', 'practice PRs offline', 'local CI/CD server', or learning a Git server + review flow by doing."
argument-hint: "The Gitea repo/PR/Actions goal"
---

# Gitea Local Lab

Learn the full Git-server + review loop by hosting it yourself — Gitea is a lightweight, open-source
forge you run in one container — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [git-workflow-designer](../git-workflow-designer/SKILL.md) and [act-github-actions-lab](../act-github-actions-lab/SKILL.md).

## When to use

- You want to practice repos, branches, pull requests, and reviews on a private server you control.
- Learning built-in CI/CD (**Gitea Actions**) without a cloud account or subscription.

## Mental model

- Gitea is a single Go binary/container serving web + Git over HTTP/SSH (default port **3000**). Repos
  live on its disk; **Gitea Actions** (built-in since Gitea 1.19) delegates jobs to a separate
  **Gitea Runner** — a hard fork of nektos/act.

## Procedure

1. **Run the server:** start `gitea/gitea` in Docker with a volume for `/data` and port 3000 published
   (Gitea docs, *Install with Docker*); open `http://localhost:3000` and finish the first-run installer (SQLite is fine for a lab).
2. **Create admin & repo:** register the first user (becomes admin), create a repository, then
   `git clone` it over HTTP to your machine.
3. **Branch & PR:** push a feature branch, open a **pull request** in the UI, review the diff, and
   merge — the same flow as GitHub, offline.
4. **Enable Actions:** turn on Actions for the repo, register a **Gitea Runner** with a token from
   admin/repo settings, and add a workflow under `.gitea/workflows/` (or `.github/workflows/`).
5. **Verify CI:** push a commit, watch the job run on your runner, and read logs in the Actions tab.

## Output shape

```
Tool: Gitea (self-hosted, OSS) | Web/Git: http://localhost:3000
Data: volume → /data | DB: SQLite (lab) | SSH optional
Flow: repo → branch → pull request → review → merge
Actions: enable → register Gitea Runner (token) → .gitea/workflows/*.yml
Runner: act_runner (fork of nektos/act) | Docs: docs.gitea.com (2025)
```

## Tips

- Only register runners you trust — a runner executes arbitrary workflow code (Gitea docs).
- Keep the admin account and instance private; back up the `/data` volume before upgrades.
- End with the **Learning Footer** (`AGENTS.md`) — one PR you merged + one workflow to add yourself.
