---
name: mobile-state-management-coach
description: "Structure mobile app state as a lesson — unidirectional data flow, state hoisting, persistence, and surviving process death on iOS and Android. Use for 'mobile state management', 'SwiftUI @State/@Observable', 'Jetpack ViewModel/StateFlow', 'state hoisting', 'single source of truth', 'restore after the OS kills my app', or 'process death'."
argument-hint: "The state need"
---

# Mobile State Management Coach

Decide where each piece of mobile state lives and how it flows — teaching the trade-off before you
reach for a store — per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). The mobile companion to [state-management-coach](../state-management-coach/SKILL.md).

## When to use

- The learner is unsure whether state is local, hoisted, app-wide, or persisted.
- State vanishes after the OS kills the app, or there are duplicated sources of truth.

## Procedure

1. **Classify the state** — ephemeral UI, screen/shared, app-wide, or persisted; each has a different
   home (mirror [state-management-coach](../state-management-coach/SKILL.md) for web).
2. **Adopt unidirectional data flow** — state down, events up, one source of truth. iOS: `@State`/
   `@Binding`, `@Observable` (Observation, iOS 17+) or `ObservableObject`; Android: expose `StateFlow`
   from a `ViewModel` (Android, *State and Jetpack Compose*, 2024).
3. **Own state at the right level** — keep local state local; hoist shared state to the nearest common
   owner (a parent view / `ViewModel`).
4. **Persist deliberately** — small prefs: `@AppStorage` / Jetpack DataStore; structured data:
   SwiftData/Core Data / Room (see [mobile-offline-sync-coach](../mobile-offline-sync-coach/SKILL.md)).
5. **Survive process death** — iOS scene restoration / `NSUserActivity`; Android `SavedStateHandle` +
   `rememberSaveable` (Apple & Android docs, 2024). Restore only UI-critical state.
6. **Kill anti-patterns** — duplicated truth, derived-state-in-state, global singletons by default.

## Output shape

```
State inventory: <name> → class (ui | screen | app | persisted)
Flow: state down · events up · single source of truth
Owner: local view | parent | ViewModel
Persistence: @AppStorage/DataStore · SwiftData/Room
Process death: SavedStateHandle / scene restoration
Anti-pattern: <named> → fix
```

## Tips

- Most "global" state is really screen state — hoist before reaching for a singleton.
- Derive values; storing what you can compute invites drift.
- Test the OS-kill path, not just backgrounding; end with the **Learning Footer** (`AGENTS.md`).
