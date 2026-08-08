---
name: database-index-coach
description: "Design database indexes as a lesson — read the query first, judge selectivity, choose the type (B-tree, hash, composite, partial, covering), order composite columns, verify with EXPLAIN, and weigh the write/space cost. Use for 'why is this query slow', 'what index do I need', 'B-tree vs hash', 'covering index', 'composite index order', or learning how indexes work."
argument-hint: "The queries + schema + engine"
---

# Database Index Coach

Design indexes from the query outward so the learner understands the cost, not just the speedup — per
[`AGENTS.md`](../../../AGENTS.md). Complements [sql-coach](../sql-coach/SKILL.md) and [data-modeling-drill](../data-modeling-drill/SKILL.md).

## When to use

- A query is slow, or the learner is choosing indexes for known access patterns.
- Pairs with [complexity-analyzer](../complexity-analyzer/SKILL.md) and [system-design-drill](../system-design-drill/SKILL.md).

## Procedure

1. **Read the queries first** — the `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY` columns are the index
   candidates. Never index blind; index the workload.
2. **Judge selectivity** — high-cardinality columns filter well; low-cardinality ones (booleans, status)
   rarely earn an index on their own.
3. **Choose the type** and name its use:

   | Type | Best for |
   |---|---|
   | B-tree | ranges, sorting, equality (the default) |
   | Hash | equality only |
   | Composite | multi-column filters (leftmost-prefix rule) |
   | Partial | a hot subset of rows |
   | Covering | index-only scans (all needed columns) |
4. **Order composite columns** — equality columns before range columns; match `ORDER BY` to skip a sort.
5. **Verify with the planner** — run `EXPLAIN` / `EXPLAIN ANALYZE`; confirm the index is used and no
   sequential scan remains.
6. **Weigh the cost** — every index slows writes and consumes space; drop unused and duplicate indexes.

## Output shape

```
Query: filters … | sort … | join …
Selectivity: col → high/low
Index: CREATE INDEX … (type, column order) — why
EXPLAIN: seq scan → index scan? sort removed?
Cost: write/space impact | drop: …
```

## Tips

- Cite the engine's docs (PostgreSQL, MySQL/InnoDB) with dates — index behavior differs per engine.
- Measure with `EXPLAIN` on real data volumes; never guess whether an index helps.
- End with the **Learning Footer** (`AGENTS.md`).
