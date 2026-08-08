---
name: js-event-loop-lab
description: "A hands-on lab in JavaScript on the event loop — the call stack, macrotask vs microtask queues, timers (setTimeout), promise callbacks/queueMicrotask, and reasoning about execution order. Use for 'event loop lab', 'predict the output', 'why does setTimeout run last', 'microtask vs macrotask exercises', or learning JS concurrency ordering by doing."
argument-hint: "The ordering puzzle"
---

# JS Event Loop Lab

Build an accurate mental model of the event loop by **predicting output, then verifying** — following the
teach-by-doing principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner is confused about async ordering and wants to reason about it reliably.
- Debugging surprising timing — pair with [`debugging-coach`](../debugging-coach/SKILL.md); see one solved in [`worked-example`](../worked-example/SKILL.md).

## Procedure

1. **Concept, briefly.** Synchronous code runs on the **call stack**; when it empties, the loop drains the
   **microtask** queue fully (promise callbacks, `queueMicrotask`), then runs one **macrotask** (timers,
   I/O), and repeats (MDN, *The event loop*; microtasks are defined by the WHATWG HTML spec).
2. **Exercise 1 — predict.** Order `console.log(1)`, `setTimeout(…2)`, `Promise.resolve().then(…3)`,
   `console.log(4)`. Write your prediction, then run it (expect `1 4 3 2`).
3. **Exercise 2 — microtask vs macrotask.** Add a `queueMicrotask` and a second `setTimeout`; explain why
   all microtasks drain before the next timer fires.
4. **Exercise 3 — starvation.** Schedule a microtask that re-queues itself; watch timers never fire. Discuss.
5. **Reference solution sketch.** Sync first → drain microtasks → one macrotask → repeat.
6. **Pitfalls.** Assuming `setTimeout(…, 0)` is immediate; blocking the loop with long sync work; starving
   macrotasks with endless microtasks.

## Output shape

```
Model: stack → drain ALL microtasks → 1 macrotask → repeat
Puzzle: 1, setTimeout(2), then(3), 4 → predicted: 1 4 3 2
Micro vs macro: promises/queueMicrotask before timers
Starvation: self-queuing microtask blocks timers
Pitfalls: setTimeout≠instant · blocking sync · micro-starvation
Your turn → <one ordering puzzle to predict>
```

## Tips

- Say the queues out loud: "stack, then microtasks, then one macrotask" — order falls out of that rule.
- `await x` schedules the rest as a microtask; that's why post-`await` code runs before the next timer.
- End with the **Learning Footer** (`AGENTS.md`).
