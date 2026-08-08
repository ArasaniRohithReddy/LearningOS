---
name: state-management-coach
description: "Choose and structure frontend state as a lesson — local vs global vs server state, when to reach for a store, and the anti-patterns to avoid. Use for 'state management', 'local vs global state', 'do I need Redux/Zustand/Pinia', 'prop drilling', 'server state / React Query', or learning to structure state."
argument-hint: "The app + state problem + framework"
---

# State Management Coach

Decide where each piece of state lives and how to structure it — local vs global vs server — teaching
the trade-off *before* reaching for a store, per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner is unsure whether state should be local, lifted, global, or server-owned.
- Untangling prop drilling, duplicated sources of truth, or an over-used global store.

## Procedure

1. **Classify the state** — UI/local, shared client (global), server cache, URL, or form. Each class has
   a different home (Kent C. Dodds, *Application State Management with React*, 2020).
2. **Start local, lift only when shared** — colocate state with its consumer; lift to the nearest common
   ancestor when two siblings genuinely need it.
3. **Server state ≠ client state** — remote data belongs in a cache with fetching/invalidation
   (TanStack Query / SWR, Vue Query, RTK Query), not a hand-rolled global.
4. **Reach for a store only when justified** — cross-cutting client state, many consumers, or complex
   updates (Redux/Zustand/Jotai, Pinia, NgRx/Signals).
5. **Model updates safely** — one source of truth; derive don't duplicate; keep updates immutable/pure.
6. **Name the anti-pattern** (prop drilling, derived-state-in-state, global-by-default) and show the fix.

## Output shape

```
State inventory: <name> → class (local | global | server | url | form)
Home for each: colocated | lifted to <X> | store | cache
Store needed? yes/no — because …
Anti-pattern: <named> → fix
Data flow: source of truth → derived → view
```

## Tips

- Most "global state" is really server cache — reach for a data-fetching library first.
- Derived values should be computed, not stored; storing them invites drift.
- A store is a cost (indirection, boilerplate) — justify it (see [tech-comparison](../tech-comparison/SKILL.md)); end with the **Learning Footer** (`AGENTS.md`).
