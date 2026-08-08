---
name: shader-coach
description: "Teach shaders and the GPU from first principles — the programmable pipeline (vertex → rasterizer → fragment/pixel → output), what vertex vs fragment shaders compute, MVP-space transforms and UVs, and building one simple effect (scrolling UV or Fresnel rim light). Use for 'how do shaders work', 'vertex vs fragment shader', 'the GPU pipeline', 'write a shader effect', 'HLSL/GLSL/Shader Graph', or learning real-time graphics."
argument-hint: "The visual effect to build"
---

# Shader Coach

Teach what runs *on the GPU* and how a vertex+fragment pair paints a surface — so the learner can author a
first effect, per the teaching and Learning Footer guidance in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants to understand or write a shader/material effect and where it executes.
- Complements [concept-explainer](../concept-explainer/SKILL.md) and [game-optimization-coach](../game-optimization-coach/SKILL.md).

## Procedure

1. **Map the pipeline** — vertices → **vertex shader** (to clip space via the MVP matrix) → rasterizer
   (interpolates across the triangle) → **fragment/pixel shader** (per-pixel color) → depth/blend output.
2. **Vertex shader:** transform position ($clip = P\,V\,M\,pos$) and pass along data (UVs, normals) that
   the rasterizer will interpolate.
3. **Fragment shader:** compute the output color per pixel from interpolated inputs, textures, and
   uniforms (time, light direction).
4. **Build one effect** — e.g. scroll UVs by `time` for flow, or a **Fresnel** rim glow
   $F=(1-\max(0,\,N\cdot V))^{p}$ for edge highlighting.
5. **Mind the cost** — fragment code runs per pixel (millions/frame); push math to the vertex stage or
   precompute where you can (see [game-optimization-coach](../game-optimization-coach/SKILL.md)).

## Output shape

```
Pipeline:
  ```mermaid
  flowchart LR; V[vertices]-->VS[vertex: MVP]-->R[rasterize]-->FS[fragment: color]-->O[depth/blend]
  ```
Vertex: clip = P*V*M*pos; pass UV/normal
Fragment: color = f(UV, tex, light) | Effect: <UV scroll | Fresnel p=..>
```

## Tips

- Engine map: Unity Shader Graph or HLSL/ShaderLab in URP/HDRP (Unity 6 docs); Unreal Material Editor
  nodes + HLSL `Custom` node (UE5 docs); Godot shading language `shader_type spatial`, `vertex()`/`fragment()` (Godot 4 docs).
- Coordinate spaces are the #1 confusion — always know if a vector is in model, world, view, or clip space.
- Verify built-ins/semantics against engine docs by version; never fabricate. End with the **Learning Footer** (`AGENTS.md`).
