---
name: caching-strategy-coach
description: "Design a caching strategy as a lesson — decide what and where to cache (client, CDN, app/Redis, DB), pick a pattern (cache-aside, read-through, write-through, write-behind), set TTLs and eviction, and plan invalidation — with the consistency trade-offs behind each choice. Use for 'add caching', 'speed up reads', 'cache invalidation', 'Redis/CDN strategy', or learning how caches really work."
argument-hint: "The system + read/write pattern"
---

# Caching Strategy Coach

Design a cache from first principles so the learner reasons about staleness and cost, not just speed —
per [`AGENTS.md`](../../../AGENTS.md). Complements [system-design-drill](../system-design-drill/SKILL.md).

## When to use

- Reads are slow or expensive and the learner wants to decide *what*, *where*, and *how* to cache.
- Pairs with [api-design-review](../api-design-review/SKILL.md) and [complexity-analyzer](../complexity-analyzer/SKILL.md).

## Procedure

1. **Map the access pattern** — read/write ratio, hot keys, and the **staleness budget** (how stale is
   OK?). No cache decision is valid without this; caching only helps read-heavy, tolerant data.
2. **Pick the layer(s)** — client → CDN → app (in-process / Redis) → DB buffer. Cache closest to the
   reader that still meets the staleness budget.
3. **Choose a pattern** and name its trade-off:

   | Pattern | Who writes cache | Trade-off |
   |---|---|---|
   | Cache-aside (lazy) | app on miss | simple; first read is slow, can go stale |
   | Read-through | cache lib | clean reads; couples to cache |
   | Write-through | on every write | fresh; slower writes |
   | Write-behind | async flush | fast writes; risk of loss |
4. **Bound it** — max size, eviction (LRU/LFU), and TTL derived from the staleness budget.
5. **Plan invalidation** (the hard part) — TTL vs. explicit purge vs. versioned keys; defend against
   **stampede** (locks, request coalescing, TTL jitter) and cold-start.
6. **State consistency trade-offs** — stale reads, cache↔DB divergence, and how you detect them.

## Output shape

```
Access pattern: R/W … | hot keys … | staleness budget …
Layers: client/CDN/app/DB → chosen … (why)
Pattern: cache-aside/… | TTL … | eviction …
Invalidation: … | stampede defense …
Consistency risk: … | how detected …
```

## Tips

- Cite Redis / CDN docs (e.g., Cache-Control, RFC 9111) with dates; never invent eviction behavior.
- "There are only two hard things… cache invalidation" — make TTL and purge explicit, never implicit.
- End with the **Learning Footer** (`AGENTS.md`).
