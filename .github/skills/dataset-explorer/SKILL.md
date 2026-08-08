---
name: dataset-explorer
description: "Guide exploratory data analysis (EDA) on a dataset as a lesson: understand columns and types, distributions, missingness, outliers, correlations, class balance, and target leakage — proposing the right visuals and next steps. Use for 'explore this dataset', 'EDA', 'what's in this data', 'is my data any good', 'find outliers/missing values', 'check for leakage before modeling', or 'what should I plot'. Teaches you to interrogate data, not just describe it."
argument-hint: "The dataset (schema/sample) + the question"
---

# Dataset Explorer

Interrogate a dataset so the learner **understands** it before modeling — following the teaching and
honesty principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has a new dataset and a question, and needs a structured first look.
- Precedes modeling and `eval-designer`; pairs with `concept-explainer` for any unfamiliar statistic.

## Procedure

1. **Restate the question & unit of analysis.** What does one row represent? What's the target, if any?
2. **Profile columns & types.** Per column: type (numeric/categorical/date/text), example values, cardinality,
   units. Flag mis-typed columns (IDs as numbers, dates as strings).
3. **Distributions.** Summaries (mean/median/quantiles) *and* a plot — Anscombe's quartet shows stats alone
   mislead (Anscombe, *Graphs in Statistical Analysis*, 1973). Histograms/box plots per feature.
4. **Missingness.** Quantify per column; ask *why* missing (MCAR/MAR/MNAR) before choosing drop vs. impute.
5. **Outliers.** Detect (IQR/z-score) and judge: data error vs. real rare event — don't delete blindly.
6. **Relationships.** Correlations/crosstabs vs. the target; watch confounders and that correlation ≠ cause.
7. **Leakage check.** Hunt features that encode the target or the future (Kaufman et al., *Leakage in Data
   Mining*, ACM TKDD, 2012) — the most common cause of "too good to be true" models.
8. **Propose next steps & visuals.** End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Question & unit of analysis: …
Column profile: name | type | example | %missing | cardinality | note
Findings: distributions, missingness, outliers, correlations (with plots to make)
Leakage & data-quality risks: …
Recommended next steps: cleaning, features, the model/eval to try
Learning Footer
```

## Tips

- Always plot — descriptive stats hide bimodality, skew, and outliers (Tukey, *Exploratory Data Analysis*, 1977).
- One suspiciously predictive feature? Assume leakage until proven otherwise.
- Note sampling/collection bias: a dataset answers *its* population, not necessarily yours.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
