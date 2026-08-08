---
name: sklearn-preprocessing-lab
description: "Hands-on lab: preprocess features in scikit-learn the right way — scale numerics (StandardScaler), encode categoricals (OneHotEncoder), and impute missing values (SimpleImputer) fit on training data only. Use for 'preprocessing lab', 'StandardScaler', 'OneHotEncoder', 'SimpleImputer', 'handle missing values', 'scaling vs normalization', or a guided hands-on exercise on feature preparation. Teaches by doing, not just reading."
argument-hint: "The features"
---

# scikit-learn Preprocessing Lab

A guided, hands-on lab that scales, encodes, and imputes features with scikit-learn transformers fit on
train only — the leak-free way — following the teach-by-doing principles in
[`AGENTS.md`](../../../AGENTS.md). Pairs with
[`feature-engineering-coach`](../feature-engineering-coach/SKILL.md) and
[`sklearn-pipelines-lab`](../sklearn-pipelines-lab/SKILL.md).

## When to use

- The learner wants to *practice* correct scaling/encoding/imputation, not just read the transformer list.
- Before modeling; the transforms here belong inside a `Pipeline` (`sklearn-pipelines-lab`).

## Procedure

1. **Concept first.** Estimators expect numeric, complete, comparable inputs; preprocessing supplies that via
   `fit` (learn stats on train) then `transform` (apply everywhere) (User Guide §6.3 *Preprocessing data*, scikit-learn.org).
2. **Split first.** `train_test_split(...)` *before* any fitting — every statistic must come from training rows only.
3. **Scale numerics.** `StandardScaler` (mean 0, var 1), `RobustScaler` for outliers, or `MinMaxScaler` for
   bounded ranges; `.fit(X_train)`, then `.transform` both splits.
4. **Encode categoricals.** `OneHotEncoder(handle_unknown="ignore")` for low cardinality; `OrdinalEncoder`
   only for truly ordered levels.
5. **Impute missing values.** `SimpleImputer(strategy="median")` or `KNNImputer`, fit on train; add
   `add_indicator=True` to flag missingness (User Guide §6.4 *Imputation of missing values*, scikit-learn.org).
6. **Reference solution sketch.** Show split → fit-on-train scaler/encoder/imputer → transform test.
7. **Pitfalls & Learning Footer.** Name fit-on-all-data leakage, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Split first: train/test before any fit
Numeric: StandardScaler / RobustScaler (fit on train)
Categorical: OneHotEncoder(handle_unknown="ignore")
Missing: SimpleImputer(strategy=...) (+ add_indicator)
Apply: transform test with train-fit statistics
Learning Footer
```

## Tips

- Fit scalers, encoders, and imputers on the training split only — fitting on all rows leaks the test set.
- Impute inside the Pipeline, not by filling the whole DataFrame first, or the mean/median leaks across the split.
- Match the tool to the data: `RobustScaler` for outliers, `handle_unknown="ignore"` for unseen categories.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
