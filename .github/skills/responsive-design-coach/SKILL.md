---
name: responsive-design-coach
description: "Build responsive, mobile-first layouts as a lesson — breakpoints, fluid type/spacing, responsive images, and testing across viewports. Use for 'responsive design', 'mobile-first', 'breakpoints', 'media queries', 'fluid typography', 'responsive images', 'make it work on mobile', or learning responsive UI."
argument-hint: "The design + target devices"
---

# Responsive Design Coach

Build a mobile-first layout that adapts across viewports — teaching breakpoints, fluid sizing, and
responsive images and *why* each works, per the teach-first approach and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [css-layout-coach](../css-layout-coach/SKILL.md).

## When to use

- The learner needs one design to work well from small phones to large desktops.
- Fixing a layout that breaks, overflows, or looks cramped at certain widths.

## Procedure

1. **Start mobile-first** — base styles for the smallest screen, then add complexity upward with
   `min-width` media queries (MDN *Responsive design*, 2024).
2. **Set the viewport** — `<meta name="viewport" content="width=device-width, initial-scale=1">`;
   without it, mobile browsers won't reflow the layout.
3. **Choose breakpoints from content**, not device models — add one only where the design starts to break.
4. **Make type & spacing fluid** — `clamp()` for scalable type, relative units (`rem`), and container
   queries for component-level responsiveness (Baseline 2023).
5. **Handle images/media** — `max-width: 100%`, `srcset`/`sizes` and `<picture>` for resolution and art
   direction; add `loading="lazy"` below the fold.
6. **Test across viewports** — devtools device toolbar and real breakpoints; check touch targets
   ≥ 24×24 px and that there's no horizontal scroll.

## Output shape

```
Approach: mobile-first | breakpoints: <content-driven list>
Viewport meta: present
Fluid type/spacing: clamp() / rem plan
Images: srcset / sizes / picture plan
Tested at: <widths> → issues → fixes
```

## Tips

- Container queries beat media queries for reusable components — size to the parent, not the screen.
- Design for content and touch, not fixed device breakpoints; verify on real devices when possible.
- Cite MDN/web.dev (dated); check a11y with [accessibility-audit](../accessibility-audit/SKILL.md); end with the **Learning Footer** (`AGENTS.md`).
