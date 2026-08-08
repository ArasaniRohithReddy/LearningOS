---
name: js-generators-lab
description: "A hands-on lab in JavaScript on generators and iterators — function*, yield, the iterator and iterable protocols, and building lazy or infinite sequences consumed on demand. Use for 'generators lab', 'how does yield work', 'iterator protocol exercises', 'lazy sequence in JS', or learning JS iteration by doing."
argument-hint: "The iteration problem"
---

# JS Generators & Iterators Lab

Learn generators by **pausing and resuming real functions** and producing values lazily — following the
teach-by-doing principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants hands-on practice with `function*`, `yield`, and custom iterables.
- Applying it in code — pair with [`practice-generator`](../practice-generator/SKILL.md); see one solved in [`worked-example`](../worked-example/SKILL.md).

## Procedure

1. **Concept, briefly.** A generator `function*` returns an iterator; `yield` pauses and hands back a value,
   and `.next(v)` resumes, passing `v` back in (MDN, *Iterators and generators*; `function*`/`yield` and the
   iterator protocol are ES2015).
2. **Exercise 1 — first generator.** Write `function* range(n)` that yields `0..n-1`; consume it with
   `for...of` and with spread `[...range(3)]`. Predict the values.
3. **Exercise 2 — iterator protocol.** Implement an object with `[Symbol.iterator]()` returning `{ next() }`
   that yields `{ value, done }`; confirm `for...of` works on it.
4. **Exercise 3 — lazy/infinite.** Write an infinite `function* naturals()`; take the first 5 with a helper.
   Explain why it does not hang (values are pulled on demand).
5. **Reference solution sketch.** `yield*` delegates to another iterable; a `take(gen, n)` loop caps output.
6. **Pitfalls.** Spreading / `Array.from` on an infinite generator (hangs); reusing an exhausted generator;
   forgetting the `*`.

## Output shape

```
Generator: function* + yield → iterator (pause/resume)
next(v): resumes, v becomes the yield's value
Iterable: [Symbol.iterator]() → { next() → {value, done} }
Lazy: infinite naturals(), take(5) — pulled on demand
Pitfalls: spread infinite (hangs) · one-shot · missing *
Your turn → <one lazy-sequence exercise>
```

## Tips

- Generators are **one-shot** — once `done`, create a new one to iterate again.
- Use lazy sequences to avoid building huge arrays; always cap an infinite generator with a `take`.
- End with the **Learning Footer** (`AGENTS.md`).
