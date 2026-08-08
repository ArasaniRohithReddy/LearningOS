---
name: architecture-diagram
description: "Produce a clear architecture diagram (Mermaid; C4-style context/container/component levels) for a system — identify components, data flows, and trust boundaries, then explain the design choices and trade-offs. Use for 'draw the architecture', 'diagram this system', 'C4 diagram', 'show the components and data flow', or visualizing a design before or after a system-design drill."
argument-hint: "System to diagram + level (context/container/component)"
---

# Architecture Diagram

Turn a system into a clear, layered picture — components, data flows, and boundaries — following the
visual-aids and teaching guidance in [`AGENTS.md`](../../../AGENTS.md). Complements
[system-design-drill](../system-design-drill/SKILL.md).

## When to use

- The learner needs to *see* and reason about a system's structure, not just read prose.
- Documenting a design, onboarding to a codebase, or prepping an architecture review.

## C4 levels (pick the zoom)

| Level | Shows | Audience |
| --- | --- | --- |
| Context (L1) | your system + users + external systems | everyone |
| Container (L2) | apps, services, datastores, and their protocols | engineers |
| Component (L3) | modules/responsibilities inside one container | that team |

## Procedure

1. **Scope & level:** one system, one C4 level, and the audience. Don't mix levels in a view.
2. **Elements:** list actors, systems/containers, datastores, and external dependencies.
3. **Data flows:** direction, sync vs. async, and protocol — label every edge.
4. **Boundaries:** draw trust/network/process boundaries as Mermaid `subgraph`s.
5. **Render** in Mermaid; keep ≤ ~12 nodes per view — split levels rather than cram.
6. **Explain choices & trade-offs:** coupling, scaling limits, cost, and failure domains.

## Output shape

```
Scope & level: <system> — context | container | component
Diagram:
  ```mermaid
  flowchart LR
    User --> API
    subgraph Boundary
      API --> Svc --> DB[(Store)]
    end
  ```
Legend: nodes / edges (sync|async) / boundaries
Design notes: why each component; trade-offs & failure modes
```

## Tips

- One concern per diagram; use consistent shapes (datastore = cylinder, queue = a labeled node).
- Show the boundary that matters for the question — pair with [threat-model](../threat-model/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
