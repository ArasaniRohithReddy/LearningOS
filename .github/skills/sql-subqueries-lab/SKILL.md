---
name: sql-subqueries-lab
description: "Hands-on lab on SQL subqueries: scalar subqueries, correlated subqueries, EXISTS vs IN, and when a JOIN is clearer or faster — learning by writing and rewriting real nested queries. Use for 'subqueries lab', 'practice EXISTS/IN', 'correlated subquery', 'scalar subquery', 'subquery vs join', 'NOT IN with NULLs', or a guided hands-on nested-query exercise. Teaches the mental model, not just syntax."
argument-hint: "The nested query"
---

# SQL Subqueries Lab

A guided, hands-on lab on subqueries — queries nested inside queries, and when a join beats them — per the
teaching principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`sql-query-explainer`](../sql-query-explainer/SKILL.md) and [`sql-coach`](../sql-coach/SKILL.md).

## When to use

- The learner nests a query and wants to know if it's correct and whether a JOIN is better.
- Choosing `EXISTS` vs `IN`, or a surprising `NOT IN` result caused by NULLs.

## Procedure

1. **Concept first.** A subquery is a query inside another statement: **scalar** returns one value, a
   **table/row** subquery feeds `IN`/`EXISTS`/`FROM`, and a **correlated** one references the outer row so it
   re-evaluates per row (PostgreSQL docs: *9.24. Subquery Expressions*).
2. **Setup.** Create `customers` and `orders` (some customers with no orders) so `EXISTS`/`IN` differences show.
3. **Exercise — scalar.** Add a scalar subquery in SELECT: each customer's `(SELECT MAX(order_date) FROM
   orders o WHERE o.cust_id = c.id)`.
4. **Exercise — EXISTS vs IN.** Find customers with orders via `WHERE EXISTS (…)` and via `WHERE id IN (SELECT
   cust_id …)`; then try `NOT IN` and watch a NULL swallow every row.
5. **Exercise — rewrite as join.** Convert the `IN` into an `INNER JOIN` (+ `DISTINCT`) and compare readability
   and the plan.
6. **Reference solution sketch.** Show the scalar subquery, the `EXISTS` query, and the JOIN rewrite side by side.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Tables: customers 1—* orders
Scalar: SELECT c.*, (SELECT MAX(order_date) FROM orders o WHERE o.cust_id=c.id)
Membership: WHERE EXISTS (SELECT 1 FROM orders o WHERE o.cust_id=c.id)
vs JOIN: FROM customers c JOIN orders o ON o.cust_id=c.id  (DISTINCT)
Gotcha: NOT IN (… NULL …) → zero rows
Result + Learning Footer
```

## Tips

- `NOT IN` with a NULL in the subquery returns no rows — prefer `NOT EXISTS`, which is NULL-safe.
- Correlated subqueries re-run per outer row; a JOIN or one aggregated subquery is often faster.
- Modern planners often rewrite `EXISTS`/`IN` into semi-joins — verify with `EXPLAIN` rather than assuming.
- End with the **Learning Footer** (`AGENTS.md`).
