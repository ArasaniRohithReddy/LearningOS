---
name: pandas-lab
description: "Hands-on lab on pandas fundamentals: build a Series and DataFrame, select with loc/iloc, filter with boolean masks, and replace Python loops with vectorized operations — learning by running real code. Use for 'pandas lab', 'practice pandas', 'loc vs iloc', 'boolean filtering', 'vectorize this loop', 'iterrows is slow', or a guided hands-on exercise on pandas basics. Teaches by doing, not just reading."
argument-hint: "The dataset/task"
---

# pandas Lab

A guided, hands-on lab that builds pandas fluency by writing and running code — following the
teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`dataset-explorer`](../dataset-explorer/SKILL.md) and [`worked-example`](../worked-example/SKILL.md).

## When to use

- The learner wants to *practice* pandas selection, filtering, and vectorization, not just read about it.
- Before EDA or cleaning, to get comfortable with `Series`/`DataFrame` mechanics.

## Procedure

1. **Concept first.** A `Series` is a 1-D labeled array; a `DataFrame` is a 2-D table of aligned Series
   sharing one index (McKinney, *Data Structures for Statistical Computing in Python*, SciPy 2010).
2. **Frame the task & load data.** State the question; build `df = pd.DataFrame({...})` or `pd.read_csv(...)`;
   inspect with `df.head()`, `df.dtypes`, `df.shape`.
3. **Exercise — select.** Pull rows/columns with **`.loc[]`** (labels) and **`.iloc[]`** (integer positions),
   then a scalar via `.at`/`.iat` (pandas User Guide: *Indexing and selecting data*, pandas.pydata.org).
4. **Exercise — filter.** Build a boolean mask (`df["x"] > 0`), combine with `& | ~` and parentheses,
   and select with `df.loc[mask, cols]`.
5. **Exercise — vectorize.** Replace a `for`/`iterrows()` loop with a column expression (`df["a"] * df["b"]`);
   time both to feel the speedup.
6. **Reference solution sketch.** Show the idiomatic one-liners beside the loop they replace.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Task: … | Data: shape + dtypes
Select: df.loc[rows, cols]  vs  df.iloc[i, j]
Filter: mask = (df["a"] > 0) & (df["b"] == "x") → df.loc[mask]
Vectorized: df["c"] = df["a"] * df["b"]   # replaces the loop
Timing: loop vs vectorized (ms)
Learning Footer
```

## Tips

- Prefer `.loc`/`.iloc` over chained indexing (`df[m]["c"] = …`) — it triggers `SettingWithCopyWarning`.
- Reach for vectorized ops or `.map`/`.groupby` before `apply`; use `iterrows()` only as a last resort.
- `.loc` is label-based and end-inclusive; `.iloc` is position-based and end-exclusive — don't mix them up.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
