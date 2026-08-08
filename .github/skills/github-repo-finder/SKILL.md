---
name: github-repo-finder
description: "Find high-quality, relevant GitHub repositories for a topic — official/reference implementations, well-maintained libraries, example projects, and curated 'awesome' lists — and assess each repo's health (stars, recent commits, releases, issues, license, maintenance). Use for 'find a GitHub repo for X', 'reference implementation of Y', 'best library for Z', 'example project to learn from', or 'is this repo maintained'. Verifies repos exist; never fabricates."
argument-hint: "Topic/technology + what you want (library, example, reference impl, awesome-list)"
---

# GitHub Repo Finder

Find the **repositories worth the learner's time** — official code, solid libraries, learnable examples —
and judge whether each is healthy and trustworthy. Follows the source discipline in
[`AGENTS.md`](../../../AGENTS.md) and powers the LearningOS **GitHub Repository Discovery** capability.
Pairs with [`code-review-coach`](../code-review-coach/SKILL.md) and [`project-mentor`](../project-mentor/SKILL.md).

## When to use
- The learner wants a library, a reference implementation, or an example project to learn from.
- Vetting whether a repo is **maintained, reputable, and safe** to depend on or study.

## What "high quality" means (signals to check)
- **Provenance**: is it the official org/author, or a credible maintainer? (Beware typo-squats/forks.)
- **Maintenance**: recent commits, recent **releases/tags**, responsive issues/PRs, a changelog.
- **Adoption & docs**: stars/used-by as a *weak* signal, plus a real README, docs, and tests.
- **License**: present and appropriate for the learner's intended use (permissive vs copyleft).
- **Security hygiene**: no obvious abandonment, unresolved critical advisories, or suspicious code.

## Procedure
1. Clarify the **goal** (learn from it, depend on it, or contribute) and language/stack constraints.
2. Search GitHub (`web`/`search`, or the GitHub MCP server if configured). Prefer **official** repos and
   well-known curated **awesome-<topic>** lists as jumping-off points.
3. **Open each candidate** and verify it exists; read the README and check the health signals above
   (last commit date, latest release, open/closed issue ratio, license). Never invent a repo or stats.
4. Rank a short list by fit + health; call out risks (stale, no license, single-maintainer, pre-1.0).
5. Suggest the best repo to **read for learning** vs the best to **depend on**, and hand off to
   `code-review-coach` (study the code) or `project-mentor` (build on it).

## Output shape
```
Repos for <goal> in <language>
  • owner/repo — <one-line purpose> [official? · ★ approx · last commit YYYY-MM · latest release vX · license]
    Health: <maintained/stale, risks> · Best for: <learn | depend | contribute>
  • …
Awesome list (to explore more): <owner/awesome-x> — <url>
Pick: <the one to start with, and why>
Learning Footer
```

## Tips
- Stars measure popularity, not quality or safety — weight maintenance and provenance higher.
- Prefer the upstream/official repo over a random fork; check the default branch and release cadence.
- Always name the **license**; flag "no license" (all rights reserved) explicitly.
- Don't paste large code verbatim; link and summarize. End with the **Learning Footer** (`AGENTS.md`).
