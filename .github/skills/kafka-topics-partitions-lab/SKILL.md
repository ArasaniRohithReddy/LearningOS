---
name: kafka-topics-partitions-lab
description: "Hands-on Kafka lab: design topics and partitions — create topics, choose a partition count for parallelism, set replication factor and min.insync.replicas for durability, and see why ordering is per-partition. Use for 'Kafka topics lab', 'the topic design', 'how many partitions', 'replication factor', 'partition ordering', 'Kafka partitions hands-on lab', or learning topic design by doing."
argument-hint: "The topic design"
---

# Kafka Topics & Partitions Lab

Learn topic design by creating and probing topics yourself — partitions for scale, replicas for durability,
and the ordering they imply — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [streaming-pipeline-designer](../streaming-pipeline-designer/SKILL.md) and [kafka-consumer-groups-lab](../kafka-consumer-groups-lab/SKILL.md).

## When to use

- The learner must pick a partition count and replication factor and defend the trade-off.
- Reinforcing that Kafka guarantees order **per partition**, not per topic.

## Mental model

A topic is a partitioned, replicated log. **Partitions** set max consumer parallelism and are the unit of
ordering; **replication factor** copies each partition to N brokers for fault tolerance.

## Procedure

1. **Create a topic:** on a `docker compose` broker, `kafka-topics.sh --create --topic orders --partitions 3
   --replication-factor 1`, then `--describe` to see leaders and replicas.
2. **See ordering:** produce keyed records and read one partition with `--partition 0`; order holds within a
   partition but not across them — Apache Kafka docs, *Design → Partitioning*, kafka.apache.org, 2024.
3. **Right-size partitions:** more partitions = more parallelism but more open files, higher end-to-end
   latency, and costlier elections; you can add but **never remove** them (adding also re-buckets keys).
4. **Add replication:** recreate with `--replication-factor 3` and set `min.insync.replicas=2` so `acks=all`
   writes survive one broker loss (durability vs. availability).
5. **Verify:** `--describe` shows ISR = the in-sync replica set; stop one broker and confirm the partition
   still serves.
6. **Clean up:** `kafka-topics.sh --delete --topic orders`, then `docker compose down`.

## Output shape

```
Topic: orders | Partitions: <n> (parallelism + order unit)
Replication factor: <r> | min.insync.replicas: <m>
Ordering: per-partition only (key → stable partition)
Durability: acks=all + ISR ≥ m survives <r−m> broker loss
Verify: --describe ISR | stop broker | Cleanup: --delete + down
```

## Tips

- Size partitions for *peak* consumer parallelism up front — adding them later reshuffles key→partition.
- `replication-factor ≥ 3` with `min.insync.replicas=2` is the common durable production baseline.
- End with the **Learning Footer** (`AGENTS.md`) — one partition count to justify + one RF/ISR pair to set yourself.
