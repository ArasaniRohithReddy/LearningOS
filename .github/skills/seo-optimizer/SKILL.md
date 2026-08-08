---
name: seo-optimizer
description: "Improve technical SEO for a site as a lesson — semantic HTML, metadata, structured data, crawlability, sitemaps, and performance's role — measurable and honest about what SEO can't do. Use for 'technical SEO', 'improve SEO', 'meta tags', 'structured data / schema.org', 'sitemap', 'crawlability', 'why isn't my page indexed/ranking', or learning SEO."
argument-hint: "The site/page + goals"
---

# SEO Optimizer

Improve technical SEO honestly and measurably — semantic HTML, metadata, structured data, and
crawlability — teaching what actually moves discoverability and what doesn't, per the source discipline
and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants a page/site to be discoverable and correctly indexed by search engines.
- Diagnosing why pages aren't indexed, ranking, or showing rich results.

## Procedure

1. **Semantic HTML first** — one `<h1>`, logical headings, landmarks, descriptive link text, and `alt`
   on images; structure is read by crawlers and assistive tech alike.
2. **Metadata** — a unique `<title>` and meta description per page, canonical URLs, and Open Graph/Twitter
   cards for sharing (no keyword stuffing).
3. **Structured data** — add schema.org via JSON-LD for eligible rich results; validate with Google's
   Rich Results Test (Google Search Central, 2024).
4. **Crawlability & indexing** — `robots.txt`, `sitemap.xml`, correct `robots`/`noindex`, canonical and
   `hreflang`, and clean internal linking; avoid orphan pages.
5. **Performance & mobile** — Core Web Vitals and mobile-friendliness are ranking signals (delegate to
   [web-perf-audit](../web-perf-audit/SKILL.md)).
6. **Measure** — verify in Search Console (coverage, queries, Core Web Vitals); track before/after
   instead of guessing.

## Output shape

```
Goal: <rank / index / rich result for …>
[High] <issue> — semantics/meta/crawl → fix → why it matters
[Med]  …
Structured data: <type> valid? yes/no
Indexing: robots / sitemap / canonical status
Measure in Search Console: <metric before → after>
```

## Tips

- No trick beats useful content served as clean, crawlable, fast HTML — be honest about SEO's limits.
- Test structured data and mobile-friendliness with Google's official tools before shipping.
- Cite Google Search Central/MDN (dated); end with the **Learning Footer** (`AGENTS.md`).
