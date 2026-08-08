---
name: ml-pipeline-designer
description: "Design an ML training→serving pipeline: reproducible data splits, training, experiment tracking, a model registry, deployment (batch/online), and monitoring for drift — with reproducibility baked in. Use for 'MLOps pipeline', 'productionize my model', 'train-to-serve', 'experiment tracking / model registry', 'deploy and monitor a model', or 'make ML reproducible'. Teaches the system, not just a script."
argument-hint: "The model + serving needs"
---

# ML Pipeline Designer

Design the path from raw data to a monitored production model — **explaining every trade-off** — per
the teaching principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has a working model and needs a repeatable way to train, ship, and watch it in production.
- Pairs with `model-selection-advisor`, `feature-engineering-coach`, and `eval-designer`.

## Procedure

1. **Nail reproducibility first.** Version data, code, config, and seeds so any run can be recreated; in
   ML, changing anything changes everything (Sculley et al., *Hidden Technical Debt in ML*, NeurIPS 2015).
2. **Design splits & data flow.** Train/validation/test (or time-based) with no leakage across stages;
   define how features are computed *identically* at train and serve time.
3. **Track experiments** — params, metrics, artifacts — so training runs are comparable, not lost in notebooks.
4. **Register & version models.** A registry with stages (staging→prod) and metadata enables rollback
   and a clear audit trail.
5. **Choose serving** to fit the need: batch scoring vs. online/real-time endpoint — trading latency,
   cost, and complexity. Keep train/serve feature parity.
6. **Monitor in production:** data/concept **drift**, input quality, latency, and live metrics; set
   alerts and a retraining trigger (rubric: Breck et al., *The ML Test Score*, IEEE Big Data 2017).
7. **Gate on evaluation** before promotion and after deploy (`eval-designer`).
8. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Serving need: batch / online, latency & cost budget
Pipeline: data → split → train → track → register → deploy → monitor (diagram)
Reproducibility: what is versioned (data/code/config/seed)
Train/serve parity: how features stay identical
Monitoring: drift, quality, latency, retrain trigger
Eval gates: pre-promotion + post-deploy
Learning Footer
```

## Tips

- If you can't reproduce a run, you can't debug or trust it — version data and config, not just code.
- Training/serving **skew** is a top production failure; compute features the same way on both sides.
- A deployed model decays as the world shifts — monitoring and a retrain trigger are part of the design.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
