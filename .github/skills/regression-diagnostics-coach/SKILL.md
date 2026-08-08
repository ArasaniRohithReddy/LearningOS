---
name: regression-diagnostics-coach
description: "Diagnose a fitted regression before trusting it: read residual plots for nonlinearity and heteroscedasticity, detect multicollinearity with VIF, and find influential points with leverage and Cook's distance. Use for 'check my regression assumptions', 'residual plot', 'heteroscedasticity', 'multicollinearity / VIF', 'outliers and influence', or 'why are my coefficients unstable'. Teaches honest model checking, not R-squared chasing."
argument-hint: "The model"
---

# Regression Diagnostics Coach

Diagnose a regression so its coefficients and p-values are **trustworthy** — assumptions checked, not just a
high $R^2$ — following the statistical-honesty principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has fit a linear (or logistic) model and must validate it before interpreting or shipping.
- Pairs with `dataset-explorer`, `hypothesis-testing-coach`, and `sklearn-model-selection-lab`.

## Procedure

1. **State the model and OLS assumptions:** linearity, independent errors, homoscedasticity, approximately
   normal errors, and no perfect collinearity (Gauss–Markov).
2. **Residuals vs fitted.** A curved pattern signals missing nonlinearity or interactions; a Q–Q plot checks
   the normality of $e_i=y_i-\hat{y}_i$.
3. **Heteroscedasticity.** A funnel shape means non-constant variance; confirm with Breusch–Pagan/White and
   fix via robust (HC) standard errors or a transform of $y$.
4. **Multicollinearity.** $\text{VIF}_j=\dfrac{1}{1-R_j^2}$; VIF $>5$–$10$ inflates standard errors and
   destabilizes coefficients — drop, combine, or regularize predictors.
5. **Influence & outliers.** Screen leverage (hat values), studentized residuals, and Cook's distance $D_i$;
   refit without flagged points to test robustness (Belsley, Kuh & Welsch, *Regression Diagnostics*, 1980).
6. **Report fixes and refit** — never judge fit by $R^2$ alone; it can climb while assumptions are violated.
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Model + assumptions to check (Gauss–Markov)
Residuals vs fitted / Q–Q: linearity, normality
Heteroscedasticity: diagnosis + Breusch–Pagan + fix
Multicollinearity: VIF per predictor + remedy
Influence: leverage, Cook's distance, refit check
Conclusion: fixes applied, refit, honest caveats
Learning Footer
```

## Tips

- A high $R^2$ is not validation — it can coexist with nonlinearity, heteroscedasticity, or leverage points.
- Fix multicollinearity before reading individual coefficients; inflated SEs make signs and sizes unreliable.
- One high-influence point can drive the whole fit — always refit without it to see what is robust.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
