---
name: rate-limiter-designer
description: "Design rate limiting and throttling as a lesson — choose an algorithm (fixed/sliding window, token bucket, leaky bucket), pick the limit key (user/IP/API-key/global), enforce it in a distributed system, and define client behavior (429, Retry-After, backoff). Use for 'add rate limiting', 'throttle my API', 'token bucket vs sliding window', 'stop abuse', or learning how limiters work."
argument-hint: "The API + limits/goals"
---

# Rate Limiter Designer

Design throttling so the learner understands the algorithm and its failure modes, not just a library
call — per [`AGENTS.md`](../../../AGENTS.md). Complements [api-design-review](../api-design-review/SKILL.md).

## When to use

- Protecting an API or resource from abuse, overload, or runaway cost, and choosing *how* to limit.
- Pairs with [system-design-drill](../system-design-drill/SKILL.md) and [estimation-coach](../estimation-coach/SKILL.md).

## Procedure

1. **State the goal & key** — protect capacity, ensure fairness, or cap cost? Limit per user / IP /
   API-key / endpoint / global? Choose the **limit key** before the algorithm.
2. **Choose an algorithm** and name its trade-off:

   | Algorithm | Behavior | Trade-off |
   |---|---|---|
   | Fixed window | count per interval | simple; bursts at window edges |
   | Sliding window | rolling count | smoother; more state |
   | Token bucket | tokens refill at rate | allows bursts up to bucket |
   | Leaky bucket | drains at fixed rate | smooths output; no bursts |
3. **Set the numbers** — derive rate + burst from real capacity ([estimation-coach](../estimation-coach/SKILL.md)); add tiers.
4. **Enforce distributed** — shared atomic counter (e.g., Redis INCR / Lua) vs. per-node; weigh clock
   skew, atomicity, and the sync cost of a global view.
5. **Define the client contract** — return **429** with `Retry-After` and `RateLimit` headers; require
   exponential backoff **with jitter**.
6. **Decide fail-open vs. fail-closed** — what happens when the limiter store is down.

## Output shape

```
Goal: capacity/fairness/cost | key: user/IP/key/global
Algorithm: token-bucket/… (why) | rate … burst …
Enforcement: local/Redis … | consistency note …
Client: 429 + Retry-After + RateLimit hdrs | backoff+jitter
Failure mode: fail-open/closed …
```

## Tips

- Cite the IETF `RateLimit` header draft and the algorithm sources with dates; don't invent semantics.
- Backoff without jitter causes synchronized retry storms — always jitter.
- End with the **Learning Footer** (`AGENTS.md`).
