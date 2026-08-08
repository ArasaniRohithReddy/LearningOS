---
name: ts-decorators-lab
description: "Hands-on lab on TypeScript decorators and metadata — class and method decorators, the current Stage 3 standard vs legacy experimentalDecorators, decorator context, and practical uses. Use for 'TypeScript decorators exercise', 'hands-on lab on decorators', 'standard vs experimental decorators', 'method decorator', or adding behavior with @decorators by doing."
argument-hint: "The decorator goal"
---

# TypeScript Decorators Lab

Add reusable behavior to classes with `@decorators` the modern way — a guided hands-on lab that follows the
teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants cross-cutting behavior (logging, timing, registration) on classes/methods, by doing.
- Pairs with [`type-system-explainer`](../type-system-explainer/SKILL.md) and
  [`practice-generator`](../practice-generator/SKILL.md) for extra reps.

## Procedure

1. **Concept.** A decorator is a function that observes or replaces a declaration. TS 5.0 ships the Stage 3
   ECMAScript standard — no flag needed (typescriptlang.org, release notes: *TypeScript 5.0*, 2023).
2. **Standard vs legacy.** Standard decorators receive `(value, context)`; the old form needs
   `"experimentalDecorators": true` and differs (e.g. parameter decorators stay legacy-only). Choose standard.
3. **Method decorator.** Exercise: write `log(value, context: ClassMethodDecoratorContext)` returning a wrapper
   that prints `context.name`, then calls the original — apply `@log` to a method and run it.
4. **Class decorator.** Write a `@sealed` decorator typed `(value, context: ClassDecoratorContext)` that
   `Object.seal`s the constructor and its prototype.
5. **Reference solution sketch.** Show the wrapper preserving `this` and arguments; mention metadata via
   `Symbol.metadata` (TS 5.2, 2023); delegate a full build to [`worked-example`](../worked-example/SKILL.md).
6. **Pitfalls.** Don't mix standard and legacy semantics; a method decorator must return a function or `void`;
   keep `this` bound inside the wrapper.

## Output shape

```
Goal: <behavior to add> on <class/method>
Kind: class | method  (standard, TS 5.0+)
Signature: (value, context: Class*DecoratorContext)
Sketch: wrapper → log/seal → call original (keep this)
Pitfall: legacy vs standard | lost this
```

## Tips

- Prefer the Stage 3 standard; reserve `experimentalDecorators` for legacy code that needs it.
- Read `context.kind`/`context.name` instead of guessing what was decorated.
- Have decorators reviewed with [`code-review-coach`](../code-review-coach/SKILL.md). End with the **Learning
  Footer** (`AGENTS.md`).
