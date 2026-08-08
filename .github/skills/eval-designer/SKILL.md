---
name: eval-designer
description: "Design an evaluation for an ML or LLM system: define the task and metrics that reflect real success, build a representative and unbiased test set, choose automatic vs human vs LLM-as-judge scoring, and guard against data leakage and overfitting to the eval. Use for 'how do I evaluate my model/prompt/RAG', 'what metric should I use', 'build a test set', 'is my model actually better', or 'LLM-as-judge'. Teaches trustworthy measurement."
argument-hint: "The system/model + what 'good' means"
---

# Eval Designer

Design an evaluation you can **trust** — one that measures real success, not a convenient proxy —
following the honesty and rigor principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner needs to know whether a model/prompt/RAG change is genuinely better, not just vibes.
- Pairs with `prompt-optimizer` and `rag-designer` (to measure their gains).

## Procedure

1. **Define the task & "good".** Inputs, outputs, and what success means to a user; list failure modes to catch.
2. **Choose metrics that reflect it.** Match metric to task: exact-match/F1 for extraction, accuracy/AUC for
   classification (mind class imbalance), faithfulness/relevance for RAG. Beware proxy metrics that reward
   the wrong thing (Goodhart's law).
3. **Build a representative test set.** Cover common + edge + adversarial cases; label ground truth; keep it
   **held-out** and hidden from training/prompt-tuning. Record size and who labeled it.
4. **Pick a scoring method** with trade-offs: automatic (cheap, brittle), human (gold, slow/costly), or
   **LLM-as-judge** (scalable but biased — Zheng et al., arXiv:2306.05685, 2023-06-09; calibrate against
   human labels).
5. **Guard validity:** prevent train/test **leakage** and eval overfitting; report variance across runs;
   score multiple dimensions, not one number (Liang et al., *HELM*, arXiv:2211.09110, 2022-11-16).
6. **Report** per-slice results + failure examples, and the decision they support.
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Task & definition of good: …
Metrics: metric → what it captures → its blind spot
Test set: size, sources, slices, how labeled, held-out?
Scoring: automatic / human / LLM-judge (+ why, + bias check)
Results: overall + per-slice + failure examples
Threats to validity: leakage, overfit, variance
Learning Footer
```

## Tips

- A metric you can't tie to a user outcome will mislead you — validate the metric before the model.
- Freeze the test set; if you tune against it, it becomes training data and stops measuring generalization.
- Report uncertainty (multiple runs / a confidence interval), not a single lucky number.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
