# LearningOS — Trusted Sources Catalog

A catalog of trustworthy sources for staying current, organized by category. The **Research and News
Analyst**, [`daily-digest`](../.github/skills/daily-digest/SKILL.md), and
[`feed-curator`](../.github/skills/feed-curator/SKILL.md) draw on this. See also [News.md](./News.md).

> Sources are listed **by name and category**. Feed/URL specifics change, so agents **resolve and
> verify current URLs at query time** (`web`/MCP) and never fabricate them. A small, verified OPML
> starter lives at [`templates/feeds.opml`](../templates/feeds.opml).

## Source priority (always)

Official docs → standards/RFCs → vendor engineering blogs → official release notes/changelogs →
official GitHub repos → peer-reviewed research → trusted community. Prefer official over tutorials;
attach a source + date to every claim.

## 1. Official documentation
Microsoft Learn · GitHub Docs · Azure Docs · AWS Docs · Google Cloud Docs · Kubernetes.io ·
OpenAI Docs · Anthropic Docs · Databricks Docs · Snowflake Docs · HashiCorp Docs · Python/.NET/Java/
Rust/Go official docs · MDN (web).

## 2. Release notes & changelogs (what shipped)
Azure Updates · AWS What's New · Google Cloud release notes · GitHub Changelog · Kubernetes releases ·
.NET / language release notes · product-specific changelogs. Distinguish **preview** vs **GA**.

## 3. Vendor & company engineering blogs
Microsoft DevBlogs · GitHub Blog · AWS Architecture/News blogs · Google/Cloud blogs · Databricks ·
Snowflake · Cloudflare · Netflix Tech Blog · Meta Engineering · Stripe · Uber · Airbnb · Spotify ·
CNCF. Great for the "why" behind decisions.

## 4. Communities
Reddit (e.g. r/dataengineering, r/devops, r/MachineLearning, r/programming) · Stack Overflow (tags) ·
Stack Overflow Blog · Hacker News · dev.to · Discord/Slack communities · official product forums.
Treat community content as leads to verify against official sources.

## 5. Newsletters & aggregators
Reputable curated newsletters for the stack (e.g. data/AI/DevOps roundups) · Hacker News · Lobsters ·
GitHub Trending. Use `feed-curator` to pick a few high-signal ones.

## 6. LinkedIn
Follow official **company pages** (Microsoft, GitHub, Databricks, etc.) and respected **creators** in
the learner's field for releases, talks, and community signal. LinkedIn generally has **no RSS** —
follow in-app; `feed-curator` recommends who to follow and `daily-digest` folds in anything shared
publicly and verifiable.

## 7. Research & standards
arXiv (cs.AI, cs.LG, cs.SE, cs.CL, stat.ML) · official RFCs/IETF · standards bodies (W3C, ISO) ·
conference proceedings. Summarize at the learner's level; cite with dates.

## 8. Practice environments (local, free)
Learn by doing without a paid account. **[Floci](https://github.com/floci-io/floci)** provides free,
open-source, MIT-licensed **local cloud emulators** — `docker compose up`, then point your existing
SDK/CLI/Terraform at a localhost endpoint (no cloud account, token, or feature gates):
[Floci (AWS)](https://github.com/floci-io/floci) `:4566` ·
[Floci AZ (Azure)](https://github.com/floci-io/floci-az) `:4577` ·
[floci-gcp (GCP)](https://github.com/floci-io/floci-gcp) `:4588`. The `floci-aws-local-lab`,
`floci-azure-local-lab`, and `floci-gcp-local-lab` skills use these so learners can run the cloud
`*-lab` exercises offline. Treat emulators as approximations — verify against official cloud docs.

## How agents use this
- `feed-curator` turns the learner's stack into a **personalized, verified** source list + OPML.
- `daily-digest` pulls from these (via `web` or MCP: RSS, GitHub, Fetch, arXiv) and produces a cited,
  dated roundup with "what to do about it".
- The **Research and News Analyst** answers one-off "what's new / compare / summarize" questions.

See [MCP.md](./MCP.md) to wire live feeds, and [Security.md](./Security.md) for handling untrusted
fetched content safely.
