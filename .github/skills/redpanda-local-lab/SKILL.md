---
name: redpanda-local-lab
description: "Hands-on lab running Redpanda locally, free, no subscription via Docker — a Kafka-API-compatible streaming broker as a single binary with no ZooKeeper and no JVM. Create topics and produce/consume with the rpk and Kafka tools. Use for 'Redpanda lab', 'the stream', 'Kafka without ZooKeeper', 'local streaming broker', 'rpk topic produce/consume', or learning Redpanda by doing."
argument-hint: "The stream"
---

# Redpanda Local Lab

Learn streaming by running a real Kafka-compatible broker yourself — Redpanda ships as one binary (no ZooKeeper,
no JVM) so a laptop is enough — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [kafka-producer-lab](../kafka-producer-lab/SKILL.md) and [streaming-pipeline-designer](../streaming-pipeline-designer/SKILL.md).

## When to use

- The learner wants the Kafka API (topics, partitions, offsets) with the least setup, for free, locally.
- Reinforcing produce→consume and consumer groups before scaling to a multi-broker cluster or the cloud.

## Procedure

1. **Concept:** Redpanda speaks the Kafka protocol, so `rpk` and Kafka clients work unchanged. A **topic**
   is an append-only, partitioned log; consumers track their own **offset**. No ZooKeeper — it uses Raft.
2. **Compose up:** save the `compose.yaml` below, then `docker compose up -d`; host clients reach the
   broker at `localhost:19092`. Redpanda docs, *Redpanda Quickstart*, docs.redpanda.com, 2026.
3. **Create a topic:** `docker compose exec redpanda rpk topic create the-stream -p 3` (3 partitions).
4. **Produce/consume:** consume in one shell `rpk topic consume the-stream`; produce in another
   `rpk topic produce the-stream` and type lines — watch them arrive with offset + partition.
5. **Verify:** `rpk topic describe the-stream` and `rpk group list` show partitions, offsets, and lag.
6. **Clean up:** `docker compose down` (add `-v` only to also delete the log volume).

## Output shape

```yaml
services:
  redpanda:
    image: redpandadata/redpanda:latest      # single binary — no ZooKeeper, no JVM
    container_name: redpanda
    command:
      - redpanda
      - start
      - --mode dev-container                  # single-node dev preset (smp=1)
      - --kafka-addr internal://0.0.0.0:9092,external://0.0.0.0:19092
      - --advertise-kafka-addr internal://redpanda:9092,external://localhost:19092
    ports: ["19092:19092", "9644:9644"]       # external Kafka API + Admin API
```
```
docker compose up -d
docker compose exec redpanda rpk topic create the-stream -p 3
docker compose exec redpanda rpk topic produce the-stream     # type lines, Ctrl-C
docker compose exec redpanda rpk topic consume the-stream     # from a second shell
docker compose down
```

## Tips

- `rpk` runs inside the container; external apps use `localhost:19092`, apps in the network use `redpanda:9092`.
- Add the `redpandadata/console` image on port 8080 for a free web UI to browse topics and messages.
- End with the **Learning Footer** (`AGENTS.md`) — one partition count to justify + one key to design yourself.
