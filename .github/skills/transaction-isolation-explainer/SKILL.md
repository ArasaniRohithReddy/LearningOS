---
name: transaction-isolation-explainer
description: "Explain ACID and SQL isolation levels as a lesson — walk read-uncommitted → read-committed → repeatable-read → serializable and the anomalies each prevents (dirty, non-repeatable, phantom, lost update, write skew), with concrete interleaved examples. Use for 'what isolation level do I need', 'explain dirty/phantom reads', 'serializable vs repeatable read', 'MVCC vs locking', or learning ACID."
argument-hint: "The scenario or level to understand"
---

# Transaction Isolation Explainer

Make isolation concrete by interleaving two transactions and showing the anomaly — per the teaching
approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Complements [sql-coach](../sql-coach/SKILL.md).

## When to use

- The learner must pick a level, or decode a race (double-spend, lost update) under concurrency.
- Pairs with [database-index-coach](../database-index-coach/SKILL.md) and [system-design-drill](../system-design-drill/SKILL.md).

## ANSI levels vs anomalies

| Level | Dirty read | Non-repeatable | Phantom |
|---|---|---|---|
| Read uncommitted | possible | possible | possible |
| Read committed | prevented | possible | possible |
| Repeatable read | prevented | prevented | possible* |
| Serializable | prevented | prevented | prevented |

\*ANSI allows phantoms at RR; PostgreSQL (snapshot) and MySQL/InnoDB (gap locks) prevent most — engine ≠ standard.

## Procedure

1. **Anchor ACID** — Atomicity, Consistency, Isolation, Durability; isolation is the dial with trade-offs.
2. **Name the anomaly at risk** — dirty, non-repeatable, phantom, lost update, or write skew.
3. **Show it concretely** — a T1/T2 timeline that exhibits the anomaly.
4. **Pick the lowest level that prevents it** — stronger means more locking/aborts and less concurrency.
5. **Note the engine's reality** — PostgreSQL MVCC/SSI vs MySQL InnoDB gap locks, citing docs with dates.

## Output shape

```
Scenario: … | anomaly at risk: dirty/non-repeatable/phantom/write-skew
Timeline:
  T1: BEGIN … ; T2: BEGIN … → anomaly shown
Level needed: read-committed/…/serializable (why)
Engine note: Postgres/MySQL actual behavior + docs date
Trade-off: concurrency ↓ | abort-retry ↑
```

## Tips

- Cite the ANSI SQL standard and engine docs (PostgreSQL "Transaction Isolation", MySQL InnoDB) with dates; ANSI names ≠ engine behavior.
- Serializable is safest but costs concurrency — expect and **retry** serialization failures instead of ignoring them.
- End with the **Learning Footer** (`AGENTS.md`).
