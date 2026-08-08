---
name: feed-curator
description: "Recommend a personalized set of trustworthy sources and RSS/Atom feeds for the learner's stack — official blogs, release-note pages, engineering blogs, communities (Reddit, Stack Overflow, Discord), curated newsletters, LinkedIn creators/companies, and research venues — and export an OPML you can import into any reader. Use for 'which feeds should I follow', 'set up my RSS', 'best sources/communities for X', or building a learning news pipeline."
argument-hint: "Stack/roles/interests to curate sources for"
---

# Feed Curator

Build the learner a trustworthy, personalized information pipeline — following the source discipline in
[`AGENTS.md`](../../../AGENTS.md). Starts from the curated catalog
[`data/news-feeds.json`](../../../data/news-feeds.json) (~190 vetted feeds) and pairs with
[`docs/Sources.md`](../../../docs/Sources.md) and [`templates/feeds.opml`](../../../templates/feeds.opml).

## When to use
- The learner wants to set up RSS / follow the right people and communities for their stack.
- Kick-starting the News Engine so `daily-digest` has good inputs.

## Procedure
1. Confirm the learner's **stack, roles, and interests**, and their reader (RSS app, email, LinkedIn).
2. Select sources by **category** (prefer official; start from the curated catalog in
   [`data/news-feeds.json`](../../../data/news-feeds.json), then `docs/Sources.md`):
   - **Official docs & release notes/changelogs** (highest priority).
   - **Vendor & company engineering blogs** (Microsoft, GitHub, AWS, Google, Netflix, Stripe, Uber…).
   - **Communities**: Reddit subs, Stack Overflow tags, Discord/Slack, forums.
   - **Curated newsletters** and aggregators for the stack.
   - **LinkedIn** creators/companies to follow (note: usually no RSS — follow in-app).
   - **Research**: arXiv categories, official standards/RFCs.
3. **Resolve/verify feed URLs at query time** (`web`) — do **not** fabricate URLs; if a feed can't be
   confirmed, list the source by name and how to follow it.
4. Output a **categorized list** plus an **OPML** block the learner can import; mark LinkedIn/community
   items that lack RSS and how to follow them.
5. Suggest a **cadence** and hand off to `daily-digest` for the recurring roundup.

## Output shape
```
Sources for <stack>
Official: … | Eng blogs: … | Communities: … | Newsletters: … | LinkedIn: … | Papers: …
OPML (import into your reader):
<opml>…</opml>
Next: run /daily-digest weekly
```

## Tips
- Prefer a few high-signal sources over dozens of noisy ones.
- Verify every feed URL; respect each source's terms. End with the **Learning Footer** (`AGENTS.md`).
