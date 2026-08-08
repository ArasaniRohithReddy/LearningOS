---
name: engineering-blog-finder
description: "Find reputable engineering blogs and specific high-quality posts on a topic — official vendor/product blogs and company engineering blogs (Microsoft, GitHub, AWS, Google, Netflix, Meta, Stripe, Uber, Cloudflare, and more) — with verified links, authors, and dates. Use for 'find engineering blog posts on X', 'how did <company> solve Y', 'best deep-dive articles on Z', or gathering practitioner perspectives. Verifies links; labels each as official vs company blog; never fabricates."
argument-hint: "Topic/technology + (optional) companies or depth you want"
---

# Engineering Blog Finder

Surface **trustworthy engineering writing** — official product blogs and respected company engineering
blogs — for a topic, and pull the specific posts worth reading. Follows the source discipline in
[`AGENTS.md`](../../../AGENTS.md) and powers the LearningOS **Engineering Blog Discovery** capability.
Pairs with [`feed-curator`](../feed-curator/SKILL.md), [`daily-digest`](../daily-digest/SKILL.md), and
[`docs/Sources.md`](../../../docs/Sources.md).

## When to use
- The learner wants real-world practitioner depth (architecture decisions, post-mortems, trade-offs)
  that official docs don't cover.
- Building a reading list, or feeding `daily-digest` / `feed-curator` with high-signal blog sources.

## Where to look (prefer official first)
1. **Official product/engineering blogs** (the vendor of the technology) — highest authority for intent.
2. **Company engineering blogs** with a strong track record — e.g. Netflix, Meta, Stripe, Uber, Airbnb,
   Cloudflare, GitHub, Microsoft, AWS, Google, Dropbox, Shopify, Discord.
3. **Reputable individual practitioners/maintainers** — verify credibility (who they are, why trust them).

## Procedure
1. Clarify the **topic, desired depth**, and any preferred companies/stacks.
2. Find candidate posts via `web`/`search`; prioritize **primary** (the team that built it) and recent.
3. **Verify each link** (open it): confirm the publisher, author, and **publication date**; discard dead
   or content-farm links. Never invent a URL or a post title.
4. For each pick, give a one-line **why it's worth reading** and its key takeaway.
5. **Label source type** (official product blog / company eng blog / individual) and flag anything dated.
6. Offer to add the best sources to a feed via `feed-curator`, or summarize the top post with
   `research-brief`.

## Output shape
```
Engineering reads on <topic>
  • <Post title> — <Company/Author>, <official/company/individual>, YYYY-MM-DD — <url>
    Why: <one line> · Takeaway: <one line>
  • …
Best source to follow: <blog + how to subscribe>   → run /feed-curator to add it
Learning Footer
```

## Tips
- Prefer the team that *built* the thing over commentary about it.
- Note bias: vendor blogs promote their product — cross-check claims with docs or neutral sources.
- Weigh recency for fast-moving topics; a 2019 post may be stale. Respect copyright: summarize + link.
- End with the **Learning Footer** (`AGENTS.md`).
