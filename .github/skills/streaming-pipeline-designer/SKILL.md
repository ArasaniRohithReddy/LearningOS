---
name: streaming-pipeline-designer
description: "Design a real-time streaming pipeline as a lesson — event sources (Kafka), stream processing, windowing (tumbling/sliding/session), event-time vs. processing-time, exactly-once delivery, schema evolution, and backpressure — with batch-vs-stream trade-offs. Use for 'design a streaming pipeline', 'Kafka architecture', 'real-time processing', 'windowing/watermarks', 'exactly-once', or learning stream processing."
argument-hint: "The event source + latency needs"
---

# Streaming Pipeline Designer

Design a low-latency pipeline — sources → processing → windowing → delivery guarantees — and know when *not* to,
following the teaching approach in [`AGENTS.md`](../../../AGENTS.md). Contrast with [`data-pipeline-designer`](../data-pipeline-designer/SKILL.md).

## When to use

- The learner needs sub-minute results (fraud, alerting, live metrics), not a scheduled batch.
- Reasoning about windowing, exactly-once, schema evolution, and backpressure.

## Batch vs. stream (justify first)

| | Batch | Stream |
| --- | --- | --- |
| Latency | minutes–hours | milliseconds–seconds |
| Model | bounded reruns | unbounded, stateful |
| Trade-off | simple, cheap, easy replay | complexity, always-on cost |

## Procedure

1. **Justify streaming**: if minutes are fine, use `data-pipeline-designer` — streaming adds real cost/complexity.
2. **Event log**: Kafka topics + partitions (ordering is per-partition/key) and retention for replay.
3. **Processing**: stateless (map/filter) vs. stateful (aggregations/joins) — Kafka Streams, Flink, or Spark Structured Streaming.
4. **Windowing**: tumbling/sliding/session; prefer **event-time** with **watermarks** for late data
   (Akidau et al., *Streaming Systems*, O'Reilly, 2018).
5. **Delivery guarantee**: at-most / at-least / exactly-once. Kafka EOS = idempotent producer + transactions
   (Apache Kafka 0.11, 2017) — and it must extend to the sink.
6. **Schema evolution**: a schema registry with compatibility rules (backward/forward), Avro/Protobuf.
7. **Backpressure & scale**: watch consumer lag; scale via partitions; bound buffers so slow sinks don't OOM.

## Output shape

```
Latency need: … | why stream not batch
Source: Kafka topics/partitions, retention
Processing: stateless | stateful (engine)
Windowing: tumbling|sliding|session, event-time + watermark
Guarantee: at-least|exactly-once (producer+sink)
Schema: registry + compatibility
Flow: Producers → Kafka → Stream proc → Sink
Backpressure: lag, partitions, buffering
```

## Tips

- Exactly-once is **end-to-end** — the sink must cooperate (idempotent/transactional), or you get at-least-once.
- Default to event-time; processing-time silently drops or misplaces late events.
- End with the **Learning Footer** (`AGENTS.md`).
