---
name: idempotency-coach
description: "Design idempotent APIs and operations as a lesson — idempotency keys, request deduplication, safe retries under at-least-once delivery, and making writes replay-safe. Use for 'make this API idempotent', 'idempotency key', 'safe retries', 'prevent duplicate charges/orders', 'exactly-once effect', or learning idempotent design."
argument-hint: "The operation/API"
---

# Idempotency Coach

Design operations that survive retries so the learner reasons about duplicates and failure, not just
the happy path — per [`AGENTS.md`](../../../AGENTS.md). Complements [message-queue-coach](../message-queue-coach/SKILL.md).

## When to use

- A retry, timeout, or at-least-once broker could deliver the same request twice (payments, orders, webhooks).
- Pairs with [api-design-review](../api-design-review/SKILL.md) and [saga-pattern-coach](../saga-pattern-coach/SKILL.md).

## Procedure

1. **Define the effect** — what must happen *exactly once*? Idempotency means N identical requests leave
   the same state as one; separate the state change from the returned response.
2. **Use HTTP semantics first** — GET/PUT/DELETE are idempotent by spec (RFC 9110, 2022); POST is not, so
   a create needs an explicit key.
3. **Add an idempotency key** — client sends a unique key (UUID) per logical operation; the server stores
   key → outcome and replays the saved response on repeats (Stripe-style; IETF Idempotency-Key draft).
4. **Deduplicate atomically** — enforce with a DB unique constraint or `SET NX`; first writer wins, and
   concurrent duplicates wait or get the same result. Choose a retention TTL.
5. **Make retries safe** — bound retries with exponential backoff + jitter; scope the key to the whole unit
   of work so partial failures replay cleanly instead of double-applying.
6. **Guard the edges** — reject key reuse with a *different* body (422), and decide the fate of in-flight
   duplicates (409 vs. block-and-return).

## Output shape

```
Effect (exactly-once): …
Semantics: PUT idempotent | POST + Idempotency-Key: <uuid>
Dedup store: unique key + TTL … | concurrent dup → 409/replay
Retry policy: backoff + jitter, max N
Edge cases handled: key+body mismatch, partial write, redelivery
```

## Tips

- Cite RFC 9110 and the IETF Idempotency-Key draft with dates; never claim a broker gives true exactly-once.
- Store the *response* alongside the key so replays are byte-identical — and scope each key to one operation.
- End with the **Learning Footer** (`AGENTS.md`).
