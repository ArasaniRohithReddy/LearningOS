---
name: js-closures-lab
description: "A hands-on lab in JavaScript on closures and scope — lexical scoping, capturing variables by reference, the classic var-in-a-loop bug, and practical uses like data privacy and memoization. Use for 'closures lab', 'explain closures with exercises', 'why does my loop print the same value', 'practice lexical scope', or learning JS closures by building them."
argument-hint: "Your JS level or a closure goal"
---

# JS Closures Lab

Learn closures by **building and breaking them yourself**, not just reading a definition — following the
teach-by-doing principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants to *understand* closures and lexical scope through hands-on exercises.
- Reinforces a **Coding Mentor** lesson; add more reps with [`practice-generator`](../practice-generator/SKILL.md).

## Procedure

1. **Concept, briefly.** A **closure** is a function bundled with the lexical environment it was defined
   in, so it keeps access to outer variables after that scope returns (MDN, *Closures*; block scope via
   `let`/`const` is ES2015).
2. **Exercise 1 — make a counter.** Have the learner write `makeCounter()` returning a function that
   increments a private `count`. Predict the output *before* running it.
3. **Exercise 2 — reproduce the loop bug.** Use `var` in a `for` loop with `setTimeout`; watch it print
   the final value N times. Ask *why* (one shared binding), then fix it with `let` (per-iteration binding).
4. **Exercise 3 — privacy + memoization.** Build a `memoize(fn)` that caches results in a closed-over `Map`.
5. **Reference solution sketch.** `let` fixes the loop; `memoize` closes over `const cache = new Map()`.
6. **Pitfalls.** Capturing a variable (not a snapshot); leaking memory by holding large closed-over objects;
   assuming `var` makes a fresh scope per iteration ([`debugging-coach`](../debugging-coach/SKILL.md) helps).

## Output shape

```
Concept: closure = function + captured lexical scope
Predict → Run → Explain: makeCounter() … (why count survives)
Loop bug: var prints N,N,N → let prints 0..N-1 (why)
Solution sketch: memoize(fn) closes over a Map
Pitfalls: capture-by-reference · memory leaks · var scoping
Your turn → <one closure exercise>
```

## Tips

- Always **predict output first**, then run — closures are where intuition and reality diverge.
- Prefer `let`/`const`; reach for closures for privacy and caching, not to hide mutable global state.
- End with the **Learning Footer** (`AGENTS.md`).
