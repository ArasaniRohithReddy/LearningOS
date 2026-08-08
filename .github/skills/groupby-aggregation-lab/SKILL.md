---
name: groupby-aggregation-lab
description: "Hands-on lab on pandas groupby: split-apply-combine, aggregate with agg, reshape with transform, drop groups with filter, and group by multiple keys — learning by running real code. Use for 'groupby lab', 'practice groupby', 'split-apply-combine', 'agg vs transform', 'named aggregation', 'multi-key groupby', or a guided hands-on aggregation exercise. Teaches the mental model, not just syntax."
argument-hint: "The aggregation"
---

# GroupBy Aggregation Lab

A guided, hands-on lab on pandas `groupby` using the split-apply-combine model — explaining each step, per
the teaching principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`data-wrangling-lab`](../data-wrangling-lab/SKILL.md) and [`worked-example`](../worked-example/SKILL.md).

## When to use

- The learner needs per-group summaries or group-wise features and wants the model, not copied snippets.
- After wrangling, to answer "per category" questions accurately.

## Procedure

1. **Concept first.** Split-apply-combine: split rows into groups, apply a function, combine results
   (Wickham, *The Split-Apply-Combine Strategy for Data Analysis*, J. Stat. Software 40(1), 2011).
2. **Split.** `g = df.groupby("key")` is lazy — nothing computes until you aggregate.
3. **Exercise — aggregate.** Reduce each group with named agg: `g.agg(avg=("x","mean"), n=("x","size"))`
   (pandas User Guide: *Group by: split-apply-combine*, pandas.pydata.org).
4. **Exercise — transform vs filter.** `transform` returns a **same-shape** result (e.g., group z-score);
   `filter` keeps or drops **whole groups** by a predicate — contrast their shapes.
5. **Exercise — multi-key.** Group by `["a","b"]`, then `.reset_index()` to flatten the resulting `MultiIndex`.
6. **Reference solution sketch.** Show agg, transform, and a multi-key summary side by side.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Question: … per <key(s)>
Split: df.groupby([keys])
Aggregate: .agg(name=(col, func), …)  → one row per group
Transform: .transform("mean")  → aligned to original rows
Filter: .filter(lambda g: len(g) > k)  → subset of rows
Flatten: .reset_index()
Result + Learning Footer
```

## Tips

- `agg` collapses to one row per group; `transform` keeps the original shape — pick by the shape you need.
- `groupby` drops rows with `NaN` keys by default — pass `dropna=False` to keep them.
- Prefer built-in aggregations over `apply` with a Python function; they're far faster on large data.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
