---
name: sklearn-regression-lab
description: "Hands-on lab: fit a scikit-learn regressor and evaluate it honestly — compute R², MAE, and RMSE and read a residual plot to spot bias and heteroscedasticity. Use for 'regression lab', 'R2 vs RMSE', 'MAE', 'root_mean_squared_error', 'residual analysis', or a guided hands-on exercise on regression metrics. Teaches by doing, not just reading."
argument-hint: "The dataset"
---

# scikit-learn Regression Lab

A guided, hands-on lab that fits a scikit-learn regressor and checks it with R²/MAE/RMSE and residuals
— never a single number — following the teach-by-doing principles in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [`eval-designer`](../eval-designer/SKILL.md) and
[`feature-engineering-coach`](../feature-engineering-coach/SKILL.md).

## When to use

- The learner wants to *practice* fitting a regressor and judging error, not just read the formulas.
- After features are ready; pairs with `model-selection-advisor` (tuning) and `eval-designer` (metric choice).

## Procedure

1. **Concept first.** Regression predicts a continuous value; metrics differ — MAE is mean |error|, RMSE
   squares then roots (penalizing large misses), R² is variance explained (Pedregosa et al., *Scikit-learn*, JMLR 12, 2011).
2. **Frame the task & split.** State the target and its units; `train_test_split(X, y, random_state=0)`.
3. **Fit a baseline.** `reg = LinearRegression().fit(X_train, y_train)`; predict `y_pred = reg.predict(X_test)`;
   compare against a `DummyRegressor(strategy="mean")` floor.
4. **Exercise — metrics.** Use `r2_score`, `mean_absolute_error`, and `root_mean_squared_error` (added in
   scikit-learn 1.4, 2024; older code used `mean_squared_error(..., squared=False)`) (User Guide §3.4
   *Metrics and scoring*, scikit-learn.org).
5. **Exercise — residuals.** Plot residuals (`y_test - y_pred`) with `PredictionErrorDisplay`; a healthy plot
   is a shapeless band around 0 — a curve means bias, a fan means heteroscedasticity.
6. **Reference solution sketch.** Show fit → predict → three metrics → residual plot end to end.
7. **Pitfalls & Learning Footer.** Name R²'s traps and leakage, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Task: … | Target: units + split
Fit: reg = LinearRegression().fit(X_train, y_train)
Metrics: R² / MAE / RMSE (vs. DummyRegressor baseline)
Residuals: PredictionErrorDisplay — band around 0? pattern?
Read: what the errors mean in the target's real units
Learning Footer
```

## Tips

- RMSE punishes large errors more than MAE; report both and read them in the target's real units.
- R² can be negative (worse than predicting the mean) and rises with more features — always compare to a baseline.
- Fit scalers/encoders on the training split only (or inside a Pipeline); fitting on all rows leaks the test set.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
