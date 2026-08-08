---
name: svelte-basics-lab
description: "Hands-on Svelte 5 lab — reactivity with runes ($state/$derived), components, props via $props, and shared stores — by building one small app. Use for 'Svelte basics', 'Svelte 5 runes', '$state', '$derived', '$props', 'writable store', or practicing Svelte hands-on."
argument-hint: "The app"
---

# Svelte Basics Lab

Learn Svelte 5 by building one small app and watching runes, props, and stores drive the UI — teaching the
*why* and the trade-offs, per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [state-management-coach](../state-management-coach/SKILL.md).

## When to use

- The learner wants hands-on practice with reactive runes, component props, and shared state.
- Migrating from Svelte 4 `$:`/`export let`, or deciding between a rune and a store.

## Procedure

1. **Frame the concept** — runes are `$`-prefixed compiler directives; `$state` makes a variable reactive so
   reassigning it re-renders every reader (svelte.dev, *$state*, 2025).
2. **Exercise — build it**: `let count = $state(0)`; render `{count}` and a
   `<button onclick={() => count++}>`; add `let doubled = $derived(count * 2)` and watch it track.
3. **Pass props** — split out a `<Counter>`; read inputs with `let { label } = $props()` and pass `label`
   from the parent (svelte.dev, *$props*, 2025).
4. **Share across components** — create a `writable(0)` in a store module; auto-subscribe in templates with
   the `$count` prefix from any component (svelte.dev, *Stores*, 2025).
5. **Verify reactivity** — update the state/store and confirm every reader updates; keep `$derived` pure and
   move side effects into `$effect`.
6. **Name the pitfalls** — mutating a non-`$state` variable, putting side effects in `$derived`, and reaching
   for a store when a local rune (or shared `$state` module) suffices.

## Output shape

```
State: $state(<x>) · $derived(<expr>)
Template: {x} · onclick={...}
Props: let { <p> } = $props()
Store: writable(<x>) → $store in template
Fix: <pitfall> → <correction>
```

## Tips

- Prefer runes for local/component state; reach for a store for cross-component shared state.
- Keep `$derived` side-effect free — use `$effect` for fetches or DOM work.
- Start on the smallest reactive unit (pair [component-designer](../component-designer/SKILL.md)); end with the **Learning Footer** (`AGENTS.md`).
