---
name: ts-narrowing-lab
description: "Hands-on lab on TypeScript narrowing and type guards — typeof and instanceof, discriminated unions, user-defined type guards (x is T), and exhaustiveness with never. Use for 'TypeScript narrowing exercise', 'hands-on lab on type guards', 'practice discriminated unions', 'exhaustiveness check', or narrowing a union by doing."
argument-hint: "The union to narrow"
---

# TypeScript Narrowing Lab

Turn a wide union into a precise type the compiler trusts — a guided hands-on lab that follows the teaching
principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has a union or `unknown` value and must handle each case safely, by doing.
- Pairs with [`type-system-explainer`](../type-system-explainer/SKILL.md) for sum types and
  [`practice-generator`](../practice-generator/SKILL.md) for extra reps.

## Procedure

1. **Concept.** Narrowing shrinks a union inside a branch using runtime checks the compiler understands
   (typescriptlang.org, Handbook: *Narrowing*, 2024). Start from `type Val = string | number`.
2. **Primitive guards.** Exercise: in `format(v: Val)`, branch on `typeof v === 'string'`; TS narrows `v` to
   `string` inside the `if`. Add an `instanceof Date` branch for a class case.
3. **Discriminated union.** Model `type Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number }`.
   Switch on `kind`; each branch narrows to exactly one member.
4. **User-defined guard.** Write `function isCircle(x: Shape): x is Extract<Shape, { kind: 'circle' }>`; the
   `x is T` return type teaches TS to narrow at every call site.
5. **Reference solution sketch.** Add a `default` branch with `const _e: never = shape` so a new `kind` becomes a
   compile error; delegate a full build to [`worked-example`](../worked-example/SKILL.md).
6. **Pitfalls.** Guards that lie (`x is T` with wrong logic) are unsafe; don't skip the `never` case; recall
   `typeof null` is `'object'`.

## Output shape

```
Union: <the type to narrow>
Guard: typeof / instanceof / kind / (x is T)
Branch: inside → narrowed to <member>
Exhaustive: default → const _e: never = x
Pitfall: lying guard | missing never case
```

## Tips

- Prefer a discriminant (`kind`) — one switch narrows every member cleanly.
- Add a `never` exhaustiveness check so new variants fail to compile.
- Have guards reviewed with [`code-review-coach`](../code-review-coach/SKILL.md). End with the **Learning
  Footer** (`AGENTS.md`).
