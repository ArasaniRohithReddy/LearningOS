---
name: mosquitto-mqtt-lab
description: "Hands-on lab running an Eclipse Mosquitto MQTT broker locally, free, no subscription via Docker (eclipse-mosquitto, port 1883). Learn MQTT by doing — topic hierarchies, wildcards, QoS 0/1/2, retained messages, and publish/subscribe with mosquitto_pub/sub. Great for IoT. Use for 'MQTT lab', 'the IoT messaging', 'Mosquitto broker', 'QoS levels', 'topics and wildcards', or learning MQTT by doing."
argument-hint: "The IoT messaging"
---

# Mosquitto MQTT Lab

Learn MQTT — the lightweight pub/sub protocol behind most IoT — by running a broker yourself and pushing
messages through it — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [message-queue-coach](../message-queue-coach/SKILL.md) and [data-pipeline-designer](../data-pipeline-designer/SKILL.md).

## When to use

- The learner wants a tiny, IoT-style broker locally, for free, to feel QoS and retained messages first-hand.
- Reinforcing topic design (`home/room/temp`) and wildcards before wiring sensors or dashboards.

## Procedure

1. **Concept:** clients publish to a **topic** and subscribe with wildcards `+` (one level) and `#` (rest).
   **QoS** picks delivery effort: 0 at-most-once, 1 at-least-once, 2 exactly-once. **Retained** keeps the last value.
2. **Compose up:** Mosquitto 2.0 denies anonymous remote clients by default, so add a small `mosquitto.conf`
   (below), then `docker compose up -d`. Eclipse Mosquitto docs, *mosquitto.conf / mosquitto_pub*, mosquitto.org, 2025.
3. **Subscribe:** `docker compose exec mosquitto mosquitto_sub -t "home/#" -q 1 -v` (verbose prints topic + payload).
4. **Publish:** from a second shell `mosquitto_pub -t "home/room/temp" -m "21.5" -q 1` — watch it arrive; add
   `-r` to publish a **retained** value that new subscribers get immediately.
5. **Verify:** stop and restart `mosquitto_sub` on `home/#`; a retained message replays, a normal one does not.
6. **Clean up:** `docker compose down`.

## Output shape

```yaml
services:
  mosquitto:
    image: eclipse-mosquitto:2                 # official MQTT broker
    container_name: mosquitto
    ports: ["1883:1883"]                        # MQTT (add 9001 for websockets)
    volumes:
      - ./mosquitto.conf:/mosquitto/config/mosquitto.conf
```
```
# mosquitto.conf — minimal local-lab config (do NOT use open access in production)
listener 1883 0.0.0.0
allow_anonymous true
```
```
docker compose up -d
docker compose exec mosquitto mosquitto_sub -t "home/#" -q 1 -v        # shell 1
docker compose exec mosquitto mosquitto_pub -t "home/room/temp" -m "21.5" -q 1 -r  # shell 2
docker compose down
```

## Tips

- `+` matches one level (`home/+/temp`), `#` matches the rest and must be last — never subscribe to `#` in prod.
- Retained ≠ persistent queue: it stores only the *last* message per topic, delivered to new subscribers.
- End with the **Learning Footer** (`AGENTS.md`) — one QoS level to justify + one topic hierarchy to design yourself.
