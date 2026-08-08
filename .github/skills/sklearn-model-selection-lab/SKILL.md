---
name: sklearn-model-selection-lab
description: "Hands-on lab: split train/test, run k-fold cross-validation, and tune hyperparameters with GridSearchCV — estimating generalization honestly without leaking the test set. Use for 'model selection lab', 'train test split', 'cross-validation', 'GridSearchCV', 'hyperparameter tuning', 'StratifiedKFold', or a guided hands-on exercise on validation. Teaches by doing, not just reading."
argument-hint: "The model"
---

# scikit-learn Model Selection Lab

A guided, hands-on lab that estimates generalization with train/test splits, cross-validation, and
`GridSearchCV` — keeping the test set sacred — following the teach-by-doing principles in
[`AGENTS.md`](../../../AGENTS.md). Pairs with
[`model-selection-advisor`](../model-selection-advisor/SKILL.md) and [`eval-designer`](../eval-designer/SKILL.md).

## When to use

- The learner wants to *practice* cross-validation and tuning, not just read about overfitting.
- Whenever a model has hyperparameters or you need a trustworthy performance estimate.

## Procedure

1. **Concept first.** A single split is noisy; k-fold CV rotates every row through validation and averages k
   scores for a stabler estimate of generalization (User Guide §3.1 *Cross-validation*, scikit-learn.org).
2. **Hold out a test set.** `train_test_split(X, y, stratify=y, random_state=0)`; touch the test set only once, at the end.
3. **Cross-validate a baseline.** `cross_val_score(pipe, X_train, y_train, cv=StratifiedKFold(5))`; report mean ± std.
4. **Exercise — tune.** `GridSearchCV(pipe, param_grid, cv=5, scoring="f1_macro").fit(X_train, y_train)`; read
   `best_params_` and `best_score_` (User Guide §3.2 *Tuning the hyper-parameters*, scikit-learn.org).
5. **Exercise — final estimate.** Score the refit `best_estimator_` **once** on the untouched test set
   (Pedregosa et al., *Scikit-learn*, JMLR 12, 2011).
6. **Reference solution sketch.** Show split → CV baseline → grid search → single test score end to end.
7. **Pitfalls & Learning Footer.** Name tuning-on-test leakage, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Split: train/test (stratified, held out)
Baseline CV: cross_val_score mean ± std
Grid: param_grid + scoring; best_params_ / best_score_
Final: best_estimator_ scored once on test
Gap: CV vs. test — did tuning overfit?
Learning Footer
```

## Tips

- Pass a Pipeline (not pre-transformed data) to `GridSearchCV` so preprocessing refits inside each fold.
- Report the test score once; repeatedly tuning against the test set leaks and inflates your estimate.
- Use `StratifiedKFold` for classification and pick `scoring` to match the real cost of errors, not default accuracy.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
