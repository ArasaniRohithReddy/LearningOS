---
name: cdc-pipeline-coach
description: "Design a change-data-capture (CDC) pipeline as a lesson — log-based capture (Debezium), initial snapshots, event ordering, schema drift, and sinks/upserts — with explicit trade-offs. Use for 'change data capture', 'Debezium / logical replication', 'stream database changes', 'CDC vs polling', 'handle schema drift', or learning to replicate an OLTP database into a warehouse/lakehouse."
argument-hint: "The source DB + target"
---

# CDC Pipeline Coach

Design CDC the reviewed way — capture → snapshot → order → drift → sink —
following the teaching approach in [`AGENTS.md`](../../../AGENTS.md). Feeds the incremental ingestion in
[`data-pipeline-designer`](../data-pipeline-designer/SKILL.md) and [`streaming-pipeline-designer`](../streaming-pipeline-designer/SKILL.md); publish the schema via [`data-contract-designer`](../data-contract-designer/SKILL.md).

## When to use

- The learner needs near-real-time replication of an OLTP DB into a warehouse/lakehouse.
- Choosing how to capture changes and keep the target consistent through updates and deletes.

## Capture methods (pick the source of truth)

| Method | Reads | Trade-off |
| --- | --- | --- |
| Log-based | WAL/binlog (Debezium) | low load, catches deletes; needs log access |
| Query-based | polling a timestamp column | simple; misses deletes + hard deletes |
| Trigger-based | DB triggers write audit rows | exact; write overhead on source |

## Procedure

1. **Confirm** source engine (Postgres/MySQL/SQL Server), target, and freshness SLA.
2. **Capture from the log** where possible — Debezium reads the WAL/binlog (Debezium *Connectors* docs).
3. **Snapshot first** — take a consistent initial load, then stream incremental changes without gaps.
4. **Preserve ordering** — key events by primary key onto a partition so per-row order holds; track LSN/SCN.
5. **Handle schema drift** — route changes through a schema registry/contract; decide add vs. breaking change.
6. **Sink with upserts** — `MERGE` on the key; apply deletes (soft vs. hard) idempotently for safe replays.

## Output shape

```
Source → target | freshness SLA: …
Capture: log-based (Debezium) | query | trigger (why)
Snapshot: initial load → stream (no gap)
Ordering: key by PK, partition, LSN/SCN cursor
Schema drift: registry/contract, add vs. breaking
Flow: DB → WAL → Debezium → Kafka → sink (MERGE)
Sink: upsert on <key>, deletes = soft|hard
```

## Tips

- Log-based CDC is cheapest on the source and the only method that reliably catches deletes.
- Make sinks idempotent (MERGE + dedupe on offset) so redelivery never double-applies.
- End with the **Learning Footer** (`AGENTS.md`).
