---
name: game-physics-coach
description: "Teach game physics from first principles — numerical integration (explicit vs semi-implicit Euler, Verlet), broad/narrow-phase collision detection (AABB, SAT), impulse-based collision response with restitution and friction, and numerical stability. Use for 'how does game physics work', 'Euler vs Verlet', 'my physics is jittery/explodes', 'tunneling through walls', 'bounce/restitution', or building a stable custom simulation."
argument-hint: "The mechanic or physics behavior to build"
---

# Game Physics Coach

Teach how a simulation turns forces into motion and resolves contacts — so the learner builds *stable*
mechanics, per the teaching and Learning Footer guidance in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner is building movement/collisions and sees jitter, tunneling, or energy "explosions".
- Complements [game-loop-coach](../game-loop-coach/SKILL.md) and [complexity-analyzer](../complexity-analyzer/SKILL.md).

## Procedure

1. **Integrate.** From $a=F/m$, advance velocity then position. **Semi-implicit (symplectic) Euler**
   $v \mathrel{+}= a\,\Delta t;\; x \mathrel{+}= v\,\Delta t$ is stable; **explicit** Euler injects energy.
2. **Or use Verlet** for constraints/cloth/ropes: $x_{n+1}=2x_n-x_{n-1}+a\,\Delta t^2$ (velocity is
   implicit), which is more stable under stiff constraints.
3. **Detect in two phases** — *broad* (AABB / grid / spatial hash) prunes candidate pairs; *narrow* (SAT
   for convex polygons, circle/sphere tests) finds the contact **normal** and penetration depth.
4. **Respond.** Separate shapes along the normal by the penetration, then apply an impulse; restitution
   $e\in[0,1]$ sets bounciness and friction opposes tangential motion.
5. **Stabilize.** Use a **fixed timestep**, substep fast bodies (or continuous detection) to stop
   tunneling, and clamp `dt`: smaller `dt` = more stable but more cost.

## Output shape

```
Integrator: <semi-implicit Euler | Verlet> — update: v+=a*dt; x+=v*dt
Collision: broad <AABB/grid> → narrow <SAT/circle> → normal n, depth d
Response: separate by d*n; impulse; restitution e=<..>, friction=<..>
Stability: fixed dt=<1/60>, substeps=<n> | symptom→fix: <tunneling→CCD>
```

## Tips

- Engine map: Unity `Rigidbody` on PhysX, stepped in `FixedUpdate` (Unity 6 docs); Unreal Chaos Physics,
  default since UE5, with substepping (UE5 docs); Godot `RigidBody2D/3D` on Godot Physics / Jolt (Godot 4 docs).
- Explicit Euler + a large `dt` is the classic "explosion"; switch to semi-implicit and shrink `dt` first.
- Verify formulas and engine defaults by version; never fabricate. End with the **Learning Footer** (`AGENTS.md`).
