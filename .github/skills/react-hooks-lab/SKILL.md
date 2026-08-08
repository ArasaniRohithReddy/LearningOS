---
name: react-hooks-lab
description: "Hands-on React lab on core hooks — useState, useEffect, useRef, useMemo, useCallback, dependency arrays, and the Rules of Hooks — by building and fixing one small component. Use for 'React hooks lab', 'useEffect dependency array', 'stale closure', 'rules of hooks', 'useMemo vs useCallback', 'useRef', or practicing hooks hands-on."
argument-hint: "The component behavior"
---

# React Hooks Lab

Learn React's core hooks by building one component and watching each hook change its behavior — teaching
the *why* and the trade-offs, per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [component-designer](../component-designer/SKILL.md).

## When to use

- The learner wants hands-on practice wiring state, effects, and refs instead of only reading about them.
- Debugging stale closures, infinite effect loops, or a missing / oversized dependency array.

## Procedure

1. **Frame the concept** — hooks add state and lifecycle to functions; they must run in the same order
   every render, so call them at the top level only (react.dev, *Rules of Hooks*, 2024).
2. **Exercise — build it step by step**: start with `useState` for a counter; add a value derived during
   render; add a `useEffect` that syncs `document.title`; keep the previous count in a `useRef`.
3. **Tune the dependency array** — drop a dep and watch the stale value, then add it and watch it heal.
   Effects re-run when listed values change; `[]` runs once (react.dev, *Synchronizing with Effects*, 2024).
4. **Memoize deliberately** — wrap an expensive calc in `useMemo` and a passed handler in `useCallback`;
   confirm identity stays stable across renders (see [react-performance-lab](../react-performance-lab/SKILL.md)).
5. **Reference solution sketch** — narrate the finished component: which hook owns what, and why each
   dependency array is exactly right.
6. **Name the pitfalls** — conditional hooks, missing deps, `useState` for derivable data, and effects that
   should really be event handlers (react.dev, *You Might Not Need an Effect*, 2024).

## Output shape

```
Goal: <component behavior>
Hooks: useState:<x>  useEffect:<sync>  useRef:<prev>  useMemo/useCallback:<why>
Step run → observed render / effect behavior
Deps: [<a>, <b>] because …
Fix: <pitfall> → <correction>
```

## Tips

- If an effect only reacts to a user action, it belongs in an event handler, not an effect.
- Don't store what you can derive during render — recompute instead of syncing with `useState`.
- Memoize only measured hot paths; end with the **Learning Footer** (`AGENTS.md`).
