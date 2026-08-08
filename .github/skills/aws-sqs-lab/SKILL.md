---
name: aws-sqs-lab
description: "Hands-on AWS lab: build an SQS queue end to end — create a Standard or FIFO queue, send and receive messages, delete after processing, tune the visibility timeout, and add a dead-letter queue with a redrive policy. Use for 'AWS SQS lab', 'create an SQS queue', 'SQS visibility timeout', 'SQS dead-letter queue', 'Standard vs FIFO queue', 'decouple with a message queue', 'SQS hands-on lab', or learning message queues by doing."
argument-hint: "The queue"
---

# AWS SQS Lab

Learn SQS by building a queue — send, receive, delete, then tune redelivery and add a DLQ — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [serverless-designer](../serverless-designer/SKILL.md) and [aws-lambda-lab](../aws-lambda-lab/SKILL.md).

## When to use

- The learner wants a guided, runnable queue that decouples a producer from a consumer, not just theory.
- Reinforcing asynchronous, at-least-once messaging for a **cloud/backend** role-agent.

## Mental model

SQS holds messages until a consumer pulls and **deletes** them — nothing is pushed. **Standard** queues give
near-unlimited throughput with at-least-once, best-effort ordering; **FIFO** queues add exactly-once
processing and order at up to 300 msg/s (3,000 batched) (Amazon SQS Developer Guide, *What is Amazon SQS?*).

## Procedure

1. **Pick the type:** Standard for scale and idempotent consumers; **FIFO** (`.fifo` suffix) when order or
   dedupe matters — you can't convert between them later.
2. **Create & send:** `CreateQueue`, then `SendMessage` (≤256 KB); new queues get SSE-SQS encryption by
   default (since Oct 2023) — keep a least-privilege queue policy, never open access.
3. **Receive & delete:** `ReceiveMessage` with **long polling** (`WaitTimeSeconds` 20) to cut empty reads,
   process, then `DeleteMessage` — a message you don't delete reappears.
4. **Tune visibility timeout:** set it just above processing time (default 30s, max 12h) so work isn't
   duplicated or stalled (Amazon SQS Developer Guide, *Visibility timeout*).
5. **Add a dead-letter queue:** create a second queue and a redrive policy with `maxReceiveCount` (e.g., 5)
   so poison messages move aside instead of looping forever (*Amazon SQS dead-letter queues*).
6. ⚠ **Verify & clean up:** send a failing message, watch it land in the DLQ, then delete both queues —
   requests and stray consumers keep billing.

## Output shape

```
Queue: <name> (Standard|FIFO) | Msg ≤ 256 KB, SSE-SQS on
Send: SendMessage → Receive: long poll 20s → DeleteMessage
Visibility: <~processing time> (def 30s, max 12h)
DLQ: <name> via redrive, maxReceiveCount=5
Access: least-privilege queue policy (no open access)
Cleanup: delete queue + DLQ  [⚠ stops requests + consumers]
```

## Tips

- Practice free and offline first with [floci-aws-local-lab](../floci-aws-local-lab/SKILL.md) — same CLI shapes on `localhost:4566`.
- Wire the queue to a consumer via [aws-lambda-lab](../aws-lambda-lab/SKILL.md); set visibility ≥ 6× the function timeout.
- End with the **Learning Footer** (`AGENTS.md`) — one message to send + one poison message to route to the DLQ yourself.
