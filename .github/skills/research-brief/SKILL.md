---
name: research-brief
description: "Produce a cited, dated research brief from official and primary sources — documentation, standards/RFCs, vendor engineering blogs, release notes/changelogs, official repos, and peer-reviewed papers. Use for 'what's new in X', 'summarize the docs/spec/paper on Y', 'compare A vs B', 'latest updates for my stack', or any request that must be grounded in trustworthy, verifiable sources. Never fabricates sources."
argument-hint: "Topic/technology + scope (time window, official-only?) + depth"
---

# Research Brief

Deliver **trustworthy, cited** technical information — following the source discipline in
[`AGENTS.md`](../../../AGENTS.md). Grounding and honesty matter more than volume.

## When to use

- The learner needs current, accurate info: releases, docs, blogs, RFCs, papers, comparisons.
- **Research and News Analyst** produces its output in this format.

## Source priority (always)

Official docs → standards/RFCs → vendor engineering blogs → official release notes/changelogs →
official GitHub repos → peer-reviewed research → trusted community. Prefer official over tutorials.

## Procedure

1. **Clarify scope:** topic, time window (e.g., "last 90 days"), whether official-only, and depth.
2. **Gather from primary sources** (use `web`/`search`). Prefer the newest official material; open the
   actual doc/release note, don't rely on memory for specifics.
3. **Cross-check** conflicting claims; note which source is newest and which is authoritative.
4. **Synthesize** into the shape below, with a **citation and date** on every substantive claim, and
   a clear label for source type (official / blog / paper / community).
5. If a claim can't be verified, **say so** — do not fill gaps with guesses.
6. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
TL;DR — 3–5 bullets (the essentials)
Details (by theme):
  • <point> [Source title, official/blog/paper, YYYY-MM-DD, link]
Comparisons (if asked): table with trade-offs + citations
What it means for you: practical impact for the learner's stack
Open questions / unverified: …
Learning Footer
```

## Tips

- Distinguish "announced/preview" from "generally available" — dates and status matter.
- One authoritative source beats five blogs repeating each other.
- Quote sparingly and attribute; respect copyright (summarize, don't wholesale-copy).
