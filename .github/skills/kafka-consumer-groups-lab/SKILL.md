---
name: kafka-consumer-groups-lab
description: "Hands-on Kafka lab: scale consumers with consumer groups — group.id, partition assignment, parallelism capped by partitions, rebalancing (eager vs cooperative), and monitoring consumer lag. Use for 'Kafka consumer groups lab', 'the scaling need', 'scale consumers', 'rebalancing', 'consumer lag', 'partition assignment', 'Kafka consumer group hands-on lab', or learning group scaling by doing."
argument-hint: "The scaling need"
---

# Kafka Consumer Groups Lab

Learn scaling by running a group and watching it rebalance — parallelism, assignment, and lag — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [kafka-consumer-lab](../kafka-consumer-lab/SKILL.md) and [message-queue-coach](../message-queue-coach/SKILL.md).

## When to use

- The learner needs more throughput and must scale consumers without double-processing.
- Reinforcing that group parallelism is capped by partition count.

## Mental model

Consumers sharing a `group.id` split a topic's partitions, each partition owned by **exactly one** member.
So max useful consumers = partition count; extras sit idle.

## Procedure

1. **Set up:** a `docker compose` broker, a topic `orders` with 3 partitions, and a producer streaming records.
2. **Start one consumer** with `group.id=orders-workers`; it owns all 3 partitions — note throughput.
3. **Scale out:** launch a second and third consumer in the same group; watch a **rebalance** reassign
   partitions so each owns one — Apache Kafka docs, *Consumer Groups*, kafka.apache.org, 2024.
4. **Over-scale:** add a 4th consumer; it gets **no** partition (idle) — proof that partitions cap parallelism.
5. **Tune rebalancing:** compare eager vs. **cooperative** assignment (`CooperativeStickyAssignor`, Kafka 2.4,
   2019), which reassigns fewer partitions and avoids stop-the-world pauses.
6. **Measure lag & clean up:** `kafka-consumer-groups.sh --describe --group orders-workers` shows LAG per
   partition; add consumers until lag stops growing, then `docker compose down`.

## Output shape

```
Group: orders-workers | Partitions: 3 (parallelism cap)
Members: 1→3 (one partition each) | 4th → idle
Rebalance: eager | cooperative (StickyAssignor, fewer moves)
Lag: --describe LAG per partition (rising = under-scaled)
Verify: scale until lag flat | Cleanup: compose down
```

## Tips

- If lag keeps rising at max consumers, add **partitions** (plan ahead — you cannot remove them).
- Watch `max.poll.interval.ms`: slow processing looks like a dead member and forces a rebalance.
- End with the **Learning Footer** (`AGENTS.md`) — one lag metric to alert on + one assignor to try yourself.
