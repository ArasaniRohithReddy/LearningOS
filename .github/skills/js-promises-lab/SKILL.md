---
name: js-promises-lab
description: "A hands-on lab in JavaScript on promises and async/await — chaining, error handling with try/catch, running work concurrently with Promise.all/race/allSettled/any, and pitfalls like forgotten awaits and unhandled rejections. Use for 'promises lab', 'async/await exercises', 'practice Promise.all', 'why is my async code sequential', or learning JS async by doing."
argument-hint: "The async task"
---

# JS Promises Lab

Learn async JavaScript by **wiring up real promises** and watching them settle — following the
teach-by-doing principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants hands-on practice with promises, `async`/`await`, and concurrency.
- Debugging flaky async flow — pair with [`debugging-coach`](../debugging-coach/SKILL.md); see one solved end to end in [`worked-example`](../worked-example/SKILL.md).

## Procedure

1. **Concept, briefly.** A **promise** models a future value in one of three states — pending, fulfilled,
   rejected; `await` unwraps it (MDN, *async function*; async/await is ES2017, `Promise.allSettled` ES2020,
   `Promise.any` ES2021).
2. **Exercise 1 — chain.** Fetch-then-transform: return a value from each `.then` and watch it flow on;
   then rewrite the chain with `async`/`await`.
3. **Exercise 2 — handle errors.** Add a rejecting step; catch it with `.catch`, then again with `try/catch`.
   Note that a thrown error rejects the chain.
4. **Exercise 3 — concurrency.** Run three tasks with `Promise.all` (fail-fast), then `Promise.allSettled`
   (never rejects), `race` (first to settle), and `any` (first to fulfill). Compare the results.
5. **Reference solution sketch.** `const [a, b] = await Promise.all([f(), g()])`; wrap awaits in `try/catch`.
6. **Pitfalls.** Forgetting `await`/`return`; awaiting inside a loop when tasks could run in parallel;
   swallowing errors; unhandled rejections.

## Output shape

```
States: pending → fulfilled | rejected ; await unwraps
Chain: .then → .then (values flow) ≡ async/await
Errors: throw → reject → .catch / try-catch
Concurrency: all(fail-fast) · allSettled · race · any
Pitfalls: missing await · serial loop · swallowed error
Your turn → <one async exercise>
```

## Tips

- Run independent tasks in parallel with `Promise.all`; serialize only for genuine dependencies.
- Always handle rejections — an unhandled rejection is a latent crash.
- End with the **Learning Footer** (`AGENTS.md`).
