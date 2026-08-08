---
name: concept-explainer
description: "Explain any topic from first principles with analogies, worked examples, a diagram, and a check for understanding, adapted to the learner's level. Use for 'explain X', 'how does Y work', 'ELI5', 'go deeper on Z', 'help me understand', or teaching any technical or conceptual topic. Produces a structured lesson, not a wall of text."
argument-hint: "Topic to explain (+ optional level: beginner / intermediate / advanced)"
---

# Concept Explainer

Teach one concept so the learner *understands* it and can reproduce the reasoning — following the
teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner asks to understand a topic, term, algorithm, pattern, or system.
- A specialist agent needs to teach a sub-concept clearly before moving on.

## Procedure

1. **Gauge the level.** Use the stated level, or infer from the question. If it changes the depth
   materially and is unclear, ask one quick question; otherwise pick a sensible default and proceed.
2. **First principles.** Start from what the learner already knows and build up. State the core idea
   in one sentence before any detail.
3. **Analogy.** Give one concrete real-world analogy — and name where the analogy breaks down.
4. **Worked example.** Show a minimal, concrete example (code, math, or a walked-through scenario).
   Build from the simplest case, then add one layer of complexity.
5. **Why & trade-offs.** Explain *why* it works and when to use it vs. alternatives.
6. **Visualize.** Add a Mermaid diagram, table, or mind map when it clarifies structure or flow.
7. **Check understanding.** Pose 1–2 quick questions or a "predict the output" prompt (Socratic).
8. **Footer.** End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
In one sentence: <the core idea>
Build-up:        first principles → analogy → example → why/trade-offs
Picture:         diagram/table if helpful
Check yourself:  1–2 questions
Learning Footer
```

## Tips

- Name the concept precisely (and its aliases) so the learner can search it later.
- Prefer official docs for facts; cite versions/dates; never invent APIs.
- Depth over breadth — teach the one thing well, then point to the next.
