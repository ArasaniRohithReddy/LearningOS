---
name: android-lifecycle-coach
description: "Teach the Android activity, fragment, and Compose lifecycle as a lesson — lifecycle states, configuration changes, ViewModel, and lifecycle-aware collection. Use for 'Android lifecycle', 'onCreate/onResume/onPause', 'config change recreates activity', 'ViewModel survives rotation', 'Compose recomposition', 'LaunchedEffect/DisposableEffect', or 'data resets on rotation'."
argument-hint: "The lifecycle issue"
---

# Android Lifecycle Coach

Teach the Android lifecycle so state and effects survive recreation — activity/fragment states,
configuration changes, `ViewModel`, and Compose — per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [mobile-state-management-coach](../mobile-state-management-coach/SKILL.md).

## When to use

- The learner loses data on rotation, or an effect runs at the wrong scope.
- Understanding `ViewModel`, recomposition, or lifecycle-aware flow collection.

## Procedure

1. **Map activity states** — `onCreate → onStart → onResume → onPause → onStop → onDestroy`, plus
   `onRestart`; fragments add a separate `viewLifecycleOwner` (Android, *The activity lifecycle*, 2024).
2. **Survive configuration changes** — rotation/theme recreates the Activity; hold UI state in a
   `ViewModel`, and `rememberSaveable`/`onSaveInstanceState` for small bundles.
3. **Understand Compose** — composition → recomposition → decomposition; `remember` scopes to
   composition, `LaunchedEffect`/`DisposableEffect` key effects to it (Android, *Lifecycle of composables*, 2024).
4. **Collect safely** — `collectAsStateWithLifecycle` / `repeatOnLifecycle(STARTED)` so flows stop in
   the background and don't leak.
5. **Persist across process death** — `ViewModel` alone won't survive it; add `SavedStateHandle` +
   DataStore (see [mobile-state-management-coach](../mobile-state-management-coach/SKILL.md)).
6. **Debug the symptom** — reproduce rotation/kill, name the wrong scope, verify with lifecycle logs.

## Output shape

```
Trigger: <symptom, e.g. data lost on rotation>
Activity: onCreate→onStart→onResume→onPause→onStop→onDestroy
Config change: ViewModel keeps · rememberSaveable for small state
Compose: remember scope · LaunchedEffect/DisposableEffect keys
Collection: collectAsStateWithLifecycle / repeatOnLifecycle
Fix + verify: <owner/scope> → <how confirmed>
```

## Tips

- `ViewModel` survives rotation but not process death — pair it with `SavedStateHandle`.
- An unkeyed `LaunchedEffect(Unit)` won't restart on new inputs — key it to the data.
- Test rotation and "Don't keep activities"; end with the **Learning Footer** (`AGENTS.md`).
