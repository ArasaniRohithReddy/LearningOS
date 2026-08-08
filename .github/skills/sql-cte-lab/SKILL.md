---
name: sql-cte-lab
description: "Hands-on lab on SQL CTEs: the WITH clause, chaining multiple CTEs, and recursive CTEs (WITH RECURSIVE) for hierarchies and graphs — learning by building a complex query in readable steps. Use for 'CTE lab', 'practice WITH clause', 'recursive CTE', 'walk a tree/hierarchy in SQL', 'chain CTEs', 'refactor a nested subquery', or a guided hands-on query exercise. Teaches the mental model, not just syntax."
argument-hint: "The complex query"
---

# SQL CTE Lab

A guided, hands-on lab on common table expressions — naming subqueries to build a complex query in readable,
testable steps — per the teaching principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`sql-query-explainer`](../sql-query-explainer/SKILL.md) and [`sql-coach`](../sql-coach/SKILL.md).

## When to use

- The learner has a deeply nested query and wants to decompose it into named, testable steps.
- A hierarchy or graph (org chart, category tree, bill of materials) needs traversal.

## Procedure

1. **Concept first.** A CTE (`WITH name AS (…)`) is a named subquery scoped to one statement; it improves
   readability and enables recursion (PostgreSQL docs: *7.8. WITH Queries (CTEs)*, postgresql.org).
2. **Setup.** Create a self-referencing `employees(id, name, manager_id)` (a small tree) and a `sales` table
   for the chaining exercise.
3. **Exercise — chain.** Build `WITH monthly AS (…), ranked AS (SELECT … FROM monthly) SELECT … FROM ranked`;
   each CTE consumes the previous one.
4. **Exercise — recursive.** Write `WITH RECURSIVE tree AS (<anchor: top manager> UNION ALL <recursive: join
   employees to tree>)` to walk the org chart, carrying a depth level.
5. **Exercise — refactor.** Take a two-level nested subquery and flatten it into chained CTEs; compare readability.
6. **Reference solution sketch.** Show the chained CTE and the recursive CTE with anchor + recursive terms labeled.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
WITH a AS (…),                 -- step 1
     b AS (SELECT … FROM a)    -- step 2 consumes step 1
SELECT … FROM b;
Recursive:
  WITH RECURSIVE tree AS (
    <anchor: roots>
    UNION ALL
    <recursive: child JOIN tree>
  ) SELECT * FROM tree;
Result + Learning Footer
```

## Tips

- Every recursive CTE needs an **anchor** term + `UNION ALL` + a **recursive** term that eventually stops — or it loops forever.
- CTEs and `WITH RECURSIVE` arrived in MySQL 8.0 (2018); PostgreSQL has had them since 8.4 (2009) — check your engine.
- Postgres may materialize a CTE (an optimization fence); use `MATERIALIZED`/`NOT MATERIALIZED` to control it.
- End with the **Learning Footer** (`AGENTS.md`).
