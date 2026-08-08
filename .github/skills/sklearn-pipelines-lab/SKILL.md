---
name: sklearn-pipelines-lab
description: "Hands-on lab: compose a scikit-learn Pipeline with ColumnTransformer so preprocessing fits inside cross-validation and never leaks the test set. Use for 'pipeline lab', 'ColumnTransformer', 'prevent data leakage', 'preprocess numeric and categorical columns', 'make_pipeline', or a guided hands-on exercise on leak-proof workflows. Teaches by doing, not just reading."
argument-hint: "The workflow"
---

# scikit-learn Pipelines Lab

A guided, hands-on lab that wires preprocessing and a model into one scikit-learn `Pipeline` +
`ColumnTransformer` — the structural cure for leakage — following the teach-by-doing principles in
[`AGENTS.md`](../../../AGENTS.md). Pairs with
[`feature-engineering-coach`](../feature-engineering-coach/SKILL.md) and
[`model-selection-advisor`](../model-selection-advisor/SKILL.md).

## When to use

- The learner wants to *practice* building a leak-proof workflow, not just read about leakage.
- Whenever numeric and categorical columns need different transforms before a model.

## Procedure

1. **Concept first.** A `Pipeline` chains transforms + a final estimator so `.fit` learns parameters on
   train and reuses them on `.predict` — one object that can't leak (Pedregosa et al., *Scikit-learn*, JMLR 12, 2011).
2. **Split by column type.** List numeric vs. categorical columns; each needs different preprocessing.
3. **Build the ColumnTransformer.** `ColumnTransformer([("num", StandardScaler(), num), ("cat",
   OneHotEncoder(handle_unknown="ignore"), cat)])` (User Guide §6.1 *Pipelines and composite estimators*, scikit-learn.org).
4. **Assemble the Pipeline.** `Pipeline([("prep", ct), ("model", LogisticRegression())])`, or `make_pipeline`;
   call `.fit(X_train, y_train)` once.
5. **Exercise — prove no leakage.** Run `cross_val_score(pipe, X, y)`; the scaler/encoder re-fit inside every
   fold, so each validation split stays untouched by the others.
6. **Reference solution sketch.** Show ColumnTransformer → Pipeline → `cross_val_score` end to end.
7. **Pitfalls & Learning Footer.** Contrast with fitting a scaler *before* the split (leakage), then close with
   the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Columns: numeric [...] | categorical [...]
Prep: ColumnTransformer(num→StandardScaler, cat→OneHotEncoder)
Pipe: Pipeline([("prep", ct), ("model", clf)])
Fit/CV: cross_val_score(pipe, X, y) — transforms refit per fold
Leakage check: nothing fit on the full dataset
Learning Footer
```

## Tips

- Put *every* fitted transform inside the Pipeline — a scaler fit before `train_test_split` leaks the test set.
- Use `OneHotEncoder(handle_unknown="ignore")` so unseen categories at test time don't crash the transform.
- `set_output(transform="pandas")` (scikit-learn 1.2+, 2022) keeps column names for readable, debuggable steps.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
