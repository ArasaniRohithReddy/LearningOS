---
name: official-docs-finder
description: "Find the authoritative official documentation for a technology, product, API, or version — the canonical docs home, the exact relevant pages, the version/release-notes, and the API reference — with verified links and dates. Use for 'where are the official docs for X', 'find the real documentation', 'link me the API reference', 'which page covers Y', or grounding a lesson in primary sources. Verifies every URL; never fabricates links."
argument-hint: "Technology/product/API + the specific topic or version you need docs for"
---

# Official Docs Finder

Locate the **canonical, first-party documentation** for a technology and point the learner at the exact
pages that answer their question — following the source discipline in [`AGENTS.md`](../../../AGENTS.md).
This is the front door of the LearningOS **Official Documentation Discovery** capability; pair it with
[`research-brief`](../research-brief/SKILL.md) and [`docs/Sources.md`](../../../docs/Sources.md).

## When to use
- The learner needs the *real* docs, not a blog or an outdated tutorial.
- A lesson or research task must be grounded in primary sources before teaching.
- You need the correct **version** of the docs (GA vs preview, v2 vs v3, LTS vs latest).

## Source priority (always)
Official product docs → standards/RFCs → official API reference → official release notes/changelogs →
official repo READMEs. Prefer first-party over any third-party restatement.

## Procedure
1. **Identify the owner.** Determine who publishes the canonical docs (vendor, standards body, or the
   project itself) and the official docs domain — beware look-alike/mirror sites and content farms.
2. **Confirm the version.** Ask or infer which version/edition matters; docs URLs are often
   version-scoped. Note GA vs preview/beta status.
3. **Locate the canonical home**, then drill to the **specific pages** that answer the request:
   overview/concepts, the how-to/guide, the **API reference**, and the **release notes/changelog**.
4. **Verify every URL at query time** with `web` (open the page; confirm it loads, is first-party, and
   is current). Never paste a link from memory without checking. If a page can't be confirmed, say so.
5. **Summarize what each linked page gives the learner** and flag the publication/"last updated" date.
6. Offer the best **next page** to read and hand off to `concept-explainer` or `research-brief`.

## Output shape
```
Official docs for <technology> (<version>, status: GA/preview)
Canonical home: <title> — <url> [official, updated YYYY-MM-DD]
Most relevant pages:
  • Concepts/overview — <url>
  • How-to / guide for <topic> — <url>
  • API reference — <url>
  • Release notes / changelog — <url>
Version notes: <GA vs preview, breaking changes, LTS>
Start here → <the one page to read first>
Learning Footer
```

## Tips
- One authoritative page beats ten secondary summaries — link the source, not a re-blog.
- Distinguish `latest` from a pinned version; URLs like `/en-us/…` or `/v3/…` matter.
- If official docs are thin, say so explicitly before falling back to reputable secondary sources.
- Respect copyright: summarize and link; don't wholesale-copy doc text. End with the **Learning Footer**.
