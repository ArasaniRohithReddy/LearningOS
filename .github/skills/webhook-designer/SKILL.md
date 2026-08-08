---
name: webhook-designer
description: "Design webhooks and event callbacks defensively as a lesson — event schema and versioning, delivery and ordering, retries with backoff, idempotency keys, HMAC signing and verification, and consumer ergonomics. Use for 'design a webhook', 'event callbacks', 'how to sign webhooks', 'retry and idempotency', 'verify webhook signatures', or learning webhook patterns."
argument-hint: "The events + consumers"
---

# Webhook Designer

Design webhooks the way a careful platform does — assume delivery is unreliable and the network is
hostile — per the teaching approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). For
internal fan-out compare [message-queue-coach](../message-queue-coach/SKILL.md); throttle with [rate-limiter-designer](../rate-limiter-designer/SKILL.md).

## When to use

- The learner is exposing events to third parties and needs a reliable, secure callback contract.
- Consumers are missing or double-processing events, or can't verify that a payload is authentic.

## Principles (teach the why)

- Delivery is **at-least-once**: the network retries, so consumers must be **idempotent** (dedupe on an
  event `id`). Payloads are **untrusted** until verified — sign with **HMAC** over the raw body plus a
  timestamp so receivers can reject forgeries and replays. Order is **not** guaranteed; carry a sequence.

## Procedure

1. **Define the event**: stable `id`, `type`, `created_at`, versioned `data`; document each type.
2. **Deliver reliably**: `POST` to a registered URL; **retry with exponential backoff + jitter** on
   non-`2xx`; cap attempts, then move to a **dead-letter**/manual-replay path.
3. **Make consumers safe**: idempotency via event `id`; expect duplicates and out-of-order arrival.
4. **Secure it**: HMAC signature header over the raw body + timestamp; verify and reject stale timestamps;
   HTTPS only; document SSRF-safe endpoint rules per OWASP.
5. **Consumer ergonomics**: fast `2xx` ack, async processing, a test-ping and a replay tool.

## Output shape

```
Events: <id, type, created_at, version, data>
Delivery: POST → retries: backoff+jitter, max N → dead-letter
Idempotency: dedupe on event id (at-least-once)
Security: HMAC(sha256, raw body + timestamp) header; reject stale; HTTPS
Consumer: ack 2xx fast, process async, replay endpoint
```

## Tips

- Sign the **raw** body and verify with a constant-time compare; follow OWASP guidance (owasp.org, 2024) on HMAC/SSRF.
- Idempotency + retries beat "exactly once"; never trust an unsigned payload. Shape the contract with [api-design-review](../api-design-review/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — the at-least-once mindset + a signature check to implement yourself.
