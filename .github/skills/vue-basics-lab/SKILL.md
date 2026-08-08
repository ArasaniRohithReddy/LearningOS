---
name: vue-basics-lab
description: "Hands-on Vue 3 lab — reactivity with ref/reactive, the Composition API and <script setup>, components, props, and custom events — by building one small app. Use for 'Vue basics', 'Composition API', 'ref vs reactive', 'script setup', 'defineProps/defineEmits', 'v-model', or practicing Vue hands-on."
argument-hint: "The app"
---

# Vue Basics Lab

Learn Vue 3's Composition API by building one small app and watching reactivity, props, and events wire
it together — teaching the *why* and the trade-offs, per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [component-designer](../component-designer/SKILL.md).

## When to use

- The learner wants hands-on practice with reactive state, `<script setup>`, and component I/O.
- Debugging lost reactivity (a destructured `reactive`), or a child that can't update its parent.

## Procedure

1. **Frame the concept** — `ref()` wraps any value in a reactive box (read/write via `.value` in script);
   `reactive()` deep-proxies an object (vuejs.org, *Reactivity Fundamentals*, 2025).
2. **Exercise — build it**: in `<script setup>`, declare `const count = ref(0)`; render `{{ count }}` and
   bind a button with `@click="count++"`; add a `computed` that doubles it.
3. **Pass props down** — split out a `<Counter>` child; declare `const props = defineProps(['label'])` and
   bind `:label` from the parent (vuejs.org, *Props*, 2025).
4. **Emit events up** — child runs `const emit = defineEmits(['change']); emit('change', n)`; parent listens
   with `@change`; then swap to `v-model` for two-way state (vuejs.org, *Component Events*, 2025).
5. **Verify reactivity** — change state and confirm the DOM updates; break it by destructuring `reactive`,
   watch updates stop, then fix with `toRefs`.
6. **Name the pitfalls** — forgetting `.value`, destructuring `reactive`, mutating props directly, and using
   `reactive` for a lone primitive.

## Output shape

```
State: ref(<x>) · reactive(<obj>) · computed(<derived>)
Template: {{ x }} · :prop · @event · v-model
Child API: defineProps(<...>) | defineEmits(<...>)
Verify: state change → DOM update
Fix: <pitfall> → <correction>
```

## Tips

- Reach for `ref` by default; use `reactive` for grouped object state, never for a lone primitive.
- Props are one-way — emit an event (or `v-model`) to ask the parent to change state.
- Keep components small and typed (pair [state-management-coach](../state-management-coach/SKILL.md)); end with the **Learning Footer** (`AGENTS.md`).
