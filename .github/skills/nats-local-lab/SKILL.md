---
name: nats-local-lab
description: "Hands-on lab running NATS locally, free, no subscription via Docker (nats image, port 4222). Learn core messaging by doing — subjects, publish/subscribe, request-reply, queue groups, and JetStream persistence basics using the nats CLI. Use for 'NATS lab', 'the messaging', 'pub/sub subjects', 'request-reply', 'JetStream basics', or learning NATS by doing."
argument-hint: "The messaging"
---

# NATS Local Lab

Learn lightweight messaging by running the broker yourself — NATS is a tiny Go binary where messages flow on
hierarchical **subjects** — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [message-queue-coach](../message-queue-coach/SKILL.md) and [streaming-pipeline-designer](../streaming-pipeline-designer/SKILL.md).

## When to use

- The learner wants fast, simple pub/sub and request-reply locally, for free, with almost no config.
- Reinforcing subjects, wildcards, and the jump from fire-and-forget core NATS to persistent JetStream.

## Procedure

1. **Concept:** publishers send to a **subject** (e.g. `greet.joe`); subscribers match subjects, including
   wildcards `*` (one token) and `>` (rest). Core NATS is at-most-once; **JetStream** adds persistence.
2. **Compose up:** save `compose.yaml`, `docker compose up -d`. The `nats` image is the server; a second
   `nats-box` service carries the `nats` CLI. NATS docs, *Core NATS* and *JetStream*, docs.nats.io, 2025.
3. **Pub/sub:** subscribe `docker compose exec nats-box nats -s nats://nats:4222 sub "greet.*"`; from a
   second shell publish `nats -s nats://nats:4222 pub greet.joe "hello"`.
4. **Request-reply:** start a responder `nats reply greet.help "on it"`, then `nats req greet.help "?"`
   and see the reply return on an auto-generated inbox subject.
5. **JetStream:** `nats stream add EVENTS --subjects "events.>"` then `nats pub events.a 1` — the stream
   stores messages so a later consumer can replay them.
6. **Verify & clean up:** `nats stream info EVENTS`; monitoring at `http://localhost:8222`; `docker compose down`.

## Output shape

```yaml
services:
  nats:
    image: nats:latest
    command: ["-js", "-m", "8222"]      # -js enables JetStream, -m opens monitoring
    ports: ["4222:4222", "8222:8222"]   # client protocol + HTTP monitoring
  nats-box:
    image: natsio/nats-box:latest       # toolbox that bundles the nats CLI
    command: ["sleep", "infinity"]
    depends_on: [nats]
```
```
docker compose up -d
docker compose exec nats-box nats -s nats://nats:4222 sub "greet.*"       # shell 1
docker compose exec nats-box nats -s nats://nats:4222 pub greet.joe "hello"  # shell 2
docker compose exec nats-box nats -s nats://nats:4222 stream add EVENTS --subjects "events.>"
docker compose down
```

## Tips

- Core NATS drops messages with no live subscriber; switch to a JetStream stream when you need durability.
- Use **queue groups** (`nats sub work --queue w`) to load-balance one subject across many workers.
- End with the **Learning Footer** (`AGENTS.md`) — one subject hierarchy to justify + one wildcard to design yourself.
