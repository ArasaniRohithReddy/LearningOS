---
name: ts-utility-types-lab
description: "Hands-on lab on TypeScript utility types — Partial, Pick, Omit, Record, Readonly, and ReturnType, plus composing them into new types. Use for 'TypeScript utility types exercise', 'hands-on lab on Pick and Omit', 'practice Record and Partial', 'compose utility types', or transforming existing types by doing."
argument-hint: "The type transform"
---

# TypeScript Utility Types Lab

Transform existing types instead of re-declaring them — a guided hands-on lab that follows the teaching
principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has interfaces/objects and wants to derive new shapes without duplication, by doing.
- Pairs with [`type-system-explainer`](../type-system-explainer/SKILL.md) for the underlying theory and
  [`practice-generator`](../practice-generator/SKILL.md) for extra reps.

## Procedure

1. **Concept.** Utility types are built-in generics that *derive* a type from another, keeping shapes in sync
   (typescriptlang.org, Handbook: *Utility Types*, 2024). Start from `interface User { id: number; name: string }`.
2. **Select & drop.** Exercise: build `PublicUser = Pick<User, 'id' | 'name'>` and `Draft = Omit<User, 'id'>`.
   Ask how each reacts if `User` gains a field — derived types update automatically.
3. **Optional & frozen.** Write `Patch = Partial<User>` (all optional, for updates) and `Frozen = Readonly<User>`
   (assignments now error). Contrast their intent.
4. **Index & infer.** Build `ById = Record<number, User>` for a lookup map, then `R = ReturnType<typeof makeUser>`
   to capture a function's return type.
5. **Reference solution sketch.** Compose them: `SafePatch = Readonly<Partial<Omit<User, 'id'>>>` — read it
   inside-out; delegate a full worked build to [`worked-example`](../worked-example/SKILL.md).
6. **Pitfalls.** `Omit` keys aren't checked against `T` (typos silently no-op); `Readonly` is shallow; prefer
   deriving over hand-copying fields.

## Output shape

```
Base: <interface>
Derive: Pick / Omit / Partial / Readonly / Record / ReturnType → <result>
Compose: Readonly<Partial<Omit<T,'k'>>> read inside-out
Pitfall: shallow Readonly | unchecked Omit key
```

## Tips

- Derive types from one source of truth so they can't drift apart.
- Read composed utilities inside-out, one wrapper at a time.
- Have compositions reviewed with [`code-review-coach`](../code-review-coach/SKILL.md). End with the
  **Learning Footer** (`AGENTS.md`).
