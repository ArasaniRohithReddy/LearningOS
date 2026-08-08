---
name: api-pagination-coach
description: "Design list endpoints as a lesson — offset/limit vs cursor/keyset pagination, stable total ordering, filtering and sorting, page-size limits, and total-count trade-offs. Use for 'paginate this endpoint', 'offset vs cursor pagination', 'keyset pagination', 'stable ordering', 'filter and sort API', or learning list-API ergonomics."
argument-hint: "The list endpoint"
---

# API Pagination Coach

Teach paging, filtering, and sorting so the learner picks a strategy that stays correct and fast at scale
— per [`AGENTS.md`](../../../AGENTS.md). Complements [api-design-review](../api-design-review/SKILL.md).

## When to use

- A collection endpoint returns too many rows, or offset paging drifts/duplicates as data changes.
- Pairs with [database-index-coach](../database-index-coach/SKILL.md) and [graphql-schema-coach](../graphql-schema-coach/SKILL.md).

## Procedure

1. **Clarify access** — dataset size, mutation rate, "jump to page N" vs infinite scroll, and the required
   sort. These decide offset vs cursor.
2. **Offset/limit** — simple and random-access, but skip cost grows with depth and inserts cause drift
   (skipped/duplicated rows). Fine for small, bounded lists.
3. **Cursor/keyset** — encode the last-seen sort key(s) in an opaque cursor and query `WHERE (key) > cursor`;
   O(1)-ish with a matching index, stable under inserts (Winand, use-the-index-luke, keyset pagination).
4. **Guarantee a total order** — always break ties with a unique column (e.g., `ORDER BY created_at, id`);
   an unstable sort makes any cursor skip or repeat rows.
5. **Design filtering & sorting** — whitelist filterable/sortable fields, set a default and max page size,
   and treat expensive total counts as optional (or approximate).
6. **Shape the response** — return `data` plus a `next_cursor`/`Link` header (RFC 8288); keep cursors opaque
   and don't leak internal ids.

## Output shape

```
Access: size … mutation … jump-to-page? … sort …
Strategy: offset | cursor/keyset (why)
Order: ORDER BY <sort>, <unique-tiebreak>
Page size: default … max … | total count: exact/approx/none
Response: { data:[…], next_cursor:"…" }  (Link: rel="next")
```

## Tips

- Cite RFC 8288 (2017) and keyset-pagination references with dates; never paginate on a non-unique sort alone.
- Deep offsets are a scaling trap — switch to keyset once "page 500" gets slow.
- End with the **Learning Footer** (`AGENTS.md`).
