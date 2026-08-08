---
name: statsmodels-lab
description: "Hands-on lab on statsmodels: fit an OLS regression with the formula API, read the summary() table (coefficients, p-values, R-squared, confidence intervals), and run diagnostics (residual and QQ plots, Breusch-Pagan, VIF, Durbin-Watson) — learning by running real code. Use for 'statsmodels lab', 'hands-on statsmodels lab', 'OLS regression', 'read regression summary', 'regression diagnostics', 'check assumptions', or a guided regression exercise. Teaches by doing, honestly."
argument-hint: "The outcome + predictors"
---

# statsmodels Lab

A guided, hands-on lab that builds regression fluency — fit OLS, read the summary, then check assumptions —
per the teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`pandas-lab`](../pandas-lab/SKILL.md) and [`dataset-explorer`](../dataset-explorer/SKILL.md).

## When to use

- The learner wants an interpretable linear model with inference, not just a black-box predictor.
- Before trusting coefficients, to test the assumptions that make the p-values valid.

## Procedure

1. **Concept first.** OLS picks coefficients that minimize the sum of squared residuals; valid inference
   needs linearity, independent errors, constant variance (homoskedasticity), and roughly normal residuals
   (statsmodels.org, *Ordinary Least Squares*, 2024; Seabold & Perktold, *statsmodels*, SciPy 2010).
2. **Fit.** `import statsmodels.formula.api as smf; m = smf.ols("y ~ x1 + x2", data=df).fit()`.
3. **Read `m.summary()`.** Interpret each `coef` as the effect of a predictor holding others fixed; check
   `P>|t|`, the 95% CI `[0.025 0.975]`, `R-squared`, and the overall `F-statistic`.
4. **Diagnose.** Plot residuals vs. fitted, a QQ plot (`sm.qqplot(m.resid, line="45")`), test variance with
   `het_breuschpagan`, multicollinearity with `variance_inflation_factor` (VIF), and `durbin_watson`.
5. **Interpret honestly.** Association is not causation; a high `R²` doesn't validate assumptions, and a
   small p-value is not a large effect.
6. **Fix & refit.** Transform, add terms, or use `cov_type="HC3"` robust errors when variance isn't constant.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Model: smf.ols("y ~ x1 + x2", data=df).fit()
Summary: coef | P>|t| | [0.025 0.975] | R-squared | F-statistic
Diagnostics: resid-vs-fitted, qqplot, het_breuschpagan, VIF, durbin_watson
Read: coef = effect holding others fixed (not causal)
Fix: transform / add term / cov_type="HC3"
Learning Footer
```

## Tips

- Check assumptions before quoting the summary — the table is only as valid as the residuals.
- `R²` measures fit, not correctness; observational coefficients describe association, not cause.
- Screen predictors and leakage first with [`dataset-explorer`](../dataset-explorer/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
