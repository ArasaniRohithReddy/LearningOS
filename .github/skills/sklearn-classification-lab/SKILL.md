---
name: sklearn-classification-lab
description: "Hands-on lab: train and evaluate a scikit-learn classifier — fit LogisticRegression/RandomForest, read a confusion matrix, and compute precision, recall, and F1 with classification_report. Use for 'classification lab', 'precision vs recall', 'F1 score', 'confusion matrix', 'imbalanced classes', or a guided hands-on exercise on classifier metrics. Teaches by doing, not just reading."
argument-hint: "The dataset"
---

# scikit-learn Classification Lab

A guided, hands-on lab that trains a scikit-learn classifier and judges it honestly — reading a
confusion matrix and precision/recall/F1 rather than accuracy alone — following the teach-by-doing
principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`eval-designer`](../eval-designer/SKILL.md) and [`feature-engineering-coach`](../feature-engineering-coach/SKILL.md).

## When to use

- The learner wants to *practice* training and scoring a classifier, not just read metric definitions.
- After features are ready; pairs with `model-selection-advisor` (tuning) and `eval-designer` (metric choice).

## Procedure

1. **Concept first.** Classification predicts a discrete label; a confusion matrix cross-tabs true vs.
   predicted into TP/FP/FN/TN, from which every metric derives (Pedregosa et al., *Scikit-learn*, JMLR 12, 2011).
2. **Frame the task & split.** State the question and class balance; `train_test_split(X, y, stratify=y,
   random_state=0)` so both sets keep the class ratio.
3. **Fit a baseline.** `clf = LogisticRegression(max_iter=1000).fit(X_train, y_train)`; predict with
   `clf.predict(X_test)` (and `predict_proba` for thresholds).
4. **Exercise — confusion matrix.** Build `confusion_matrix(y_test, y_pred)` → `[[TN, FP], [FN, TP]]`;
   plot `ConfusionMatrixDisplay` and name each cell.
5. **Exercise — metrics.** Compute precision = TP/(TP+FP), recall = TP/(TP+FN), F1 = 2PR/(P+R) via
   `classification_report`; pick macro vs. weighted averaging for imbalance (User Guide §3.4 *Metrics and
   scoring*, scikit-learn.org).
6. **Reference solution sketch.** Show fit → predict → `confusion_matrix` → `classification_report` end to end.
7. **Pitfalls & Learning Footer.** Name accuracy's trap on imbalance and leakage, then close with the
   **Learning Footer** (`AGENTS.md`).

## Output shape

```
Task: … | Classes: balance + split (stratified)
Fit: clf = LogisticRegression(max_iter=1000).fit(X_train, y_train)
Confusion matrix: [[TN, FP], [FN, TP]]
Metrics: precision / recall / F1 (macro & weighted)
Chosen metric: why it fits the cost of the errors
Learning Footer
```

## Tips

- Don't trust accuracy on imbalanced data — a 99%-majority class makes it meaningless; read per-class recall/F1.
- Fit any scaler/encoder on the training split only (or inside a Pipeline) — fitting on all rows leaks the test set.
- Choose precision vs. recall by the cost of false positives vs. false negatives; set the threshold from
  `predict_proba`, not the default 0.5.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
