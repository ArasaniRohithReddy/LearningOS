---
name: data-wrangling-lab
description: "Hands-on lab on reshaping and combining data: merge/join on keys, concat along an axis, pivot wide and melt long, and apply tidy-data principles — learning by running real code. Use for 'data wrangling lab', 'practice merge/join', 'concat vs merge', 'pivot vs melt', 'wide to long', 'tidy data', or a guided hands-on reshaping exercise. Teaches the reshape, and why it's correct."
argument-hint: "The reshape need"
---

# Data Wrangling Lab

A guided, hands-on lab on combining and reshaping DataFrames into a tidy form — explaining each move, per
the teaching principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`groupby-aggregation-lab`](../groupby-aggregation-lab/SKILL.md) and [`data-cleaning-lab`](../data-cleaning-lab/SKILL.md).

## When to use

- The learner needs to join tables or switch between wide and long layouts and get it right.
- Preparing data for grouping, plotting, or modeling that expects a tidy shape.

## Procedure

1. **Concept first — tidy data.** Each variable is a column, each observation a row, each unit a table
   (Wickham, *Tidy Data*, J. Stat. Software 59(10), 2014). Reshaping moves data toward that ideal.
2. **Combine — concat.** Stack same-schema frames with `pd.concat([...], axis=0)` (rows) or `axis=1` (columns).
3. **Exercise — merge/join.** Join on keys with `pd.merge(l, r, on=…, how="inner|left|right|outer")`; pass
   `validate="one_to_many"` and `indicator=True` to catch bad keys (pandas User Guide: *Merge, join, concatenate*).
4. **Exercise — pivot/melt.** Widen with `pivot_table(index, columns, values, aggfunc)`; go long with
   `melt(id_vars, value_vars)`; predict the output shape before you run it.
5. **Reference solution sketch.** Show the merge, then the reshape, checking `df.shape` after each.
6. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Goal: … | Inputs: tables + keys/shapes
Concat: axis=0 rows | axis=1 columns
Merge: on=[…], how=…, validate=…  → rows before/after
Reshape: pivot_table(…) wide  |  melt(…) long
Check: shape + no unexpected row explosion
Tidy result + Learning Footer
```

## Tips

- Many-to-many merges multiply rows — always check `df.shape` and use `validate=` to assert intent.
- Mismatched key dtypes or stray whitespace silently drop rows; clean keys before joining.
- `pivot` errors on duplicate index/column pairs — use `pivot_table` with an `aggfunc` to aggregate them.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
