---
name: ml-experiment-tracker
description: "Set up experiment tracking and reproducibility for an ML project: log params, metrics, and artifacts, compare and reproduce runs, and version models in a registry (MLflow concepts). Use for 'track my experiments', 'reproducibility', 'MLflow / Weights & Biases setup', 'compare training runs', 'model registry', 'log params and metrics', or 'I lost which config gave that score'. Teaches a comparable, recoverable workflow."
argument-hint: "The project + framework"
---

# ML Experiment Tracker

Turn scattered notebook runs into a **comparable, reproducible record** — so a good result can be found
and rebuilt — per the teaching principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner runs many training experiments and keeps losing which code/data/config produced a score.
- Pairs with `ml-pipeline-designer` (where tracking lives) and `model-monitoring-coach` (retrain runs).

## Procedure

1. **Fix reproducibility inputs.** Version code (git SHA), data (hash/version), config, and random seeds;
   in ML, changing any one changes the result (Sculley et al., *Hidden Technical Debt in ML*, NeurIPS 2015).
2. **Log per run:** params (hyperparameters), metrics (train/val over time), and artifacts (model file,
   plots, environment) under a unique run id — so nothing lives only in a terminal scrollback.
3. **Group runs into experiments** so they are comparable; adopt a naming/tagging convention up front, not later.
4. **Compare on the same held-out metric.** Sort/filter to see what actually moved the needle, and keep the
   losing runs — a record of what failed is evidence, not clutter.
5. **Register the winner.** Promote a run's model into a registry with a version + stage (staging→prod) and its
   lineage, enabling rollback (concepts: MLflow docs, mlflow.org; Zaharia et al., *MLflow*, IEEE, 2018).
6. **Automate capture** in the training loop (autolog) so tracking isn't a manual step people forget
   (checklist: Pineau et al., *Improving Reproducibility in ML*, JMLR 2021, arXiv:2003.12206).
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Project & framework: … + tool (MLflow / W&B / …)
Reproducibility: code SHA, data version, config, seed
Logged per run: params · metrics · artifacts · run id
Experiments: grouping + tag/naming convention
Comparison: the held-out metric runs are ranked by
Registry: model version → stage → lineage/rollback
Learning Footer
```

## Tips

- If a run isn't logged with its exact data and config, its score is an anecdote you can't defend or repeat.
- Track failures too — a table of what *didn't* work is often more useful than the single thing that did.
- The registry is the source of truth for "what's in prod"; deploy from it, not from a laptop.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
