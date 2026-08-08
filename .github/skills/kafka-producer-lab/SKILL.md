---
name: kafka-producer-lab
description: "Hands-on Kafka lab: build a producer end to end — send records with the KafkaProducer API, choose keys and partitioning, tune acks (0/1/all), and turn on idempotence for duplicate-free delivery. Use for 'Kafka producer lab', 'the producer goal', 'send records to Kafka', 'keys and partitioning', 'acks and idempotence', 'Kafka producer hands-on lab', or learning Kafka producers by doing."
argument-hint: "The producer goal"
---

# Kafka Producer Lab

Learn Kafka producers by building one — send records, key them for partitioning, then tune durability with
acks and idempotence — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [kafka-consumer-lab](../kafka-consumer-lab/SKILL.md) and [message-queue-coach](../message-queue-coach/SKILL.md).

## When to use

- The learner wants a runnable producer from scratch, not just theory about brokers.
- Reinforcing keys→partitions, delivery guarantees, and duplicate-free writes.

## Mental model

A producer serializes a `ProducerRecord(topic, key, value)`, a **partitioner** maps the key to a partition,
and `acks` decides how many replicas must confirm before a `send()` is durable.

## Procedure

1. **Spin up a broker:** a `docker-compose.yml` with one Kafka (KRaft mode) service; `docker compose up -d`,
   then `kafka-topics.sh --create --topic orders --partitions 3`.
2. **Send your first records:** build a `KafkaProducer`, loop `producer.send(new ProducerRecord("orders",
   key, value))`, `flush()` — confirm with `kafka-console-consumer.sh --topic orders --from-beginning`.
3. **Key for partitioning:** send same-key records and verify they land on one partition (same key → same
   partition, so per-key order holds) — Apache Kafka docs, *Producer Configs*, kafka.apache.org, 2024.
4. **Tune acks:** compare `acks=0` (fire-and-forget), `acks=1` (leader only), and `acks=all` (all in-sync
   replicas) against `min.insync.replicas` — durability vs. latency.
5. **Enable idempotence:** set `enable.idempotence=true` (default since Kafka 3.0, 2021; implies `acks=all`)
   so retries can't create duplicates; re-run and re-count.
6. **Verify & clean up:** confirm produced count == consumed count, then `docker compose down`.

## Output shape

```
Goal: <what the producer writes> | Topic: orders (3 partitions)
Record: key=<…> value=<…> | Partitioner: default (hash key)
acks: 0 | 1 | all  (with min.insync.replicas=<n>)
Idempotence: enable.idempotence=true → no duplicate on retry
Verify: produced count == consumed count | Cleanup: compose down
```

## Tips

- Pick a key that reflects your ordering unit (e.g., `customerId`); `null` keys round-robin across partitions.
- `acks=all` + `min.insync.replicas=2` is the durable default; `acks=1` can lose the last writes on failover.
- End with the **Learning Footer** (`AGENTS.md`) — one acks setting to benchmark + one key to choose yourself.
