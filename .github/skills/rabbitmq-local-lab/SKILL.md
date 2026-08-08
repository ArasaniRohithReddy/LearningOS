---
name: rabbitmq-local-lab
description: "Hands-on lab running RabbitMQ locally, free, no subscription via Docker (rabbitmq:management, ports 5672/15672). Learn the AMQP model by doing — declare exchanges, queues, and bindings, publish with routing keys, and watch it all in the management UI. Use for 'RabbitMQ lab', 'the messaging', 'exchanges vs queues', 'AMQP bindings and routing keys', 'management UI', or learning RabbitMQ by doing."
argument-hint: "The messaging"
---

# RabbitMQ Local Lab

Learn the AMQP 0-9-1 model by wiring it yourself — a **producer** publishes to an **exchange**, which routes by
**binding** into **queues** — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [message-queue-coach](../message-queue-coach/SKILL.md) and [data-pipeline-designer](../data-pipeline-designer/SKILL.md).

## When to use

- The learner wants classic broker-based messaging (work queues, pub/sub fan-out) locally, for free.
- Reinforcing exchange types (direct/fanout/topic) and routing before choosing a broker for a design.

## Procedure

1. **Concept:** producers never publish to a queue directly — they publish to an **exchange** with a
   **routing key**; **bindings** decide which **queues** receive it. Exchange type sets the routing rule.
2. **Compose up:** save `compose.yaml`, `docker compose up -d`, then open the management UI at
   `http://localhost:15672` (login `guest`/`guest`). RabbitMQ docs, *AMQP 0-9-1 Model Explained* and
   *Management Plugin*, rabbitmq.com, 2025.
3. **Declare topology:** create a `fanout` exchange `logs`, a queue `audit`, and a binding between them
   (via the UI, or `rabbitmqadmin declare exchange/queue/binding`).
4. **Produce/consume:** publish a message to `logs` (UI *Publish message* or `rabbitmqadmin publish
   exchange=logs routing_key= payload="hi"`); read it back with `rabbitmqadmin get queue=audit`.
5. **Verify:** `docker compose exec rabbitmq rabbitmqctl list_queues name messages` (or the UI graphs).
6. **Clean up:** `docker compose down` (add `-v` to also delete the data volume).

## Output shape

```yaml
services:
  rabbitmq:
    image: rabbitmq:management        # broker + web management plugin
    container_name: rabbitmq
    ports:
      - "5672:5672"                    # AMQP protocol (apps)
      - "15672:15672"                  # management UI + HTTP API
```
```
docker compose up -d
docker compose exec rabbitmq rabbitmqadmin declare exchange name=logs type=fanout
docker compose exec rabbitmq rabbitmqadmin declare queue name=audit
docker compose exec rabbitmq rabbitmqadmin declare binding source=logs destination=audit
docker compose exec rabbitmq rabbitmqadmin publish exchange=logs routing_key= payload="hi"
docker compose exec rabbitmq rabbitmqadmin get queue=audit ackmode=ack_requeue_false
docker compose down
```

## Tips

- Match the exchange type to intent: `fanout` = broadcast, `direct` = exact key, `topic` = `orders.*` patterns.
- `guest`/`guest` only works from localhost by design — create a real user before exposing the broker.
- End with the **Learning Footer** (`AGENTS.md`) — one exchange type to justify + one binding to design yourself.
