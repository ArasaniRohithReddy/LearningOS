---
name: aws-dynamodb-lab
description: "Hands-on AWS lab: model a DynamoDB table from access patterns — pick partition and sort keys, create the table, add a secondary index, and use Query instead of Scan. Use for 'AWS DynamoDB lab', 'design a DynamoDB table', 'partition and sort keys', 'DynamoDB access patterns', 'query vs scan', 'single-table design', 'DynamoDB hands-on lab', or learning NoSQL data modeling by doing."
argument-hint: "The data + queries"
---

# AWS DynamoDB Lab

Learn DynamoDB by modeling from the queries backward — patterns first, then keys, then indexes — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [serverless-designer](../serverless-designer/SKILL.md) and [aws-well-architected-review](../aws-well-architected-review/SKILL.md).

## When to use

- The learner wants a guided table they can actually query, not abstract NoSQL theory.
- Reinforcing access-pattern-first design for a **cloud/backend/data** role-agent.

## Mental model

DynamoDB is a key-value/document store: the **partition key** spreads items across partitions and the
optional **sort key** orders items within one — so you design keys to answer known queries, not to
normalize (Amazon DynamoDB Developer Guide, *NoSQL design for DynamoDB*).

## Procedure

1. **List access patterns first:** write every read/write the app needs ("get order by id", "list orders
   by user") before touching the schema — this drives everything.
2. **Choose keys:** partition key = high-cardinality id for even spread; sort key enables range queries and
   one-to-many (e.g., `USER#id` / `ORDER#ts`).
3. **Create the table:** start with **on-demand** capacity for the lab; respect the 400 KB item limit and
   avoid hot partitions.
4. **Add a GSI:** cover a second access pattern (e.g., by status) with a global secondary index — project
   only the attributes you read.
5. **Query, don't Scan:** `Query` targets a key and is efficient; `Scan` reads the whole table — fine for
   the lab, a red flag in production.
6. ⚠ **Verify & clean up:** run each access pattern against the table, then delete it — idle tables and
   indexes still cost storage.

## Output shape

```
Data: <entities> | Access patterns: 1 … 2 … 3 …
Keys: PK=<…> SK=<…> | Item shape: <attrs>
Capacity: on-demand (lab) | Item < 400 KB
Index: GSI <name> on <attr> (projected: <attrs>)
Access: Query by key ✓ | Scan avoided (full-table read)
Cleanup: delete table + GSIs  [⚠ stops storage cost]
```

## Tips

- Model the queries first — in DynamoDB the schema serves the access patterns, not the other way round.
- Reaching for Scan or a filter to answer a core query usually means you need a different key or a GSI.
- End with the **Learning Footer** (`AGENTS.md`) — one access pattern to add + one Scan to convert to Query yourself.
