---
name: tech-comparison
description: "Build a rigorous, weighted decision matrix comparing technologies or options — define criteria for the learner's context, score each option against cited evidence, and give a recommendation with caveats and a reversal trigger. Use for 'X vs Y', 'which database/framework/cloud should I pick', 'compare these options', 'decision matrix', or choosing a tool objectively."
argument-hint: "Options to compare + context/criteria"
---

# Tech Comparison

Turn "X vs. Y" into a defensible decision — weighted criteria, cited scores, clear recommendation —
following the source discipline in [`AGENTS.md`](../../../AGENTS.md). Complements
[research-brief](../research-brief/SKILL.md).

## When to use

- The learner must choose between tools/frameworks/services and wants a rigorous basis.
- Avoiding hype-driven or résumé-driven decisions.

## Procedure

1. **Frame the decision:** the job to be done, hard constraints, and who lives with the result.
2. **Define & weight criteria** for *this* context (not generic scores) — e.g., fit, performance,
   cost/TCO, ecosystem, operability, learning curve, licensing, lock-in.
3. **Shortlist** 2–4 real options; drop the rest with a one-line reason.
4. **Score** each option per criterion (e.g., 1–5) using **cited, dated** evidence; mark unknowns.
5. **Compute** weighted totals, then sanity-check against gut feel and reversibility.
6. **Recommend** one, state caveats, and give a **reversal trigger** (what would change the call).

## Output shape

```
Decision & context: … | constraints: …
Matrix:
  | Criterion (weight) | Opt A | Opt B | Opt C |
  | Cost/TCO (0.3)     |  4    |  3    |  5    |
  | Weighted total     |  …    |  …    |  …    |
Evidence: <claim> [Source, official/blog, YYYY-MM-DD, link]
Recommendation: <pick> — because …
Caveats & reversal trigger: …
```

## Tips

- Weights encode values — make them explicit and let the learner adjust them.
- One benchmark ≠ your workload; cite sources and flag vendor-supplied numbers.
- Spend the most rigor on one-way-door (hard-to-reverse) choices.
- End with the **Learning Footer** (`AGENTS.md`).
