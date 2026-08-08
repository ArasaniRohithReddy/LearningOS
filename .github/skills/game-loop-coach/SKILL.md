---
name: game-loop-coach
description: "Teach the game loop from first principles — the update-vs-render split, a fixed-timestep accumulator, delta-time (dt) motion, frame-rate independence, and determinism. Use for 'how does the game loop work', 'fixed vs variable timestep', 'why is my game frame-rate dependent', 'jittery/spiral-of-death movement', 'FixedUpdate vs Update', or making a simulation reproducible."
argument-hint: "The game or game-loop symptom to reason about"
---

# Game Loop Coach

Teach *why* a game advances the way it does — input → update → render — so the learner can build a
frame-rate-independent, deterministic loop, per the teaching and Learning Footer guidance in
[`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner's movement changes with FPS, stutters, or physics "explodes" at low frame rates.
- Complements [concept-explainer](../concept-explainer/SKILL.md) and [game-physics-coach](../game-physics-coach/SKILL.md).

## Procedure

1. **Name the three phases** — process input, **update** (advance the simulation), **render** (draw the
   latest state). Stress that update and render need not run at the same rate.
2. **Delta time.** Scale motion by elapsed seconds: $x \mathrel{+}= v\,\Delta t$. A purely variable loop
   makes physics *non-deterministic*, and a big `dt` lets fast bodies tunnel through walls.
3. **Fixed timestep.** Accumulate real time and step the sim in constant `dt` chunks; render interpolates
   the leftover — frame-rate independent and reproducible.
4. **Guard the spiral of death** — clamp the accumulator / max frame time so one slow frame can't queue
   ever more catch-up steps.
5. **Determinism.** Same inputs + fixed `dt` + fixed operation order ⇒ same result (lockstep, replays).
6. **Map to your engine** (see Tips) and name which callback is fixed vs per-frame.

## Output shape

```
Phases: input → update(dt) → render
Loop:
  ```mermaid
  flowchart LR; I[input]-->A[accumulate dt]-->S[fixed steps]-->R[render + interpolate]
  ```
Fixed dt: <e.g. 1/60 s> | interp alpha = acc / dt
Determinism: fixed dt + fixed order | pitfall: <spiral / dt-spike>
```

## Tips

- Engine map: Unity `FixedUpdate`+`Time.fixedDeltaTime` vs `Update`+`Time.deltaTime` (Unity 6 docs); Unreal
  `Tick(DeltaSeconds)` + fixed frame rate / physics substepping (UE5 docs); Godot `_physics_process(delta)`
  vs `_process(delta)`, `physics_ticks_per_second` default 60 (Godot 4 docs).
- Sample input once per frame and feed it into the fixed step; don't poll a per-frame source inside it.
- Verify against engine docs by version; never fabricate timings. End with the **Learning Footer** (`AGENTS.md`).
