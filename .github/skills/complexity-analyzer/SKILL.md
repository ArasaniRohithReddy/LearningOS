---
name: complexity-analyzer
description: "Analyze and teach time and space complexity — derive Big-O from the code, show the growth intuition with KaTeX math, identify the dominant term and the bottleneck, and compare alternatives. Use for 'what's the Big-O', 'analyze complexity', 'is this efficient', 'why is this slow', or learning to reason about how code scales."
argument-hint: "Code or algorithm to analyze"
---

# Complexity Analyzer

Derive complexity *from first principles* so the learner can do it themselves — teaching the math, per
the visual-aids and Learning Footer guidance in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants to know how code scales, or *why* one approach beats another.
- Complements [algorithm-visualizer](../algorithm-visualizer/SKILL.md) and [code-review-coach](../code-review-coach/SKILL.md).

## Procedure

1. **Count work per construct:** sequential blocks add, nested loops multiply, recursion becomes a
   recurrence. State the input size $n$ each part refers to.
2. **Build the expression**, then **drop constants and lower-order terms** to find the dominant term:
   e.g. $T(n)=3n^2+5n+7=\Theta(n^2)$.
3. **Solve any recurrences** (Master Theorem): e.g. $T(n)=2T(n/2)+O(n)=\Theta(n\log n)$.
4. **Analyze space too** — extra allocations, call-stack depth, memoization tables.
5. **Show growth intuition** (a table of $n$ vs. steps) and name the **bottleneck**; compare one faster
   alternative and its trade-off (time vs. space, readability).

## Output shape

```
Per construct: <loop/recursion → cost>
Time: $T(n)=…$ → dominant term → $O(…)$
Space: $O(…)$  (why)
Growth: | n | ops |  (e.g. 10 / 1e3 / 1e6)
Bottleneck: … | Faster alternative: … (trade-off)
```

## Tips

- Distinguish best/average/worst and amortized cost — state which you mean.
- Big-O hides constants: for small $n$ a "worse" algorithm can win; say so.
- Verify claims against the actual code; never guess. End with the **Learning Footer** (`AGENTS.md`).
