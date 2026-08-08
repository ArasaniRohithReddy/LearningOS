---
name: animation-coach
description: "Add web animations and transitions that are smooth and accessible as a lesson — CSS vs JS, compositor-only properties, prefers-reduced-motion, and performance. Use for 'web animation', 'CSS transitions', 'smooth/janky animation', 'prefers-reduced-motion', 'animate performantly', 'CSS vs JS animation', or learning web animation."
argument-hint: "The animation goal"
---

# Animation Coach

Add motion that's smooth and respectful — choosing CSS vs JS, animating only cheap properties, and
honouring reduced-motion — teaching why the compositor matters, per the teach-first approach and Learning
Footer in [`AGENTS.md`](../../../AGENTS.md). Pairs with [web-perf-audit](../web-perf-audit/SKILL.md).

## When to use

- The learner wants an animation/transition that feels smooth and doesn't harm performance or accessibility.
- Diagnosing jank, dropped frames, or motion that ignores user preferences.

## Procedure

1. **Start from intent** — motion should guide attention or show cause/effect, not decorate; keep it short
   (~200–300 ms) and purposeful (web.dev *Animations*, 2023).
2. **Animate compositor-only properties** — prefer `transform` and `opacity` (GPU-composited, skipping
   layout/paint); avoid animating `width`, `top`, `box-shadow` (web.dev *Animations and performance*, 2023).
3. **CSS vs JS** — CSS transitions/keyframes for state changes; the Web Animations API (`element.animate()`)
   for dynamic, sequenced, or interruptible motion; a library only when justified (MDN *WAAPI*, 2024).
4. **Respect `prefers-reduced-motion`** — wrap non-essential motion in
   `@media (prefers-reduced-motion: no-preference)` and provide a reduced fallback (SC 2.3.3; MDN, 2024).
5. **Promote sparingly** — use `will-change` only where you've measured a win; overuse costs memory and can
   slow things down.
6. **Measure** — check for dropped frames in DevTools *Performance*; keep the main thread free while the
   animation runs.

## Output shape

```
Goal: <what the motion communicates>
Cheap properties only? transform/opacity — yes/no
Technique: CSS transition | keyframes | WAAPI | library — because …
Reduced motion: fallback provided ✓
Duration/easing: <~250ms, ease-out>
Measured: <fps, no jank>
```

## Tips

- To animate layout smoothly, use FLIP — animate `transform`, not the layout property itself.
- Reduced motion isn't "no motion" — swap large movement for a subtle fade.
- `transform`/`opacity` stay off the main thread; cite web.dev/MDN (dated); pair [web-perf-audit](../web-perf-audit/SKILL.md); end with the **Learning Footer** (`AGENTS.md`).
