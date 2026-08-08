---
name: algorithm-visualizer
description: "Explain an algorithm or data structure by tracing it step by step on a concrete input — state the core idea and loop invariant, walk the execution with a step table and/or a Mermaid diagram, then give complexity and when to use it. Use for 'how does X work', 'trace this algorithm', 'visualize binary search / Dijkstra / quicksort', or understanding data structures by watching them run."
argument-hint: "Algorithm or data structure + example input"
---

# Algorithm Visualizer

Make an algorithm *visible* by tracing it on real input — teaching the idea and the invariant, per the
visual-aids guidance and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner can read the code but doesn't yet *see* how it works.
- Complements [concept-explainer](../concept-explainer/SKILL.md) and [complexity-analyzer](../complexity-analyzer/SKILL.md).

## Procedure

1. **State the idea in one line** and the **invariant** that holds each iteration — this is the key to
   *why* the algorithm is correct.
2. **Pick a small concrete input** and trace it in a **step table**: each row is one step, showing the
   state that changes (pointers, stack, visited set, partial result).
3. **Draw it** with a Mermaid diagram where structure helps (tree/graph traversal, recursion, linked
   list, heap).
4. **Give complexity** — best/average/worst time and space — and tie each back to the trace.
5. **Say when to use it** and its trade-off vs. one alternative (e.g., BFS vs. DFS, quicksort vs.
   mergesort).

## Output shape

```
Idea: <one line> | Invariant: <what stays true each step>
Input: <small example>
Step table: | step | action | state | note |
Diagram:
  ```mermaid
  graph TD; A-->B; B-->C
  ```
Complexity: time <best/avg/worst>, space <…>
Use when: … | vs <alternative>: …
```

## Tips

- Choose input large enough to show the pattern, small enough to trace by hand.
- Highlight the exact moment the invariant is maintained — that's the "aha".
- Never fabricate step counts; trace faithfully. End with the **Learning Footer** (`AGENTS.md`).
