---
name: sql-indexing-lab
description: "Hands-on lab on SQL indexing: create indexes for a query's filters and sorts, read an EXPLAIN plan, and build composite and covering indexes for index-only scans — learning by speeding up a real slow query. Use for 'indexing lab', 'practice creating indexes', 'read an EXPLAIN plan', 'covering index', 'composite index order', 'why is this query slow', or a guided hands-on tuning exercise. Teaches the mental model, not just syntax."
argument-hint: "The slow query"
---

# SQL Indexing Lab

A guided, hands-on lab on indexing — turning a sequential scan into an index scan and reading the plan — per
the teaching principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`database-index-coach`](../database-index-coach/SKILL.md) and [`sql-coach`](../sql-coach/SKILL.md).

## When to use

- The learner has a slow query and wants to design and verify an index, not guess.
- Learning to read `EXPLAIN` and understand composite and covering indexes.

## Procedure

1. **Concept first.** An index is a sorted structure (usually a B-tree) that turns a full scan into a seek; it
   speeds reads but slows writes and uses space (PostgreSQL docs: *11. Indexes*; MySQL 8.0 Reference Manual:
   *Optimization and Indexes*).
2. **Setup.** Create `users(id, email, country, created_at)` and insert enough rows (e.g. `generate_series` in
   Postgres) that a scan is measurably slow.
3. **Exercise — baseline plan.** `EXPLAIN ANALYZE SELECT … WHERE email = ?` and read the Seq Scan cost/rows.
4. **Exercise — single-column index.** `CREATE INDEX ON users(email)`; re-run `EXPLAIN` and confirm an Index
   Scan replaced the Seq Scan.
5. **Exercise — composite + covering.** For `WHERE country = ? ORDER BY created_at`, build `(country,
   created_at)` (equality then range/sort); add included columns for an index-only scan.
6. **Reference solution sketch.** Show the two `CREATE INDEX` statements and the before/after `EXPLAIN` lines.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Query: WHERE email = ? ; WHERE country = ? ORDER BY created_at
Baseline: EXPLAIN ANALYZE → Seq Scan (cost/rows)
Index: CREATE INDEX idx_email ON users(email);
Composite: CREATE INDEX ON users(country, created_at)  -- equality then sort
Covering: … INCLUDE(needed_cols) → Index Only Scan
After: EXPLAIN ANALYZE → Index Scan (faster)
```

## Tips

- Compare `EXPLAIN` before and after on realistic row counts — measure, never guess whether an index helps.
- A function on an indexed column (`WHERE lower(email)=…`) is non-sargable — index the expression instead.
- Composite order matters: equality columns first, then the range/sort column (leftmost-prefix rule).
- End with the **Learning Footer** (`AGENTS.md`); go deeper with [`database-index-coach`](../database-index-coach/SKILL.md).
