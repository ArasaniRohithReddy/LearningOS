---
name: concurrency-coach
description: "Teach concurrency and parallelism as a lesson — threads vs async, CPU- vs I/O-bound, shared mutable state, locks and atomics, races and deadlocks, and safer patterns (immutability, channels, thread pools) — with the classic pitfalls. Use for 'fix this race condition', 'threads vs async', 'deadlock', 'is this thread-safe', 'parallelize this', or learning concurrency."
argument-hint: "The concurrency problem + language"
---

# Concurrency Coach

Teach concurrency from first principles so the learner can spot races before they ship — per
[`AGENTS.md`](../../../AGENTS.md). Complements [debugging-coach](../debugging-coach/SKILL.md) and [complexity-analyzer](../complexity-analyzer/SKILL.md).

## When to use

- Learning concurrency, or debugging a race, deadlock, or scaling problem in concurrent code.
- Pairs with [code-review-coach](../code-review-coach/SKILL.md) and [system-design-drill](../system-design-drill/SKILL.md).

## Procedure

1. **Name the goal** — **parallelism** (throughput, CPU-bound, needs cores) vs. **concurrency**
   (responsiveness, I/O-bound, needs overlap). They call for different tools.
2. **Pick a model** — threads + locks, async/await (event loop), message-passing / actors, or data
   parallelism; match it to the workload and the language's runtime (GIL, event loop, goroutines).
3. **Find shared mutable state** — the root of every race. Prefer to remove it via immutability or
   confinement (thread-local, ownership) *before* reaching for locks.
4. **If you must share** — use the smallest safe primitive (atomics < locks < channels); hold locks
   briefly and acquire them in **one global order** to prevent deadlock.
5. **Hunt the classic bugs** — data race, deadlock (the four Coffman conditions), livelock, starvation,
   torn/stale reads from missing memory barriers.
6. **Prefer safer patterns** — immutable data, queues/channels, thread pools, and structured concurrency
   over hand-rolled locking.

## Output shape

```
Goal: parallelism/concurrency (CPU/IO-bound)
Model: threads/async/actors/data-parallel (why)
Shared state: … → remove or protect with …
Risks: race/deadlock/starvation → mitigation …
Safer pattern: immutability/channel/pool …
```

## Tips

- The language **memory model** (JMM, C++11, Go) defines what's safe — cite it; don't assume ordering.
- Reproduce with race detectors / stress tests (Go `-race`, TSan); races hide under low load.
- End with the **Learning Footer** (`AGENTS.md`).
