---
name: code-optimizer
description: "Optimize code for performance as a lesson — profile to find the real hotspot first, explain the dominant cost (algorithmic vs I/O vs allocation), apply the change, then quantify the trade-off in readability and memory. Use for 'make this faster', 'optimize this', 'reduce memory', 'why is this slow', or learning performance work. Pairs with complexity-analyzer."
argument-hint: "Code + the perf goal/constraint"
---

# Code Optimizer

Teach performance the disciplined way — **measure, then optimize the thing that matters** — per the
coding standards and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has working code that's too slow or memory-heavy and wants to learn what to change.
- A hotspot from profiling needs a principled fix, not a guess.

## Mental model

- **Don't guess — measure.** Most time hides in a small fraction of code, so profile first and attack
  the **dominant cost** (Amdahl's law: speeding up 10% of runtime caps your gain at ~10%). Prefer an
  **algorithmic** win (better Big-O) over micro-tuning; know the trade-off vs. clarity and memory.

## Procedure

1. **Set the target**: what's "fast enough", on what input size and hardware? Define the metric.
2. **Measure**: profile or time it to find the actual hotspot — never optimize on a hunch.
3. **Name the dominant cost**: algorithmic complexity, I/O/network, allocations/GC, or contention.
4. **Apply one change**: reduce complexity, batch/cache I/O, or avoid needless allocation — one at a time.
5. **Re-measure & weigh trade-offs**: quantify the speedup and state what it cost (readability,
   memory, added complexity). Keep it only if the win justifies it.

## Output shape

```
Target: <metric @ input size>
Hotspot: <where, from measurement>
Dominant cost: <algorithmic / I/O / allocation / contention>
Change: <what + why>
Result: before → after (numbers) | trade-off: <readability/memory>
```

## Tips

- Avoid premature optimization; keep the clear version until a measurement proves you need the fast one.
- Always benchmark before and after with realistic inputs; pair with [complexity-analyzer](../complexity-analyzer/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — the "measure first" habit + a hotspot to profile yourself.
