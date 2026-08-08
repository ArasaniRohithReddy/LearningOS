---
name: sql-joins-lab
description: "Hands-on lab on SQL joins: INNER, LEFT, RIGHT, and FULL OUTER joins, self-joins, and avoiding fan-out (row multiplication) — learning by writing and running real queries. Use for 'joins lab', 'practice SQL joins', 'INNER vs LEFT JOIN', 'self join', 'why did my join duplicate rows', 'fan-out', or a guided hands-on join exercise. Teaches the mental model, not just syntax."
argument-hint: "The tables to join"
---

# SQL Joins Lab

A guided, hands-on lab on SQL joins — matching rows across tables and choosing which unmatched rows survive
— per the teaching principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`sql-coach`](../sql-coach/SKILL.md) and [`sql-query-explainer`](../sql-query-explainer/SKILL.md).

## When to use

- The learner combines rows across tables and wants the model behind each join type, not copied snippets.
- Rows unexpectedly multiplied or vanished after a join and they need to see exactly why.

## Procedure

1. **Concept first.** A join matches rows by a predicate; the *type* decides which unmatched rows survive:
   INNER keeps only matches, LEFT keeps all left rows (NULLs on the right), RIGHT mirrors it, FULL keeps both
   sides (PostgreSQL docs: *Joined Tables*, postgresql.org).
2. **Setup.** Create small `customers` and `orders` tables — include one customer with no order and one order
   with no customer — so every join type shows a visible difference.
3. **Exercise — the four joins.** Write the same query as INNER/LEFT/RIGHT/FULL and diff the row counts.
   MySQL lacks `FULL OUTER JOIN` — emulate with `LEFT … UNION … RIGHT` (MySQL 8.0 Reference Manual: *JOIN*).
4. **Exercise — self-join.** Join `employees` to itself (aliases `e`/`m`) to pair each employee with a manager.
5. **Exercise — avoid fan-out.** Join one order to many line items; watch `SUM(orders.total)` inflate, then
   fix it by aggregating the many-side in a CTE/subquery **before** joining.
6. **Reference solution sketch.** Show the LEFT join, the self-join with aliases, and the pre-aggregated fix.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Tables: customers 1—* orders   (grain: one row per order)
INNER vs LEFT vs RIGHT vs FULL: row counts …
Self-join: FROM employees e JOIN employees m ON e.mgr_id = m.id
Fan-out fix: pre-aggregate many-side in CTE, then JOIN
Result + Learning Footer
```

## Tips

- Pick the join type by which unmatched rows must survive — default to INNER, widen to LEFT deliberately.
- Fan-out (row multiplication) comes from joining a one-side to a many-side before aggregating — aggregate first.
- MySQL has no `FULL OUTER JOIN`; PostgreSQL does — verify the dialect before you write it.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
