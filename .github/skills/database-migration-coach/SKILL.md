---
name: database-migration-coach
description: "Plan a safe, low/zero-downtime schema or data migration as a lesson — use expand-contract, batched backfills, dual-writes, and feature flags, with a tested rollback for every step. Use for 'migrate this schema', 'zero-downtime migration', 'add/drop a column safely', 'backfill data', 'rename column without downtime', or learning safe migrations."
argument-hint: "The change + database + constraints"
---

# Database Migration Coach

Change a live schema without breaking prod — teach expand-contract with reversible steps, per
[`AGENTS.md`](../../../AGENTS.md). Complements [data-modeling-drill](../data-modeling-drill/SKILL.md).

> **Safety:** never drop or rename a column in the same deploy that stops using it. Expand first,
> contract later, and keep a **tested rollback** for every step.

## When to use

- Altering schema or moving data on a running system with a tight downtime/lock budget.
- Pairs with [sql-coach](../sql-coach/SKILL.md) and [database-index-coach](../database-index-coach/SKILL.md).

## Procedure

1. **Classify the change** — additive (safe) vs destructive (rename/drop/type change). Destructive changes
   need expand-contract; never mutate a column in place on a live table.
2. **Expand** — add the new column/table/index as nullable and backward-compatible; ship code that
   tolerates both old and new shapes.
3. **Backfill** — copy data in throttled, **resumable, idempotent** batches to avoid long locks and
   replication lag.
4. **Dual-write, then switch reads** — write both shapes, verify parity, then flip reads behind a flag.
5. **Contract** — in a *later* deploy, once nothing reads the old shape, drop it.
6. **Rollback plan** — make each step reversible and keep the old shape until fully verified.

## Output shape

```
Change: … | DB: … | constraints (downtime/lock budget) …
Type: additive | destructive → expand-contract
Steps: expand → backfill(batched) → dual-write → switch reads → contract
Backfill: batch size … | throttle … | resumable/idempotent
Rollback: per step … | keep-old-until …
```

## Tips

- Add columns nullable or with a non-rewriting default — know your engine (PostgreSQL 11+ fast default; MySQL online DDL `ALGORITHM=INPLACE`); cite docs with dates.
- Test the **rollback**, not just the forward path, on a prod-sized copy first.
- End with the **Learning Footer** (`AGENTS.md`).
