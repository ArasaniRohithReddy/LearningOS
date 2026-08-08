---
name: knowledge-graph
description: "Build and query a personal knowledge graph of concepts and how they connect (prerequisites, related, part-of, applied-in), stored as linked Markdown notes and/or a Mermaid diagram, to sequence learning and surface connections. Use for 'build a knowledge graph', 'connect these concepts', 'what are the prerequisites for X', 'what builds on Y', or 'map my knowledge'."
argument-hint: "Topic/area to map, or concepts to connect"
---

# Knowledge Graph

Turn scattered concepts into a connected map so the learner can sequence study and see the big
picture — following [`AGENTS.md`](../../../AGENTS.md) and the memory model in
[`docs/Memory.md`](../../../docs/Memory.md).

## When to use
- The learner wants to see how concepts relate, or find prerequisites/next steps.
- Building durable structure across many lessons.

## Procedure
1. Identify the **concepts** in scope and their **relationships**: `prerequisite-of`, `related-to`,
   `part-of`, `applied-in`.
2. Represent the graph two ways:
   - **Linked notes**: each concept is a note with a `## See also` section of relative links.
   - **Diagram**: a Mermaid `graph` showing edges (label the edge type).
3. Support **queries**: "prerequisites of X", "what builds on X", "shortest path from A to B",
   "gaps I haven't covered".
4. **Update** the graph as the learner completes topics (mark learned; reveal next best node).

## Output shape
````
```mermaid
graph LR
  A[Prereq] --> B[Concept]
  B --> C[Applied in ...]
```
````
Then: prerequisites list · what to learn next · any gaps.

## Tips
- Keep each node atomic; one concept per note.
- Use the graph to drive `learning-roadmap` ordering and to pick the "Next topic" for the Learning
  Footer. Don't invent relationships you can't justify. End with the **Learning Footer** (`AGENTS.md`).
