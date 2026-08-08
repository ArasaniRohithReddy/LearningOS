---
name: azure-cosmosdb-lab
description: "Hands-on Azure lab: model an Azure Cosmos DB for NoSQL container from access patterns — choose a partition key, provision RU/s, pick a consistency level, and favor point reads over cross-partition queries. Use for 'Azure Cosmos DB lab', 'choose a partition key', 'RU/s throughput', 'consistency levels', 'Cosmos access patterns', 'point read vs query', 'Cosmos hands-on lab', or learning NoSQL data modeling on Azure by doing."
argument-hint: "The data + queries"
---

# Azure Cosmos DB Lab

Learn Cosmos DB by modeling from the queries backward — patterns, then key, then throughput — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [serverless-designer](../serverless-designer/SKILL.md) and [cloud-cost-optimizer](../cloud-cost-optimizer/SKILL.md).

## When to use

- The learner wants a guided container they can actually query, not abstract NoSQL theory.
- Reinforcing access-pattern-first design for a **cloud/backend/data** role-agent.

## Mental model

A container is sharded by its **partition key** into logical partitions (≤20 GB each); every operation
costs **Request Units (RU/s)**, and point reads are the cheapest path (Microsoft Learn, *Partitioning in
Azure Cosmos DB*, 2024).

## Procedure

1. **List access patterns first:** write every read/write ("get cart by id", "list orders by user") before
   the schema — this drives the key.
2. **Choose the partition key:** high cardinality + even write spread + present in common filters, so you
   avoid hot partitions and cross-partition fan-out.
3. **Provision throughput:** start with **autoscale** RU/s (or serverless for spiky dev); a 1-KB point read
   is ~1 RU, queries cost more (Microsoft Learn, *Optimize request cost*, 2024).
4. **Pick consistency:** **Session** is the default — per-client read-your-writes; move up to Strong or down
   to Eventual only with a latency/availability reason (Microsoft Learn, *Consistency levels*, 2024).
5. **Query by key, not Scan-style:** prefer point reads (id + partition key) and single-partition queries;
   a cross-partition query is a red flag for the wrong key.
6. ⚠ **Verify & clean up:** run each access pattern and watch the RU charge, then delete the container/
   account — idle RU/s and storage still bill.

## Output shape

```
Data: <entities> | Access patterns: 1 … 2 … 3 …
Partition key: <high-cardinality attr> | Item shape: <attrs>
Throughput: autoscale RU/s (or serverless) | point read ≈1 RU/KB
Consistency: Session (default) → <Strong|Eventual> because …
Access: point read ✓ | cross-partition query avoided
Cleanup: delete container + account  [⚠ stops RU + storage cost]
```

## Tips

- Model the queries first — in Cosmos DB the key serves the access patterns, not normalization.
- A cross-partition query or high RU charge usually means you need a different partition key.
- End with the **Learning Footer** (`AGENTS.md`) — one access pattern to add + one query's RU cost to measure yourself.
