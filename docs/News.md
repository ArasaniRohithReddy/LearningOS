# LearningOS — News, RSS & Research

Staying current is a first-class learning goal. The **Research and News Analyst** agent and the
[`research-brief`](../.github/skills/research-brief/SKILL.md) skill deliver cited, dated updates from
authoritative sources — never rumor.

## What you can ask for

- **Latest changes** in a technology ("what's new in .NET 10 / MCP / Fabric").
- **Release notes / changelog** summaries with impact.
- **Doc / blog / paper** summaries at your level.
- **Comparisons** of technologies or versions.
- **Daily / weekly digests** scoped to your stack.

## Source priority (always)

Official docs → standards/RFCs → vendor engineering blogs → official release notes/changelogs →
official GitHub repos → peer-reviewed research → trusted community. Prefer official over tutorials, and
**always attach a source + date**; label each as official / blog / paper / community.

## Suggested watch-list (from the vision)

Tune to your interests; the analyst will prioritize what matters to you:

- **Platforms/vendors**: Microsoft/Azure, GitHub, Google/GCP, AWS, NVIDIA, OpenAI, Anthropic,
  Linux Foundation/CNCF, Docker, Kubernetes, Databricks, Snowflake, Microsoft Fabric, Power BI.
- **Engineering blogs**: Netflix, Meta, Stripe, Uber, Airbnb, Cloudflare.
- **Languages/frameworks**: Python, Java, Rust, Go, .NET, Node.js, React, Angular, Vue, SQL.
- **Topics**: AI, agents, MCP, RAG, prompt engineering, security, DevOps, data.
- **Papers**: arXiv (cs.AI, cs.SE, cs.CL), official RFCs.

## Digests

Ask for a **daily** or **weekly** digest. A good digest is:

```
Digest — <stack> — <date range>
TL;DR: 3–5 bullets (only what changed and why it matters)
By theme:
  • <update> [Source, official/blog/paper, YYYY-MM-DD]
What to do about it: 1–3 concrete actions for your projects/learning
```

## Live feeds via MCP (optional)

With MCP configured (see [MCP.md](./MCP.md)), the analyst can pull **live** data instead of relying on
memory: an RSS server for feeds, the GitHub server for repo releases/watching, Fetch for official
pages, and arXiv for papers. Without MCP it uses `web`/`search`. Either way, citations and dates are
mandatory, and unverifiable claims are flagged, not guessed.
