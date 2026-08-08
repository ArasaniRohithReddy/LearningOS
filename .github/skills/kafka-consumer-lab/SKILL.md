---
name: kafka-consumer-lab
description: "Hands-on Kafka lab: build a consumer end to end — the poll loop, deserialization, offsets, and commit strategies (auto vs manual, sync vs async, at-least-once vs at-most-once). Use for 'Kafka consumer lab', 'the consumer goal', 'poll loop', 'commit offsets', 'auto.offset.reset', 'deserialize records', 'Kafka consumer hands-on lab', or learning Kafka consumers by doing."
argument-hint: "The consumer goal"
---

# Kafka Consumer Lab

Learn Kafka consumers by building one — subscribe, run the poll loop, then control offsets and commits to
choose your delivery semantics — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [kafka-producer-lab](../kafka-producer-lab/SKILL.md) and [message-queue-coach](../message-queue-coach/SKILL.md).

## When to use

- The learner wants a runnable consumer and must reason about offsets, not just read messages.
- Reinforcing where commit timing decides at-least-once vs. at-most-once delivery.

## Mental model

A consumer `poll()`s batches from assigned partitions, deserializes each record, and tracks a **committed
offset** per partition — the point it resumes from after a restart or rebalance.

## Procedure

1. **Reuse the broker:** `docker compose up -d`, then produce sample data with `kafka-console-producer.sh
   --topic orders` so there is something to read.
2. **Write the poll loop:** set `group.id`, `key/value.deserializer`, `subscribe(["orders"])`, then loop
   `records = consumer.poll(Duration.ofMillis(100))` and process each — never block the loop.
3. **Set the start point:** `auto.offset.reset=earliest|latest` controls only the *first* read with no
   committed offset — Apache Kafka docs, *Consumer Configs*, kafka.apache.org, 2024.
4. **Compare commit strategies:** `enable.auto.commit=true` (easy, can lose/dup on rebalance) vs. manual
   `commitSync()` *after* processing (at-least-once) vs. committing *before* (at-most-once).
5. **Prove the semantics:** kill the consumer mid-batch and restart; observe reprocessed records with
   commit-after (at-least-once) — so make processing **idempotent**.
6. **Verify & clean up:** confirm no records were skipped, then `docker compose down`.

## Output shape

```
Goal: <what the consumer does> | group.id: <…>
Loop: subscribe → poll(100ms) → deserialize → process
Start: auto.offset.reset=earliest|latest (first read only)
Commit: auto | commitSync after (at-least-once) | before (at-most-once)
Verify: restart → reprocessed? | Cleanup: compose down
```

## Tips

- Commit *after* processing for at-least-once, and make handlers idempotent since redelivery will happen.
- A slow poll loop triggers rebalances — offload heavy work or raise `max.poll.interval.ms`.
- End with the **Learning Footer** (`AGENTS.md`) — one commit strategy to test + one offset reset to try yourself.
