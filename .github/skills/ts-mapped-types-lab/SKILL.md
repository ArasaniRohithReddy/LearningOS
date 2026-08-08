---
name: ts-mapped-types-lab
description: "Hands-on lab on TypeScript mapped and conditional types — key remapping with as, template literal types, conditional types, and inference with infer. Use for 'TypeScript mapped types exercise', 'hands-on lab on conditional types', 'practice key remapping', 'template literal types', 'infer keyword', or building advanced types by doing."
argument-hint: "The advanced type"
---

# TypeScript Mapped & Conditional Types Lab

Generate new types programmatically from existing ones — a guided hands-on lab that follows the teaching
principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner outgrew utility types and wants to build their own type transformers, by doing.
- Follows [`ts-utility-types-lab`](../ts-utility-types-lab/SKILL.md); pairs with
  [`type-system-explainer`](../type-system-explainer/SKILL.md) for theory.

## Procedure

1. **Concept.** A mapped type walks a key set: `{ [K in keyof T]: T[K] }`. Add/remove modifiers with `-?` and
   `-readonly` (typescriptlang.org, Handbook: *Mapped Types*, 2024). Start from an `interface User`.
2. **Own utility.** Exercise: reimplement `type MyPartial<T> = { [K in keyof T]?: T[K] }`; confirm it behaves like
   built-in `Partial<T>`.
3. **Key remapping.** Use `as` (TS 4.1, 2020) with template literal types to rename keys — map each key `K` to a
   `getName`-style accessor; see the exact syntax in *Output shape*.
4. **Conditional + infer.** Write `type ElementType<T> = T extends (infer U)[] ? U : T`; `infer U` captures the
   array element type inside the true branch.
5. **Reference solution sketch.** Combine them — a mapped type whose value is a conditional type — and evaluate it
   step by step; delegate a full build to [`worked-example`](../worked-example/SKILL.md).
6. **Pitfalls.** Bare conditionals distribute over unions (wrap operands in `[T]` to stop it); remapping a key to
   `never` drops it; deep recursion hits limits.

## Output shape

```
Base: <type to transform>
Mapped: { [K in keyof T]: T[K] } with -?/-readonly
Remap: { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }
Conditional: T extends (infer U)[] ? U : T
Pitfall: distribution over unions | key → never
```

## Tips

- Build and name your own utility types instead of repeating inline shapes.
- Reach for `infer` to pull a type out of another; test it on edge inputs.
- Have advanced types reviewed with [`code-review-coach`](../code-review-coach/SKILL.md). End with the **Learning
  Footer** (`AGENTS.md`).
