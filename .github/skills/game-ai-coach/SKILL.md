---
name: game-ai-coach
description: "Teach game AI from first principles — finite state machines (FSM), behavior trees (selectors, sequences, decorators), A* pathfinding on grids/navmesh with admissible heuristics, and steering behaviors (seek, flee, arrive, flocking). Use for 'how does NPC/enemy AI work', 'state machine vs behavior tree', 'implement A* pathfinding', 'flocking/steering behaviors', or designing believable agent behavior."
argument-hint: "The NPC behavior to design"
---

# Game AI Coach

Teach how an NPC *decides and moves* — from simple states to planned paths — so behavior stays readable and
debuggable, per the teaching and Learning Footer guidance in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner needs enemy/NPC decision-making, navigation, or crowd/flock movement.
- Complements [algorithm-visualizer](../algorithm-visualizer/SKILL.md) and [concept-explainer](../concept-explainer/SKILL.md).

## Procedure

1. **Start with an FSM** — states + guarded transitions (Idle→Patrol→Chase→Attack). Cheap and clear, but
   transition count explodes as states grow.
2. **Scale with a behavior tree** — a tick walks composites (**selector** = fallback, **sequence** =
   and-then) down to leaves (conditions/actions); decorators add retries/cooldowns. More modular than a big FSM.
3. **Pathfind with A\***: expand the node minimizing $f(n)=g(n)+h(n)$ using an **admissible** heuristic
   ($h$ never overestimates — e.g. Manhattan/Euclidean) so the found path is optimal.
4. **Move with steering** — seek/flee/arrive/wander plus separation + alignment + cohesion (Reynolds
   boids) give smooth local motion along the path.
5. **Debug visually** — draw current state, the open/closed sets, and the path; see
   [algorithm-visualizer](../algorithm-visualizer/SKILL.md) to trace A* step by step.

## Output shape

```
Decision: <FSM | behavior tree>
  ```mermaid
  flowchart LR; Idle-->Patrol-->Chase-->Attack; Chase-->Patrol
  ```
Path: A* f=g+h, heuristic=<Manhattan/Euclidean>, admissible? <y/n>
Steering: <seek/arrive/separation…> | Debug: draw path + open set
```

## Tips

- Engine map: Unreal Behavior Trees + Blackboard + EQS on NavMesh (UE5 docs); Unity NavMesh `NavMeshAgent`
  via the AI Navigation package (Unity 6 docs); Godot `NavigationAgent2D/3D` + `AStarGrid2D` (Godot 4 docs).
- Keep the heuristic admissible for optimal A*; inflating `h` is faster but can miss the shortest path.
- Verify APIs/heuristics against engine docs by version; never fabricate. End with the **Learning Footer** (`AGENTS.md`).
