---
name: data-cleaning-lab
description: "Hands-on lab on cleaning a messy DataFrame: quantify and handle missing values, fix wrong dtypes, drop duplicates, detect outliers, and normalize inconsistent strings — learning by running real code on dirty data. Use for 'data cleaning lab', 'practice cleaning', 'handle missing values', 'fix dtypes', 'drop duplicates', 'detect outliers', 'normalize strings', or a guided hands-on cleaning exercise. Teaches judgment, not blind fixes."
argument-hint: "The messy data"
---

# Data Cleaning Lab

A guided, hands-on lab that turns a dirty DataFrame into trustworthy data — explaining every fix, per the
teaching principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`dataset-explorer`](../dataset-explorer/SKILL.md) and [`data-quality-checker`](../data-quality-checker/SKILL.md).

## When to use

- The learner has messy real-world data and needs to practice principled cleaning, not one-off hacks.
- Between EDA and feature engineering, to make columns correct and consistent.

## Procedure

1. **Concept first.** Cleaning is *decisions with reasons*: every drop/fill/convert changes the data, so
   record why. `NaN` is a float sentinel; pandas also uses `NaT` for datetimes and `pd.NA` for nullable dtypes.
2. **Profile the mess.** `df.isna().sum()`, `df.dtypes`, `df.duplicated().sum()`, `df.describe(include="all")`.
3. **Exercise — missing & dtypes.** Impute with a reason (`fillna(median)`, forward-fill) or drop; fix types
   with `pd.to_numeric`, `pd.to_datetime`, `.astype("category")` (pandas User Guide: *Working with missing data*).
4. **Exercise — duplicates & outliers.** Remove dups with `drop_duplicates(subset=…)`; flag outliers by IQR
   (`Q1-1.5·IQR`, `Q3+1.5·IQR`) and *judge* data error vs. real rare event before deleting.
5. **Exercise — strings.** Normalize with `.str.strip().str.lower()`, then map spelling variants to one label.
6. **Reference solution sketch.** Show the ordered cleaning pipeline with a one-line reason per step.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Before: rows, %missing per col, dtypes, #dups
Missing: col → fill(reason) | drop(reason)
Dtypes: col → to_numeric / to_datetime / category
Duplicates: subset=[…] → removed n
Outliers: IQR bounds → flagged (kept / removed + why)
Strings: strip+lower+map → canonical labels
After: clean shape + dtypes | Learning Footer
```

## Tips

- `fillna(0)` is not neutral — it distorts means and correlations; impute with a defensible statistic.
- Clean on a copy and keep the raw file; log each transform so results stay reproducible.
- Object dtype often hides mixed types — convert early so later math and joins behave.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
