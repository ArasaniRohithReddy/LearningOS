---
name: aws-sns-lab
description: "Hands-on AWS lab: build an SNS topic end to end — create a topic, add subscriptions, fan out one publish to many SQS queues and Lambdas, and apply subscription filter policies so each subscriber gets only what it needs. Use for 'AWS SNS lab', 'create an SNS topic', 'SNS fan-out', 'SNS to SQS', 'SNS message filtering', 'pub/sub on AWS', 'SNS hands-on lab', or learning pub/sub messaging by doing."
argument-hint: "The pub/sub"
---

# AWS SNS Lab

Learn SNS by building a topic — publish once, fan out to many subscribers, then filter — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [aws-sqs-lab](../aws-sqs-lab/SKILL.md) and [serverless-designer](../serverless-designer/SKILL.md).

## When to use

- The learner wants a guided, runnable pub/sub topic that pushes to many consumers, not just theory.
- Reinforcing decoupled, push-based fan-out for a **cloud/backend** role-agent.

## Mental model

SNS is **push** pub/sub: a publisher sends one message to a **topic** and SNS delivers a copy to every
**subscription** (SQS, Lambda, HTTP/S, email, SMS). Pair it with SQS for durable fan-out — SNS pushes, each
queue buffers (Amazon SNS Developer Guide, *Common Amazon SNS scenarios: fanout*).

## Procedure

1. **Create the topic:** Standard for high-throughput fan-out; **FIFO** (`.fifo`) when order and dedupe
   matter — a FIFO topic can only feed FIFO queues.
2. **Subscribe & confirm:** add subscribers; protocols like HTTP/S and email require a **confirmation** step
   before delivery — an unconfirmed subscription silently drops messages.
3. **Fan out to SQS:** subscribe two or more SQS queues so one `Publish` reaches every queue; grant SNS
   `sqs:SendMessage` via each queue policy — least privilege, not open ([aws-sqs-lab](../aws-sqs-lab/SKILL.md)).
4. **Filter per subscriber:** attach a subscription **filter policy** on message attributes so a subscriber
   receives only matching messages (Amazon SNS Developer Guide, *Message filtering*; since 2017).
5. **Verify:** `Publish` once and confirm each queue/function gets only its filtered slice; check CloudWatch
   delivery metrics for failures ([aws-cloudwatch-lab](../aws-cloudwatch-lab/SKILL.md)).
6. ⚠ **Secure & clean up:** enable SSE and a least-privilege topic policy, then delete the topic and
   subscriptions — leftover subscriptions keep delivering (and billing).

## Output shape

```
Topic: <name> (Standard|FIFO), SSE on
Subs: SQS×2, Lambda, email(confirmed)
Fan-out: 1 Publish → every subscription
Filter: {"eventType":["order_placed"]} on attributes
Access: least-privilege topic + queue policies
Cleanup: delete subscriptions + topic  [⚠ stops delivery]
```

## Tips

- Practice free and offline first with [floci-aws-local-lab](../floci-aws-local-lab/SKILL.md) — same `Publish`/subscribe shapes on `localhost:4566`.
- Filter at the subscription, not in consumer code — you cut cost and needless invocations.
- End with the **Learning Footer** (`AGENTS.md`) — one subscriber to add + one filter policy to write yourself.
