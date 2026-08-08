---
name: sharding-strategy-coach
description: "Design database sharding/partitioning as a lesson — choose a shard key, compare hash vs range vs directory, plan rebalancing and hot-spot avoidance, handle cross-shard queries and transactions, and weigh the operational cost. Use for 'shard this database', 'partition key choice', 'hash vs range sharding', 'hot partition', 'cross-shard join', or learning to scale writes horizontally."
argument-hint: "The dataset + growth + access"
---

# Sharding Strategy Coach

Shard only when one node truly can't cope, and pick the key that matches the reads — teach the cost, not
just the scale-out, per [`AGENTS.md`](../../../AGENTS.md). Complements [database-index-coach](../database-index-coach/SKILL.md) and [system-design-drill](../system-design-drill/SKILL.md).

## When to use

- Writes or data volume exceed a single node after vertical scaling, replicas, and caching are exhausted.
- Pairs with [nosql-data-modeling](../nosql-data-modeling/SKILL.md) and [caching-strategy-coach](../caching-strategy-coach/SKILL.md).

## Scheme comparison

| Scheme | Even spread | Range scans | Rebalance |
|---|---|---|---|
| Hash | good | poor (scatter-gather) | hard (resharding) |
| Range | uneven (hot spots) | good | easy (split ranges) |
| Directory/lookup | flexible | depends | flexible (extra hop) |

## Procedure

1. **Confirm you need it** — sharding adds permanent complexity; first exhaust vertical scaling, read
   replicas, and caching.
2. **Choose the shard key** — high cardinality, even distribution, and present in most queries; a wrong key
   causes a hot shard or scatter-gather across all shards.
3. **Pick a scheme** — hash (even, no ranges), range (range scans, hot-spot risk), or directory (flexible, extra lookup).
4. **Plan rebalancing** — consistent hashing / virtual buckets so adding a node moves minimal data.
5. **Handle cross-shard** — avoid cross-shard joins and transactions; denormalize or coordinate, knowing you
   pay latency and lose single-node atomicity.
6. **Operate it** — backups, schema changes, and monitoring multiply per shard; watch skew continuously.

## Output shape

```
Need check: vertical/replica/cache exhausted? → shard
Shard key: … (cardinality/even/in-queries) | anti: hot spot from …
Scheme: hash/range/directory (why)
Rebalance: consistent-hash / virtual buckets
Cross-shard: query/txn plan | cost: latency / no-atomicity
Ops: backup×N, schema×N, skew monitor
```

## Tips

- Cite MongoDB, Citus, Vitess, or DynamoDB partition docs with dates; a poor shard key is very costly to change later.
- Prefer a key that colocates data you read together, and measure shard skew continuously.
- End with the **Learning Footer** (`AGENTS.md`).
