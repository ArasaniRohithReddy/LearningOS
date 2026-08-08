---
name: component-designer
description: "Design a reusable UI component as a lesson — a clear props/API, state ownership, composition, accessibility, and testable boundaries, with the trade-off behind each call. Use for 'design a component', 'component API/props design', 'make this reusable', 'build a reusable button/modal', 'controlled vs uncontrolled', or learning component design."
argument-hint: "The component + framework"
---

# Component Designer

Design a reusable UI component so its API, state, and boundaries are clear and testable — teaching the
trade-off behind each decision, per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Complements [code-review-coach](../code-review-coach/SKILL.md).

## When to use

- The learner is building a component meant to be reused and wants a clear, testable API.
- Turning a one-off widget into a shareable, documented building block.

## Procedure

1. **Clarify the job** — one responsibility (SRP): what it renders, who consumes it, which variants
   are real (not speculative).
2. **Design the props/API** — minimal, typed inputs with sensible defaults; prefer composition
   (slots/children) over boolean-flag explosion. React `children`/render props, Vue slots, Angular
   `ng-content` + `@Input`/`@Output` (MDN Web Components / framework docs, 2024).
3. **Decide state ownership** — controlled vs uncontrolled; keep local state local, lift shared state
   up (see [state-management-coach](../state-management-coach/SKILL.md)).
4. **Accessibility & semantics** — native elements first, correct name/role/state, keyboard support;
   pair [accessibility-audit](../accessibility-audit/SKILL.md).
5. **Draw testable boundaries** — pure render from props, side effects at the edges; one test per
   variant (pair [test-writer](../test-writer/SKILL.md)).
6. **Name the trade-offs** — flexibility vs simplicity, abstraction vs indirection.

## Output shape

```
Component: <name> — one responsibility
Props/API: <name: type = default> … | slots/children: …
State: controlled | uncontrolled | owned where: …
A11y: role/name/keyboard notes
Variants & tests: <variant> → <test>
Trade-offs: <flexibility vs simplicity>
```

## Tips

- A prop you can derive from another prop is a smell — compute it instead.
- Document the contract (props, events, slots) so callers never need to read the source.
- Prefer composition over configuration; end with the **Learning Footer** (`AGENTS.md`).
