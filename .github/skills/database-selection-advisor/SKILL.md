---
name: database-selection-advisor
description: "Choose the right database as a lesson — match the workload (access patterns, consistency, scale) to relational vs document vs key-value vs wide-column vs graph vs time-series, weighing CAP, latency, and operational cost. Use for 'which database should I use', 'SQL vs NoSQL', 'Postgres vs Mongo vs DynamoDB', 'graph vs relational', 'time-series database', or learning how to pick a datastore."
argument-hint: "The use case + access patterns"
---

# Database Selection Advisor

Pick a datastore from the workload outward so the learner reasons about fit and cost, not hype — per
[`AGENTS.md`](../../../AGENTS.md). Complements [data-modeling-drill](../data-modeling-drill/SKILL.md) and [nosql-data-modeling](../nosql-data-modeling/SKILL.md).

## When to use

- Starting a system, or a current store strains under its access pattern, consistency, or scale.
- Pairs with [system-design-drill](../system-design-drill/SKILL.md) and [caching-strategy-coach](../caching-strategy-coach/SKILL.md).

## Database families (match, don't default)

| Family | Best for | Example |
|---|---|---|
| Relational | joins, ad-hoc queries, ACID | PostgreSQL, MySQL |
| Document | nested/flexible docs, per-doc reads | MongoDB |
| Key-value | fast lookups by key, caching | Redis, DynamoDB |
| Wide-column | huge write volume, known queries | Cassandra, Bigtable |
| Graph | deep relationship traversal | Neo4j |
| Time-series | append-only metrics/events | TimescaleDB, InfluxDB |

## Procedure

1. **Enumerate access patterns** — the exact queries, read/write ratio, latency and consistency needs.
   Choose for the workload, not the buzzword.
2. **Decide consistency vs availability** — do you need ACID transactions, or is eventual OK? CAP/PACELC
   says you can't keep both C and A during a partition.
3. **Estimate scale & shape** — volume, growth, relationship depth, cardinality.
4. **Match to a family** (table) and name the runner-up.
5. **Weigh operational cost** — managed vs self-hosted, team skills, and the migration path out.
6. **Validate** — prototype the hardest query; a bad fit surfaces there first.

## Output shape

```
Access patterns: queries … | R/W … | latency/consistency …
Scale: volume/growth … | relationships …
Consistency: ACID needed? | CAP lean: C vs A
Choice: <family + engine> (why) | runner-up: …
Ops cost / migration: …
```

## Tips

- Most apps start well on a relational engine (Postgres); reach for a specialized store only when a pattern demands it.
- Cite PostgreSQL, MongoDB, and DynamoDB docs with dates; never invent a guarantee an engine doesn't offer.
- End with the **Learning Footer** (`AGENTS.md`).
