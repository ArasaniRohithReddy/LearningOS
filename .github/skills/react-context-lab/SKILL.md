---
name: react-context-lab
description: "Hands-on React lab on Context — createContext, providing and consuming with useContext, killing prop drilling, and taming re-render pitfalls — by refactoring a prop-drilled tree. Use for 'React Context lab', 'useContext', 'prop drilling', 'context re-render', 'split context', 'theme/auth context', or practicing Context hands-on."
argument-hint: "The shared state"
---

# React Context Lab

Learn React Context by refactoring a prop-drilled tree into a clean provider / consumer pair — teaching
when Context helps and when it hurts, per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [state-management-coach](../state-management-coach/SKILL.md).

## When to use

- The learner is threading the same prop through many layers and wants to stop the drilling.
- Diagnosing why every consumer re-renders when only one slice of context changes.

## Procedure

1. **Frame the concept** — Context shares a value with any descendant without passing props at each level;
   it's transport, not a state manager (react.dev, *Passing Data Deeply with Context*, 2024).
2. **Exercise — create and provide**: `const ThemeContext = createContext(null)`; wrap the subtree in
   `<ThemeContext value={theme}>` (React 19 renders the context directly) and read it with `useContext`.
3. **Remove the drilling** — delete the intermediate props and confirm the leaf still receives the value.
4. **Feel the re-render pitfall** — put a fast-changing value in the same context and watch unrelated
   consumers re-render; fix by splitting stable vs volatile contexts and memoizing the provider `value`.
5. **Reference solution sketch** — narrate two contexts (theme + dispatch), a memoized value object, and
   consumers that subscribe only to what they need.
6. **Name the pitfalls** — one giant context, a new object literal each render, and Context for
   high-frequency state that belongs in a store (see [react-hooks-lab](../react-hooks-lab/SKILL.md)).

## Output shape

```
Shared state: <what> → context(s): <Theme> <Dispatch>
Provider value: memoized? yes/no — because …
Consumers: <component> reads <slice>
Drilling removed: <prop> across <n> layers
Re-render fix: split | memoize | move to store
```

## Tips

- Context re-renders every consumer on a value change — split contexts by change frequency.
- Memoize the provider `value` so a fresh object each render doesn't force needless updates.
- Context isn't a global store; for complex client state reach for one ([state-management-coach](../state-management-coach/SKILL.md)); end with the **Learning Footer** (`AGENTS.md`).
