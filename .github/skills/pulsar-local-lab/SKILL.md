---
name: pulsar-local-lab
description: "Hands-on lab running Apache Pulsar standalone locally, free, no subscription via Docker (apachepulsar/pulsar, ports 6650/8080). Learn Pulsar by doing — tenants/namespaces/topics, produce/consume with pulsar-client, and subscription types (exclusive, shared, failover, key_shared). Use for 'Pulsar lab', 'the streaming', 'Pulsar standalone', 'subscriptions', 'produce and consume', or learning Apache Pulsar by doing."
argument-hint: "The streaming"
---

# Pulsar Local Lab

Learn Pulsar by running a full standalone node yourself — one container bundles the broker, BookKeeper, and
metadata store — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [streaming-pipeline-designer](../streaming-pipeline-designer/SKILL.md) and [message-queue-coach](../message-queue-coach/SKILL.md).

## When to use

- The learner wants a unified queue+stream broker locally, for free, to compare its model with Kafka.
- Reinforcing **subscriptions** (how consumers share a topic) — Pulsar's key distinguishing feature.

## Procedure

1. **Concept:** a topic name is `persistent://<tenant>/<namespace>/<topic>` (default `public/default`). Many
   consumers attach via a named **subscription**; the **type** sets delivery: exclusive, failover, shared, key_shared.
2. **Compose up:** save `compose.yaml`, `docker compose up -d`, and wait ~20s for standalone to boot; the admin
   REST + web is on `:8080`. Apache Pulsar docs, *Run a standalone cluster in Docker* and *Subscriptions*, pulsar.apache.org, 2025.
3. **Consume first:** `docker compose exec pulsar bin/pulsar-client consume the-streaming -s my-sub -t Shared -n 0`
   — this creates the subscription so messages are retained for it.
4. **Produce:** from a second shell `bin/pulsar-client produce the-streaming -m "hello" -n 3` — the consumer prints them.
5. **Verify:** `bin/pulsar-admin topics stats persistent://public/default/the-streaming` shows the subscription and backlog.
6. **Clean up:** `docker compose down` (add `-v` to also delete stored data).

## Output shape

```yaml
services:
  pulsar:
    image: apachepulsar/pulsar:latest          # broker + BookKeeper + metadata in one
    container_name: pulsar
    command: ["bin/pulsar", "standalone"]
    ports:
      - "6650:6650"                             # pulsar:// binary protocol (clients)
      - "8080:8080"                             # admin REST + HTTP
```
```
docker compose up -d
# shell 1 — subscribe first so the subscription retains messages:
docker compose exec pulsar bin/pulsar-client consume the-streaming -s my-sub -t Shared -n 0
# shell 2 — produce:
docker compose exec pulsar bin/pulsar-client produce the-streaming -m "hello" -n 3
docker compose down
```

## Tips

- Start the consumer (or pre-create the subscription) *before* producing, or early messages have nowhere to be kept.
- Choose the subscription type by need: `Exclusive`/`Failover` keep order, `Shared`/`Key_Shared` scale consumers.
- End with the **Learning Footer** (`AGENTS.md`) — one subscription type to justify + one namespace to design yourself.
