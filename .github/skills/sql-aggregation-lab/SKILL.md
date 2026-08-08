---
name: sql-aggregation-lab
description: "Hands-on lab on SQL aggregation: GROUP BY, filtering groups with HAVING, and multi-level subtotals with GROUPING SETS, ROLLUP, and CUBE — learning by writing real summary queries. Use for 'aggregation lab', 'practice GROUP BY', 'HAVING vs WHERE', 'subtotals and grand totals', 'ROLLUP/CUBE/GROUPING SETS', or a guided hands-on summary exercise. Teaches the mental model, not just syntax."
argument-hint: "The summary"
---

# SQL Aggregation Lab

A guided, hands-on lab on aggregation — collapsing rows into grouped summaries, subtotals, and grand totals —
per the teaching principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`sql-coach`](../sql-coach/SKILL.md) and [`data-modeling-drill`](../data-modeling-drill/SKILL.md).

## When to use

- The learner needs counts/sums/averages per group, plus subtotals or a grand total.
- Confusion over `WHERE` vs `HAVING`, or `COUNT(*)` vs `COUNT(col)` with NULLs.

## Procedure

1. **Concept first.** `GROUP BY` collapses rows sharing a key into one; aggregates (`SUM/COUNT/AVG`) summarize
   each group; `HAVING` filters **groups** after aggregation, `WHERE` filters **rows** before it (PostgreSQL
   docs: *7.2.3. GROUP BY and HAVING Clauses*).
2. **Setup.** Create `sales(region, product, amount)` with a few regions/products so groups and subtotals are visible.
3. **Exercise — group + having.** `SELECT region, SUM(amount) FROM sales GROUP BY region HAVING SUM(amount) > 100`.
4. **Exercise — WHERE vs HAVING & NULLs.** Contrast `COUNT(*)` (all rows) with `COUNT(amount)` (non-NULL);
   move a predicate from `HAVING` to `WHERE` and note the difference.
5. **Exercise — subtotals.** `GROUP BY ROLLUP(region, product)` for per-product, per-region subtotals, and a
   grand total; label total rows with `GROUPING()` (PostgreSQL docs: *7.2.4. GROUPING SETS, CUBE, ROLLUP*).
6. **Reference solution sketch.** Show `GROUP BY … HAVING` and the `ROLLUP` + `GROUPING()` query side by side.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Table: sales(region, product, amount)
Group: SELECT region, SUM(amount) … GROUP BY region
Filter groups: HAVING SUM(amount) > k        (WHERE filters rows first)
Subtotals: GROUP BY ROLLUP(region, product)  -- + grand total
Label totals: GROUPING(region) = 1
Result + Learning Footer
```

## Tips

- `WHERE` filters rows **before** grouping; `HAVING` filters **after** — pushing predicates to `WHERE` is usually faster.
- Every non-aggregated SELECT column must appear in `GROUP BY` (MySQL enforces this via `ONLY_FULL_GROUP_BY` in 8.0).
- MySQL has `WITH ROLLUP` but no `GROUPING SETS`/`CUBE`; PostgreSQL has all three (since 9.5 / 2016).
- End with the **Learning Footer** (`AGENTS.md`).
