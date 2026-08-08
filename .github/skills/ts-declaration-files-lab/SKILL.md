---
name: ts-declaration-files-lab
description: "Hands-on lab on TypeScript declaration files (.d.ts) — typing untyped JS libraries, module declarations, ambient declarations, and DefinitelyTyped @types packages. Use for 'TypeScript declaration file exercise', 'hands-on lab on .d.ts', 'type a JS library', 'declare module', 'ambient types', or adding types to plain JS by doing."
argument-hint: "The JS lib to type"
---

# TypeScript Declaration Files Lab

Give plain JavaScript a type surface with `.d.ts` files — a guided hands-on lab that follows the teaching
principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner must consume an untyped JS module, global, or config from TypeScript, by doing.
- Pairs with [`type-system-explainer`](../type-system-explainer/SKILL.md) and
  [`practice-generator`](../practice-generator/SKILL.md) for extra reps.

## Procedure

1. **Concept.** A `.d.ts` file declares *types only* — no runtime code — describing shapes that already exist in JS
   (typescriptlang.org, Handbook: *Declaration Files*, 2024).
2. **Check DefinitelyTyped first.** Many libs ship types via `npm i -D @types/<pkg>` (the DefinitelyTyped repo);
   only hand-write a `.d.ts` when none exists.
3. **Declare a module.** Exercise: for an untyped `mini-math` package, write, in `types/mini-math.d.ts`,
   `declare module 'mini-math' { export function add(a: number, b: number): number }`.
4. **Ambient & global.** Add `declare const APP_VERSION: string` for a build-injected global, or use
   `declare global` to extend `Window` — these describe values TS can't otherwise see.
5. **Reference solution sketch.** Wire it up via `tsconfig` (`include`/`typeRoots`), import the module, and confirm
   an error on wrong args; delegate a full build to [`worked-example`](../worked-example/SKILL.md).
6. **Pitfalls.** Don't put runtime code in `.d.ts`; match the JS's real shape (default vs named exports); prefer
   upstreaming types to DefinitelyTyped over local drift.

## Output shape

```
Lib/global: <the untyped JS to type>
Source: @types/<pkg> exists? → else hand-write .d.ts
Module: declare module '<name>' { export … }
Ambient: declare const/function | declare global { … }
Pitfall: runtime code in .d.ts | wrong export shape
```

## Tips

- Search DefinitelyTyped (`@types/*`) before writing declarations by hand.
- Keep `.d.ts` free of implementation — it describes, it never runs.
- Have declarations reviewed with [`code-review-coach`](../code-review-coach/SKILL.md). End with the **Learning
  Footer** (`AGENTS.md`).
