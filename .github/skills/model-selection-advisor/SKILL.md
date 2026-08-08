---
name: model-selection-advisor
description: "Choose the right ML model/approach for a problem: frame it (classification, regression, ranking, clustering, forecasting), start from a simple baseline, weigh model complexity against data size, and evaluate — with trade-offs made explicit. Use for 'which model should I use', 'what algorithm for my data', 'is this classification or regression', 'do I need deep learning', 'baseline model', or 'simplest model that works'. Teaches the choice, not just a library call."
argument-hint: "The problem + data + constraints"
---

# Model Selection Advisor

Pick the model that fits the problem and the data — **not the trendiest one** — explaining every
trade-off, per the teaching principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has a prediction problem and needs to choose an approach, not just copy an algorithm.
- Pairs with `feature-engineering-coach` (inputs), `eval-designer` (proof), and `ml-pipeline-designer` (ship it).

## Procedure

1. **Frame the task.** Map the goal to a type: classification, regression, ranking, clustering, or
   forecasting. Define the target, the unit of prediction, and the metric that reflects real success.
2. **Establish a baseline first.** A majority-class/mean predictor or a simple logistic/linear model
   sets the bar; nothing complex is worth it until it beats this. No model wins everywhere (Wolpert &
   Macready, *No Free Lunch*, IEEE Trans. Evol. Comp., 1997).
3. **Weigh complexity vs. data.** Small/tabular → linear models, trees, gradient boosting; large,
   high-dimensional (text/image/audio) → deep nets. More capacity needs more data or it overfits
   (bias–variance trade-off; Domingos, *A Few Useful Things…*, CACM 55(10), 2012).
4. **Add constraints.** Latency, memory, interpretability, retraining cadence, and team skill often
   rule out otherwise-accurate models — say these trade-offs out loud.
5. **Shortlist 2–3 candidates** and compare on the *same* split with the chosen metric (`eval-designer`).
6. **Recommend the simplest** that clears the bar; note what evidence would justify escalating.
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Problem framing: task type, target, metric
Baseline: what it is, its score
Candidates: 2–3 models → strengths / costs / data fit
Constraints: latency, memory, interpretability, upkeep
Recommendation: pick + why + when to escalate
Learning Footer
```

## Tips

- Beating a real baseline is the only evidence that a complex model earns its keep.
- Match capacity to data volume: deep learning on tiny tabular data usually loses to gradient boosting.
- Accuracy isn't free — interpretability, latency, and maintenance are part of the choice.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
