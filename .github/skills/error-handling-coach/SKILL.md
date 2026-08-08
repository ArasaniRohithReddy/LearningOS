---
name: error-handling-coach
description: "Teach robust error handling — exceptions vs Result/Either, error propagation, retries and idempotency, fail-fast vs graceful degradation, and the common anti-patterns. Use for 'exceptions vs error values', 'how should I handle errors', 'add retries', 'why is swallowing exceptions bad', 'fail fast or recover', or making code resilient."
argument-hint: "The language/context + the code"
---

# Error Handling Coach

Design what happens when things go wrong, so failures are explicit, recoverable, and never silently
swallowed — teaching the trade-offs, per the coding standards and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner is deciding how to signal, propagate, or recover from failures.
- Pairs with [debugging-coach](../debugging-coach/SKILL.md) and [code-review-coach](../code-review-coach/SKILL.md) to catch fragile handling.

## Procedure

1. **Classify the failure.** Bug vs. expected condition vs. transient/external — this decides the tool.
2. **Pick the mechanism:**
   - **Exceptions** for exceptional, non-local errors (Java, Python, C#); don't use them for control flow.
   - **Result/Either/Option** for expected failures as values (Rust `Result`, Go `error`, `Optional`) —
     the type forces the caller to handle it.
3. **Propagate cleanly.** Bubble up with context (Rust `?`, wrapped errors, `try`); never drop the cause
   or the stack. Handle only where you can actually decide something.
4. **Transient failures.** Retry with backoff + jitter, but *only* if the operation is **idempotent**; add
   timeouts and a circuit breaker for downstream faults (Nygard, *Release It!*, 2018).
5. **Fail fast vs degrade.** Fail fast on programmer errors and broken invariants; degrade gracefully
   (fallback, cache, partial result) for non-critical dependencies.
6. **Kill the anti-patterns** — empty `catch`, catch-all-and-continue, exceptions as control flow, log-and-
   rethrow (double logging), and leaking internals in messages.

## Output shape

```
Failure type: <bug / expected / transient>
Mechanism: <exception | Result/Either> — why
Propagation: <context added / where handled>
Resilience: <retry+backoff? idempotent? timeout / circuit breaker>
Policy: <fail fast | degrade> | Anti-pattern removed: …
```

## Tips

- An error you can't handle here should propagate *with context* — don't swallow it.
- Test failure paths as thoroughly as success paths; pairs with a test skill like [test-writer](../test-writer/SKILL.md).
- Never leak secrets/stack traces to users; log them server-side. End with the **Learning Footer** (`AGENTS.md`).
