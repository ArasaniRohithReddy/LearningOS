---
name: daily-digest
description: "Produce a daily or weekly news digest for the learner's stack from authoritative sources — official releases and changelogs, vendor engineering blogs, communities, RSS/Atom feeds, curated newsletters, and papers — with a cited TL;DR and a 'what to do about it'. Use for 'daily digest', 'what's new this week', 'news roundup for my stack', or staying current. Powers the LearningOS News Engine."
argument-hint: "Stack/topics + window (today / last 7 days) + depth"
---

# Daily / Weekly Digest

Keep the learner current without the noise — following the source discipline in
[`AGENTS.md`](../../../AGENTS.md). This is the operational side of the News Engine (see
[`docs/News.md`](../../../docs/News.md)).

## When to use
- The learner wants a recurring, scoped roundup of what changed in their stack.
- The **Research and News Analyst** is producing a digest.

## Procedure
1. Confirm **scope**: technologies/roles, time window (today / last 7 days), and depth.
2. **Gather from primary sources** — prefer the newest official material. Use `web`/`search`, or, when
   configured, MCP servers (RSS, GitHub releases, Fetch, arXiv). Draw the source list from
   [`docs/Sources.md`](../../../docs/Sources.md) and the learner's [`templates/feeds.opml`](../../../templates/feeds.opml).
3. **Dedupe and rank by impact** (breaking changes, security, GA vs. preview) for the learner's stack.
4. Summarize with a **citation + date + source type** (official / blog / paper / community) per item.
5. Add **"what to do about it"** — concrete actions for their projects/learning.
6. Flag anything **unverified**; never guess.

## Output shape
```
Digest — <stack> — <date range>
TL;DR: 3–5 bullets (only what changed and why it matters)
By theme:
  • <update> [Source, official/blog/paper/community, YYYY-MM-DD]
What to do about it: 1–3 actions
Unverified / watching: …
```

## Tips
- Distinguish "announced/preview" from "generally available" — status and dates matter.
- One authoritative source beats five blogs repeating it.
- Offer to schedule a cadence and to tune the source list with `feed-curator`. End with the **Learning
  Footer** (`AGENTS.md`).
