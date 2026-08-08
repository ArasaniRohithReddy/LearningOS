---
name: react-performance-lab
description: "Hands-on React lab on performance — memo, useMemo, useCallback, stable keys, list virtualization, and Profiler-driven measurement — by finding and fixing needless re-renders. Use for 'React performance lab', 'slow React UI', 'unnecessary re-renders', 'React.memo', 'list virtualization', 'React Profiler', or profiling React hands-on."
argument-hint: "The slow UI"
---

# React Performance Lab

Make a slow React UI fast by measuring first, then removing needless renders — teaching which fix fits
which cause, per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [web-perf-audit](../web-perf-audit/SKILL.md).

## When to use

- A list, form, or dashboard feels laggy and the learner wants the real cause, not a guess.
- Learning when memoization actually helps versus when it only adds noise.

## Procedure

1. **Frame the concept** — React re-renders a component when its state or props change; slowness is usually
   rendering too often or too expensively (react.dev, *Render and Commit*, 2024).
2. **Measure first** — record with the React DevTools Profiler (or the `<Profiler>` API) to find the
   components that render most and cost most; never optimize before you measure.
3. **Exercise — fix identity**: give list items stable `key`s (not the array index); wrap a pure child in
   `memo`; stabilize its callback / object props with `useCallback` / `useMemo`.
4. **Virtualize the long list** — render only visible rows (react-window / `@tanstack/react-virtual`) so a
   10k-row table mounts a handful of nodes instead of thousands.
5. **Reference solution sketch** — narrate before / after render counts and where each `memo` boundary sits.
6. **Name the pitfalls** — index keys, memoizing everything, inline objects breaking `memo`, and doing work
   in render that belongs in `useMemo` (see [react-hooks-lab](../react-hooks-lab/SKILL.md)).

## Output shape

```
Symptom: <slow interaction>
Profiler: hot component <x> — renders <n>×, <ms>
Fix: stable key | memo boundary | useCallback/useMemo | virtualize
Before → after: renders <n>→<m>, <ms>→<ms>
Note: React Compiler can auto-memoize — measure to confirm
```

## Tips

- Measure before and after — an unmeasured optimization is a guess.
- A stable `key` is the cheapest render fix; the array index is not stable across reorders.
- The React Compiler (react.dev, 2024) auto-memoizes — don't hand-memoize blindly; end with the **Learning Footer** (`AGENTS.md`).
