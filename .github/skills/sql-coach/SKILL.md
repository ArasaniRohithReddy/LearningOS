---
name: sql-coach
description: "Improve SQL as a lesson — read the query, explain what it actually does, fix correctness (joins, NULLs, grouping), then optimize with indexes, sargable predicates, and execution-plan thinking, explaining every trade-off. Use for 'optimize this query', 'why is this slow', 'is this SQL correct', 'help with a JOIN', or learning SQL."
argument-hint: "A query or a data question + engine (Postgres/MySQL/SQL Server)"
---

# SQL Coach

Teach SQL by reading intent, fixing correctness, then making it fast — explaining the planner's view,
per the teaching approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has a query that's wrong, slow, or hard to read — and wants to understand why.
- A data question needs a query built from scratch with the reasoning shown.

## Mental model

- SQL is **declarative**: you state *what*, the planner picks *how*. Rows flow in logical order —
  `FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT` — which explains most surprises
  (why a `SELECT` alias isn't visible in `WHERE`, or `COUNT(*)` vs `COUNT(col)` with NULLs).

## Procedure

1. **Confirm engine & goal**: Postgres, MySQL, or SQL Server — dialect and plan tools differ.
2. **Explain the query**: narrate what it returns and why, in that logical order.
3. **Fix correctness first**: join type/keys, NULL handling, `GROUP BY` completeness, duplicates,
   implicit conversions. A fast wrong answer is still wrong.
4. **Read the plan**: `EXPLAIN ANALYZE` (Postgres, MySQL 8) or the actual execution plan (SQL Server) —
   find the costly scan, sort, or nested loop.
5. **Optimize with trade-offs**: make predicates sargable (no functions on indexed columns), add the
   right index, or rewrite; state each index's cost (write overhead, storage).

## Output shape

```
Engine: … | Goal: …
What it does: <plain-English, logical order>
Correctness: <issue → fix>
Plan hotspot: <seq scan / sort / nested loop>
Optimization: <index/rewrite> — trade-off: <write cost/storage>
Final query: …
```

## Tips

- Read a real `EXPLAIN` before claiming a cause; never guess the plan or invent index syntax.
- Prefer set-based rewrites over row-by-row logic; keep predicates sargable. Pair with `complexity-analyzer`.
- End with the **Learning Footer** (`AGENTS.md`) — the planner insight to keep + a query to tune yourself.
