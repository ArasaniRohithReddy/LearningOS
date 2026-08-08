---
name: kafka-streams-lab
description: "Hands-on Kafka Streams lab: build a topology — KStream vs KTable, stateless ops (map/filter) vs stateful (aggregate/join with state stores), and windowing (tumbling/hopping/session). Use for 'Kafka Streams lab', 'the stream processing', 'KStream KTable', 'stateless vs stateful', 'windowed aggregation', 'Kafka Streams hands-on lab', or learning stream processing by doing."
argument-hint: "The stream processing"
---

# Kafka Streams Lab

Learn Kafka Streams by building a topology yourself — model data as a stream or table, then add stateless
and stateful operators — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [streaming-pipeline-designer](../streaming-pipeline-designer/SKILL.md) and [data-pipeline-designer](../data-pipeline-designer/SKILL.md).

## When to use

- The learner wants Kafka-to-Kafka processing (transform, aggregate, join) without a separate cluster.
- Reinforcing the stream↔table duality and when state (and windows) are needed.

## Mental model

A **KStream** is an unbounded record stream (each event independent); a **KTable** is a changelog — the
latest value per key. Stateless ops need no store; aggregations/joins keep state and windows bound it.

## Procedure

1. **Set up:** a `docker compose` broker with input topic `clicks` and output topic `counts`; add the
   `kafka-streams` dependency and a unique `application.id`.
2. **Build a topology:** `StreamsBuilder` → `builder.stream("clicks")`; add stateless `filter`/`mapValues`
   and write with `.to("counts")` — Apache Kafka docs, *Streams DSL*, kafka.apache.org, 2024.
3. **Go stateful:** `groupByKey().count()` materializes a **KTable** backed by a state store (and a changelog
   topic for fault tolerance) — see the stream↔table duality in action.
4. **Add a window:** wrap the aggregation in a tumbling/hopping/session window so counts reset per interval
   (Kafka Streams *Windowing*); note late records need a grace period.
5. **Run & verify:** start the app, produce clicks, and read `counts` — confirm per-key, per-window totals.
6. **Clean up:** stop the app, then `docker compose down` (reset state via `kafka-streams-application-reset.sh`).

## Output shape

```
application.id: <unique> | In: clicks → Out: counts
Model: KStream (events) | KTable (latest-per-key changelog)
Stateless: filter/mapValues | Stateful: groupByKey().count() + store
Window: tumbling | hopping | session (+ grace for late data)
Verify: produce → read counts (per key/window) | Cleanup: down + reset
```

## Tips

- Reach for a KTable when you want the *current* value per key; a KStream when every event matters.
- Stateful ops create changelog + repartition topics — size the cluster and set `application.id` deliberately.
- End with the **Learning Footer** (`AGENTS.md`) — one op to move stateless→stateful + one window to size yourself.
