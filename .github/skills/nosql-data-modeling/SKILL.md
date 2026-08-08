---
name: nosql-data-modeling
description: "Model data for NoSQL as a lesson — design access-pattern-first for document, key-value, and wide-column stores, denormalize deliberately, and apply single-table (DynamoDB) patterns, weighing the trade-offs vs relational normalization. Use for 'model this in DynamoDB/Mongo/Cassandra', 'single-table design', 'partition/sort key', 'embed vs reference', 'denormalize', or learning NoSQL modeling."
argument-hint: "The app + queries + store"
---

# NoSQL Data Modeling

Model NoSQL from the *queries*, not the entities, so the learner owns the denormalization trade-offs —
per [`AGENTS.md`](../../../AGENTS.md). Complements [data-modeling-drill](../data-modeling-drill/SKILL.md) and [database-selection-advisor](../database-selection-advisor/SKILL.md).

## When to use

- Designing for a document, key-value, or wide-column store where joins aren't the tool.
- Pairs with [database-index-coach](../database-index-coach/SKILL.md) and [caching-strategy-coach](../caching-strategy-coach/SKILL.md).

## Relational vs NoSQL (know the shift)

| | Relational (3NF) | NoSQL |
| --- | --- | --- |
| Model from | entities & relations | access patterns |
| Reads | join at query time | pre-joined / duplicated |
| Trade-off | flexible queries, slower reads | fast known reads, write-time fan-out |

## Procedure

1. **List every access pattern first** — the exact reads and writes. In NoSQL you model the queries; a new
   query often means a new table or index, not a JOIN.
2. **Pick the key model** — document (embed vs reference), key-value, or wide-column (partition + clustering key).
3. **Choose partition/sort keys** for even distribution and range reads; avoid hot partitions.
4. **Denormalize deliberately** — duplicate/embed to serve a read in one hit; accept the update anomaly.
5. **Single-table (DynamoDB)** — overload PK/SK plus GSIs and item collections to serve many patterns from one table.
6. **Plan consistency & upkeep** — eventual vs strong reads, and how each duplicated copy stays in sync.

## Output shape

```
Access patterns: read … write … (list each)
Store: document/kv/wide-column (why)
Keys: PK=… SK=… | GSIs: … (pattern each serves)
Denormalization: embed/duplicate … → trade-off (fan-out/anomaly)
Consistency: eventual/strong | sync strategy …
```

## Tips

- Cite DynamoDB, MongoDB, and Cassandra docs with dates; don't assume relational features (joins, multi-item ACID) exist.
- Duplicated data is normal here — **own the update path** for every copy you create.
- End with the **Learning Footer** (`AGENTS.md`).
