---
name: sql-query-explainer
description: "Explain an unfamiliar or complex SQL query step by step — unpack CTEs, window functions, joins, and subqueries in logical execution order, state what each block returns and why, then summarize the final result set. Use for 'what does this query do', 'explain this SQL', 'read this CTE / window function', 'understand this join', or learning to read SQL."
argument-hint: "The SQL query + engine"
---

# SQL Query Explainer

Make an opaque query *understandable* by narrating its logical order block by block — per the teaching
approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Complements [sql-coach](../sql-coach/SKILL.md).

## When to use

- The learner inherited a dense query (CTEs, windows, nested subqueries) and must know what it returns.
- Reinforcing how SQL is evaluated for **Coding Mentor** or a data role-agent.

## Mental model

- SQL runs in **logical order**, not written order: `FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT
  (window fns) → ORDER BY → LIMIT`. CTEs are named subqueries resolved first; window functions compute
  over a `PARTITION`/frame *after* grouping — which explains most "where did that column come from" moments.

## Procedure

1. **Confirm the engine** — Postgres, MySQL, or SQL Server; CTE materialization and window-frame syntax differ.
2. **Outline the skeleton** — list every CTE and the final `SELECT`; put them in dependency order.
3. **Explain each block** in logical order — rows in → transformation → rows out.
4. **Decode the tricky parts** — join type/keys, window frame (`PARTITION BY`/`ORDER BY`/`ROWS`),
   correlated subqueries, and NULL/`GROUP BY` behavior.
5. **State the result** — columns, the **grain** (one row per …), and a sample row.
6. **Verify if ambiguous** — run `EXPLAIN` or a `LIMIT` sample rather than guessing.

## Output shape

```
Engine: …
CTEs: a → b → main (dependency order)
Block-by-block: <name>: in … → does … → out …
Tricky bits: window PARTITION/frame … | join keys … | NULLs …
Returns: columns … | grain: one row per … | sample row
```

## Tips

- Track the **grain** at each step — most confusion comes from a join or `GROUP BY` silently changing rows-per-thing.
- Run the query (or `EXPLAIN`) on real data before asserting behavior; never claim output you haven't checked.
- Pair with [sql-coach](../sql-coach/SKILL.md) to then fix or speed it up. End with the **Learning Footer** (`AGENTS.md`).
