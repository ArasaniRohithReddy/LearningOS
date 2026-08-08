---
name: sql-window-functions-lab
description: "Hands-on lab on SQL window functions: OVER and PARTITION BY, ranking (ROW_NUMBER/RANK/DENSE_RANK), running totals, and LAG/LEAD — learning by writing real analytic queries. Use for 'window functions lab', 'practice OVER/PARTITION BY', 'running total in SQL', 'rank rows per group', 'LAG/LEAD', 'top-N per group', or a guided hands-on analytics exercise. Teaches the mental model, not just syntax."
argument-hint: "The analytic query"
---

# SQL Window Functions Lab

A guided, hands-on lab on window functions — computing across related rows *without collapsing them* — per
the teaching principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`sql-query-explainer`](../sql-query-explainer/SKILL.md) and [`sql-coach`](../sql-coach/SKILL.md).

## When to use

- The learner needs per-row analytics (ranks, running totals, deltas) but must keep every row.
- `GROUP BY` collapsed rows they actually wanted to keep alongside the aggregate.

## Procedure

1. **Concept first.** A window function computes over a *frame* of rows related to the current row **without
   collapsing them** — unlike `GROUP BY`. Form: `func() OVER (PARTITION BY … ORDER BY … frame)` (PostgreSQL
   docs: *3.5. Window Functions*, in PostgreSQL since 8.4 / 2009).
2. **Setup.** Create `sales(region, day, amount)` with a couple of regions and several days so partitions
   and ordering matter.
3. **Exercise — ranking.** Compare `ROW_NUMBER`, `RANK`, `DENSE_RANK` `OVER (PARTITION BY region ORDER BY
   amount DESC)`; observe how each handles ties.
4. **Exercise — running total.** `SUM(amount) OVER (PARTITION BY region ORDER BY day ROWS UNBOUNDED
   PRECEDING)`; change the frame and watch the total change.
5. **Exercise — LAG/LEAD.** Compute a day-over-day delta: `amount - LAG(amount) OVER (PARTITION BY region
   ORDER BY day)`.
6. **Reference solution sketch.** Show ranking, running total, and the LAG delta in one SELECT (MySQL added
   window functions in 8.0 / 2018).
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Table: sales(region, day, amount)
Rank: ROW_NUMBER()/RANK()/DENSE_RANK() OVER (PARTITION BY region ORDER BY amount DESC)
Running total: SUM(amount) OVER (PARTITION BY region ORDER BY day ROWS UNBOUNDED PRECEDING)
Delta: amount - LAG(amount) OVER (…)
Top-N per group: filter WHERE rn <= N in an outer query/CTE
Result + Learning Footer
```

## Tips

- Window functions run **after** `WHERE`/`GROUP BY` — filter a window result in an outer query or CTE, not `WHERE`.
- With `ORDER BY` the default frame is `RANGE … UNBOUNDED PRECEDING` — set `ROWS` explicitly for predictable running totals.
- Ties: `RANK` skips numbers, `DENSE_RANK` doesn't, `ROW_NUMBER` is arbitrary among equals — pick deliberately.
- End with the **Learning Footer** (`AGENTS.md`).
