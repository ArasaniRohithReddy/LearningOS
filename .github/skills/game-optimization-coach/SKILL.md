---
name: game-optimization-coach
description: "Teach game performance optimization from first principles — profile before guessing (CPU-bound vs GPU-bound), the frame budget (16.7 ms at 60 FPS), cutting draw calls via batching/instancing/atlasing, object pooling to avoid GC spikes, and allocation hygiene. Use for 'my game is slow/laggy', 'low FPS', 'reduce draw calls', 'frame drops/stutter', 'object pooling', 'CPU vs GPU bound', or hitting a frame budget."
argument-hint: "The perf issue or frame-time symptom"
---

# Game Optimization Coach

Teach how to make a frame *fit its budget* — measure first, then fix the real bottleneck — per the
teaching and Learning Footer guidance in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has low/uneven FPS, stutters, or GC spikes and needs a principled fix.
- Complements [code-optimizer](../code-optimizer/SKILL.md) and [complexity-analyzer](../complexity-analyzer/SKILL.md).

## Procedure

1. **Set the budget.** Target FPS ⇒ ms/frame: $t = 1000/\text{fps}$ (60 → 16.7 ms, 30 → 33.3 ms). Every
   system spends part of that slice.
2. **Profile first.** Measure with the engine profiler and decide **CPU-bound vs GPU-bound** before
   changing code — never optimize by guessing (see [complexity-analyzer](../complexity-analyzer/SKILL.md)).
3. **Cut draw calls** (a common CPU/GPU cost) — batch static geometry, **GPU-instance** repeated meshes,
   and atlas textures/materials so the renderer submits fewer, bigger calls.
4. **Pool objects** — reuse bullets/enemies/particles from a pool instead of allocating each spawn, to kill
   GC/allocation hitches.
5. **Tighten hot paths** — cut per-frame allocations, cache repeated lookups, move work off the critical
   path, then **re-profile** to confirm the win.

## Output shape

```
Budget: <fps> → <1000/fps> ms/frame; bound = <CPU | GPU> (measured)
Top costs: | system | ms | fix |
Draw calls: <n> → <n'> via <batching / instancing / atlas>
Pooling: <bullets/particles> | alloc/frame: <before → after>
```

## Tips

- Engine map: Unity Profiler + Frame Debugger, SRP Batcher, GPU instancing, `UnityEngine.Pool.ObjectPool`
  (Unity 6 docs); Unreal Insights + `stat unit`/`stat gpu`, Instanced Static Meshes, Nanite (UE5 docs);
  Godot profiler/monitors + `MultiMesh` (Godot 4 docs).
- "Measure, don't guess": a change that isn't re-profiled is a hope, not an optimization.
- Verify tools/APIs against engine docs by version; never fabricate. End with the **Learning Footer** (`AGENTS.md`).
