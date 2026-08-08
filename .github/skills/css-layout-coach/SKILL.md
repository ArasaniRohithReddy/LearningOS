---
name: css-layout-coach
description: "Teach modern CSS layout for a target design and build it step by step — Flexbox vs Grid, the box model, responsive units, and the common pitfalls that break layouts. Use for 'CSS layout', 'Flexbox vs Grid', 'how do I center this', 'build this layout', 'box model', 'why is my layout broken', or learning CSS layout."
argument-hint: "The layout/design to build"
---

# CSS Layout Coach

Build a target layout step by step — teaching *when* to reach for Flexbox vs Grid and *why* — following
the teach-first approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[responsive-design-coach](../responsive-design-coach/SKILL.md).

## When to use

- The learner has a design/mockup and wants to build the layout while understanding each choice.
- Debugging a fragile layout (overflow, collapsing margins, unexpected sizing).

## Procedure

1. **Read the design and pick the model** — content along one axis → Flexbox; two-dimensional
   rows-and-columns → CSS Grid (MDN CSS layout, 2024). They compose: Grid for the page, Flex in cells.
2. **Get the box model right** — `box-sizing: border-box`; distinguish content, padding, border, margin;
   watch for margin collapse.
3. **Pick units intentionally** — `rem` for type/spacing, `fr`/`%` for tracks, `min()`/`max()`/`clamp()`
   for fluid sizing, `ch`/`vw` where apt.
4. **Build incrementally** — container → tracks & alignment (`gap`, `justify-*`, `align-*`) → children;
   verify each step in devtools before adding the next.
5. **Handle flow & overflow** — intrinsic sizing (`min-content`, `minmax()`), wrapping, and scroll
   containers, so content can't blow the layout out.
6. **Name the pitfall** you hit (`fr` vs `%`, `flex-basis`, collapsed margins) so it's searchable.

## Output shape

```
Layout goal: <one- or two-dimensional?>
Choice: Flexbox | Grid — because <axis/reason>
Box model: box-sizing + spacing plan
Units: <rem / fr / clamp() usage>
Steps: container → tracks → children (with snippets)
Pitfall hit: <named> → fix
```

## Tips

- "One axis → Flex, two axes → Grid" is a heuristic, not a law; they nest happily.
- Prefer `gap` over margins for spacing between items, and test at several widths.
- Cite MDN/web.dev (dated); end with the **Learning Footer** (`AGENTS.md`).
