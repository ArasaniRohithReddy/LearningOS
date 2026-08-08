---
name: ios-lifecycle-coach
description: "Teach the iOS app and view lifecycle as a lesson — app states, SwiftUI view updates, scene phases, and where to run effects. Use for 'iOS lifecycle', 'scenePhase', 'onAppear/onDisappear', 'app goes to background', 'UIApplicationDelegate vs SceneDelegate', 'SwiftUI view updates', or 'my state resets when backgrounded'."
argument-hint: "The lifecycle issue"
---

# iOS Lifecycle Coach

Teach the iOS lifecycle so state, effects, and transitions run at the right moment — app states,
SwiftUI view updates, and scene phases — per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [mobile-state-management-coach](../mobile-state-management-coach/SKILL.md).

## When to use

- The learner is unsure where to save/restore, or an effect fires at the wrong time.
- State resets on background/foreground, or a view reappears and re-runs work.

## Procedure

1. **Map the app states** — UIKit: not running → inactive → active → background → suspended via
   `UIApplicationDelegate`/`UISceneDelegate`; SwiftUI observes `ScenePhase` (Apple, *Managing your app's life cycle*, 2024).
2. **Handle scene phases** — `@Environment(\.scenePhase)`: save on `.background`, pause on `.inactive`,
   resume on `.active`.
3. **Understand view updates** — SwiftUI views are value types recreated when `@State`/`@Observable`
   change; identity drives diffing, not object lifetime (Apple, *State and Data Flow*, 2024).
4. **Place effects correctly** — `.task`/`.onAppear` to start, `.onDisappear` to stop; prefer `.task`
   for async work tied to the view (it auto-cancels).
5. **Persist across transitions** — save on `.background`; restore via scene state restoration /
   `NSUserActivity` (see [mobile-state-management-coach](../mobile-state-management-coach/SKILL.md)).
6. **Debug the symptom** — reproduce the reset, name the missing hook, verify with a log per phase.

## Output shape

```
Trigger: <symptom, e.g. state lost on background>
App states: notRunning→inactive→active→background→suspended
Scene phase: active | inactive | background → action
View effects: .task/.onAppear start · .onDisappear stop
Persistence: save on background → restore on launch
Fix + verify: <hook added> → <how confirmed>
```

## Tips

- `onAppear` can fire more than once — don't treat it as "load once"; key work to state/identity.
- A view struct's `init` is not a lifecycle event — never do side effects there.
- Test background→foreground explicitly; end with the **Learning Footer** (`AGENTS.md`).
