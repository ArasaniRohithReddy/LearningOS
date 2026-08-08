---
name: feature-engineering-coach
description: "Teach feature engineering for a dataset: encode categoricals, scale numerics, build interactions and time/text features, and — above all — avoid data leakage, all tied to the chosen model and metric and validated properly. Use for 'feature engineering help', 'how to encode categorical variables', 'scaling/normalization', 'my model leaks', 'target/one-hot encoding', or 'improve my features'. Teaches the reasoning, not just transforms."
argument-hint: "The dataset/target + model"
---

# Feature Engineering Coach

Turn raw columns into features a model can learn from — **without leaking the answer** — explaining
each choice, per the teaching principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has a dataset and target and wants stronger, honest inputs for a specific model/metric.
- Pairs with `dataset-explorer` (understand the data), `model-selection-advisor`, and `eval-designer`.

## Procedure

1. **Anchor to model & metric.** Trees/boosting need little scaling and handle raw splits; linear
   models and neural nets need scaling and encodings. Let the target and metric decide what helps.
2. **Encode categoricals** by cardinality: one-hot for few levels; **target/mean encoding** for
   high-cardinality — fit it *inside* cross-validation folds only (Micci-Barreca, SIGKDD Expl. 3(1), 2001).
3. **Scale & transform numerics** (standardize/normalize, log/Box-Cox for skew); choose a principled
   policy for missing values and outliers instead of dropping blindly.
4. **Craft signal:** interactions/ratios and date/text/geo decompositions — grounded in domain sense,
   not brute force. Every extra feature adds variance and cost.
5. **Prevent leakage — the cardinal sin.** No target-derived or future information; fit every transform
   on **train only** and apply to validation/test (Kaufman et al., *Leakage in Data Mining*, ACM TKDD, 2012).
6. **Validate the lift** with the same CV split and metric; keep only features that earn their keep (`eval-designer`).
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Model & metric: what the features must serve
Per feature: raw → transform → why (encode / scale / derive)
Leakage check: fit-on-train-only, no future/target info
Validation: CV plan, lift vs. baseline features
Kept vs. dropped: with reasons
Learning Footer
```

## Tips

- A too-good validation score usually means leakage — audit the pipeline before celebrating.
- Fit encoders/scalers on the training fold only; fitting on all data quietly leaks the test set.
- Prefer a few well-reasoned features over hundreds of brute-forced ones that add noise and cost.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
