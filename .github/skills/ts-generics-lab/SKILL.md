---
name: ts-generics-lab
description: "Hands-on lab on TypeScript generics — generic functions and classes, constraints (extends), default type parameters, and type inference. Use for 'TypeScript generics exercise', 'hands-on lab on generics', 'practice generic constraints', 'how does <T> inference work', or building reusable typed code by doing."
argument-hint: "The reusable code"
---

# TypeScript Generics Lab

Learn generics by *writing* reusable, type-safe code yourself — a guided hands-on lab that follows the
teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner knows basic types and wants to write reusable code with `<T>` by doing, not just reading.
- Pairs with [`type-system-explainer`](../type-system-explainer/SKILL.md) for theory and
  [`practice-generator`](../practice-generator/SKILL.md) for extra repetitions.

## Procedure

1. **Concept.** A generic is a *type parameter* — one implementation over many types. `identity<T>(x: T): T`
   preserves the caller's type instead of collapsing to `any` (typescriptlang.org, Handbook: *Generics*, 2024).
2. **Warm up (inference).** Have the learner write `function first<T>(arr: T[]): T | undefined`. Ask what
   `first([1, 2])` infers — the compiler deduces `T = number` with no annotation.
3. **Add a constraint.** Exercise: `longest<T extends { length: number }>(a: T, b: T): T`. `extends` restricts
   `T` so `.length` is legal; have them pass a `number` and read the resulting error.
4. **Give a default.** Extend to `class Box<T = string>` so `new Box()` falls back to `string` while
   `new Box<number>(1)` overrides it — defaults keep simple call sites terse.
5. **Reference solution sketch.** Walk the finished `Box<T>` with `get()`/`set()`, noting where inference
   suffices vs. where explicit `<T>` is required; hand a fuller build to [`worked-example`](../worked-example/SKILL.md).
6. **Pitfalls.** `any` discards safety (use `<T>`); over-generic signatures hurt readability; constrain with
   `extends` instead of casting.

## Output shape

```
Concept: generic = reusable type parameter <T>
Exercise: <function/class to write> → expected inference
Constraint: T extends <shape> because …
Solution sketch: <key lines + why each>
Pitfall: any vs <T> | over-generic signature
```

## Tips

- Let inference do the work — annotate `<T>` only when the compiler cannot deduce it.
- Constrain with `extends` rather than casting to unlock members safely.
- Have a learner's generic reviewed with [`code-review-coach`](../code-review-coach/SKILL.md). End with the
  **Learning Footer** (`AGENTS.md`).
