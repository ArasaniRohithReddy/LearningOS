---
name: functional-programming-coach
description: "Teach functional programming from first principles — pure functions, immutability, higher-order functions, composition, and (gently) monads — showing when FP helps and its trade-offs. Use for 'make this more functional', 'what is a pure function', 'explain immutability / map-filter-reduce / currying / monads', 'FP vs OOP', or learning functional style in any language."
argument-hint: "The FP concept or a snippet to make more functional"
---

# Functional Programming Coach

Teach functional style so the learner reasons about code as *values and pure transformations* — with
worked examples and the *why*, per the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants to understand FP ideas or make imperative code more functional.
- Pairs with [oop-design-coach](../oop-design-coach/SKILL.md) for paradigm trade-offs and [refactoring-coach](../refactoring-coach/SKILL.md) to apply changes safely.

## Procedure

1. **Purity first.** Define a **pure function**: same input → same output, no side effects
   (referential transparency; SICP, Abelson & Sussman). Show an impure version, then extract the effect.
2. **Immutability.** Replace mutation with new values; explain why shared mutable state breeds bugs and
   defeats easy reasoning and safe concurrency.
3. **Higher-order functions.** Model iteration as `map`/`filter`/`reduce` (fold) instead of loops; pass
   and return functions as data.
4. **Composition & currying.** Build big behavior from small functions: `h = f ∘ g` (compose); curry to
   specialize one argument at a time.
5. **Monads, gently.** Introduce as a pattern for *sequencing computations in a context* (Option/Result,
   list, async) — a `map` plus `flatMap`/`bind` obeying simple laws (Wadler); lead with the shape, not jargon.
6. **When & trade-offs.** FP shines for data pipelines, concurrency, and testability; note costs
   (allocation, unfamiliarity, some algorithms read clearer mutable).

## Output shape

```
Concept: <pure fn / immutability / HOF / composition / monad>
Impure → Pure: <before → after snippet>
Why: <referential transparency / easier tests / safe concurrency>
Trade-off: <allocation / learning curve / when imperative wins>
Check yourself: <1 predict-the-output prompt>
```

## Tips

- Language-agnostic: show the idea in the learner's language (JS, Python, Java, Rust, Haskell) — most support FP.
- Don't force purity everywhere; push side effects to the edges (functional core, imperative shell).
- End with the **Learning Footer** (`AGENTS.md`) — the one habit to carry forward plus an exercise.
