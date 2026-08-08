---
name: kafka-kraft-local-lab
description: "Hands-on lab running Apache Kafka in KRaft mode (no ZooKeeper) locally, free, no subscription via the official apache/kafka Docker image. Stand up a single-broker cluster that is broker + controller, create a topic, and produce/consume with the console tools. Use for 'Kafka KRaft lab', 'the Kafka setup', 'Kafka without ZooKeeper', 'single-broker Kafka locally', or learning Kafka KRaft by doing."
argument-hint: "The Kafka setup"
---

# Kafka KRaft Local Lab

Learn how modern Apache Kafka runs by standing up a single broker yourself — KRaft mode replaces ZooKeeper
with a built-in Raft controller quorum — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [kafka-producer-lab](../kafka-producer-lab/SKILL.md) and [message-queue-coach](../message-queue-coach/SKILL.md).

## When to use

- The learner wants the *official* Kafka image and needs to understand KRaft vs. the old ZooKeeper setup.
- Reinforcing broker/controller roles, listeners, and topic basics before touching a real cluster.

## Procedure

1. **Concept:** In **KRaft** one process plays `broker` + `controller` roles; the controller quorum stores
   metadata (no ZooKeeper). `KAFKA_LISTENERS` binds ports; `ADVERTISED` tells clients where to reconnect.
2. **Compose up:** save `compose.yaml`, then `docker compose up -d`; the broker listens on `localhost:9092`.
   Apache Kafka docs, *Docker* and *KRaft*, kafka.apache.org, 2025.
3. **Create a topic:** `docker compose exec kafka /opt/kafka/bin/kafka-topics.sh --create --topic the-setup -p 1 --bootstrap-server localhost:9092`.
4. **Produce/consume:** consume with `kafka-console-consumer.sh --topic the-setup --from-beginning`; in a
   second shell produce with `kafka-console-producer.sh --topic the-setup` and type lines.
5. **Verify:** `kafka-topics.sh --describe --topic the-setup` shows the leader and partition assignment.
6. **Clean up:** `docker compose down` (add `-v` to also delete the log volume).

## Output shape

```yaml
services:
  kafka:
    image: apache/kafka:latest                 # official image, KRaft — no ZooKeeper
    container_name: kafka
    ports: ["9092:9092"]
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller   # one node plays both roles
      KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:9092,CONTROLLER://0.0.0.0:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@localhost:9093
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
```
```
docker compose up -d
docker compose exec kafka /opt/kafka/bin/kafka-topics.sh --create --topic the-setup -p 1 --bootstrap-server localhost:9092
docker compose exec kafka /opt/kafka/bin/kafka-console-producer.sh --topic the-setup --bootstrap-server localhost:9092
docker compose down
```

## Tips

- Single node ⇒ replication factor 1 (`KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1`), or the broker won't start.
- Prefer the Redpanda lab ([redpanda-local-lab](../redpanda-local-lab/SKILL.md)) for the fastest Kafka-API startup.
- End with the **Learning Footer** (`AGENTS.md`) — one KRaft role to explain + one listener to reconfigure yourself.
