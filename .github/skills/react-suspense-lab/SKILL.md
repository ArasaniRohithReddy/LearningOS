---
name: react-suspense-lab
description: "Hands-on React lab on Suspense and loading UX — Suspense boundaries, React.lazy code splitting, useTransition, and error boundaries — by staging fallbacks around async work. Use for 'React Suspense lab', 'loading UX', 'React.lazy', 'code splitting', 'useTransition', 'error boundary', 'skeleton fallback', or practicing async UI hands-on."
argument-hint: "The loading UX"
---

# React Suspense Lab

Design a calm loading experience with Suspense — placing boundaries, lazy chunks, transitions, and error
boundaries where they belong — teaching the UX trade-offs, per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [react-performance-lab](../react-performance-lab/SKILL.md).

## When to use

- The learner wants intentional loading and error states instead of spinners scattered everywhere.
- Code-splitting a heavy route or keeping the UI responsive during a slow update.

## Procedure

1. **Frame the concept** — `<Suspense fallback>` shows a placeholder until its children can render; it
   catches *loading*, while an error boundary catches *failure* (react.dev, *Suspense*, 2024).
2. **Exercise — split and boundary**: load a heavy component with `lazy(() => import(...))`, wrap it in
   `<Suspense>` with a skeleton fallback, and confirm the chunk loads on demand.
3. **Keep it responsive** — mark a non-urgent update with `useTransition` so the old UI stays interactive
   and shows `isPending` instead of blanking to a fallback (react.dev, *useTransition*, 2024).
4. **Handle failure** — wrap the region in an error boundary so a rejected load renders a retry UI rather
   than crashing the tree (see [error-handling-coach](../error-handling-coach/SKILL.md)).
5. **Reference solution sketch** — narrate boundary placement: one per meaningful region, with fallbacks
   shaped like the final layout to avoid shift.
6. **Name the pitfalls** — one boundary around the whole app, fallbacks that jump the layout, a missing
   error boundary, and transitions used for urgent input.

## Output shape

```
Loading UX: <region> → <Suspense fallback=<skeleton>>
Lazy chunk: <component> via lazy(import)
Transition: <update> wrapped, isPending → <ui>
Error boundary: <region> → <retry ui>
Pitfall: <named> → fix
```

## Tips

- Match the fallback's shape to the loaded content so nothing jumps — skeletons over bare spinners.
- Suspense needs a Suspense-enabled source (a framework loader or the `use` hook) — fetching alone won't suspend.
- Scope boundaries to regions users actually perceive; end with the **Learning Footer** (`AGENTS.md`).
