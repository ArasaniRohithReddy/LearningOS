---
name: model-monitoring-coach
description: "Monitor a deployed model in production: detect data and concept drift, catch performance decay and data-quality breakage, set alerts and dashboards, and decide when to retrain. Use for 'my model got worse in production', 'detect data/concept drift', 'model monitoring', 'when should I retrain', 'PSI/KS drift test', 'data quality checks', or 'set up ML alerting'. Teaches trustworthy observation, not just dashboards."
argument-hint: "The model + serving context"
---

# Model Monitoring Coach

Watch a live model the way an SRE watches a service — **catching silent failures before users do** —
following the honesty and rigor principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner shipped a model and needs to know when it quietly stops working, and whether to retrain.
- Extends `ml-pipeline-designer`; feeds `ml-experiment-tracker` (retrain runs) and `eval-designer` (gates).

## Procedure

1. **Define healthy first.** Baseline the training/validation distributions and live metrics so "abnormal"
   has a reference; name the business KPI the model is actually supposed to move.
2. **Watch the inputs (data drift).** Compare live feature distributions to baseline with PSI or the
   Kolmogorov–Smirnov test per feature; this alerts *before* labels even arrive.
3. **Watch the input↔output relationship (concept drift).** The mapping X→y can shift even when inputs look
   stable (Gama et al., *A Survey on Concept Drift Adaptation*, ACM Computing Surveys, 2014).
4. **Watch data quality.** Schema, ranges, nulls, and freshness — most "model" incidents are broken pipelines
   (Breck et al., *Data Validation for Machine Learning*, MLSys 2019).
5. **Track performance decay** once labels land; where labels lag, lean on proxy signals (confidence, drift)
   and backfill ground truth when it arrives.
6. **Alert & act.** Set thresholds with hysteresis to cut noise; define the retrain/rollback trigger and its
   owner (rubric: Breck et al., *The ML Test Score*, IEEE Big Data 2017).
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Model & KPI: what it predicts, the business metric it moves
Baselines: training distributions + healthy metric ranges
Drift monitors: data (PSI/KS) + concept + which features
Data-quality checks: schema, ranges, nulls, freshness
Performance: metric, label latency, proxy signals
Alerts & response: thresholds, retrain/rollback trigger, owner
Learning Footer
```

## Tips

- A flat aggregate accuracy chart can hide drift on a key segment — monitor per slice, not just the average.
- Delayed labels are the norm; watch input/prediction drift as an early warning while ground truth catches up.
- Retraining is not automatic goodness — validate the new model on a fresh eval before promoting it.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
