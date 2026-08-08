---
name: ab-test-designer
description: "Design a trustworthy A/B test / online controlled experiment: state a hypothesis, pick a primary metric and minimum detectable effect, compute sample size and power, randomize correctly, and avoid peeking and p-hacking. Use for 'design an A/B test', 'sample size / power calculation', 'minimum detectable effect', 'is my experiment significant', 'stop peeking at results', or 'p-hacking'. Teaches valid causal inference, not dashboard-watching."
argument-hint: "The change + success metric"
---

# A/B Test Designer

Design an experiment that yields a **causal, trustworthy answer** — with the decision rule set before you look —
following the statistical-honesty principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants to know if a change truly helps, and needs a valid test rather than a hopeful launch.
- Pairs with `eval-designer` (offline metrics first) and `model-monitoring-coach` (watch the live rollout).

## Procedure

1. **State one hypothesis** and a single **primary metric** tied to a user outcome; pre-register guardrail
   metrics so you can't cherry-pick a "winner" after the fact.
2. **Set the effect you care about (MDE).** The smallest lift worth shipping drives the whole design; a smaller
   MDE needs more traffic (Kohavi et al., *Controlled Experiments on the Web*, DMKD, 2009).
3. **Compute sample size & power** *before* launch from baseline rate, MDE, α (e.g., 0.05), and power (e.g., 0.80);
   an underpowered test simply can't detect the effect you seek.
4. **Randomize at the right unit** (user, not request) to avoid contamination; check A/A balance and sample-ratio
   mismatch before trusting anything (Kohavi, Tang & Xu, *Trustworthy Online Controlled Experiments*, 2020).
5. **Run the fixed horizon; don't peek.** Repeatedly testing until significant inflates false positives — use a
   pre-set duration or a proper sequential/Bayesian method (Johari et al., *Peeking at A/B Tests*, KDD 2017).
6. **Analyze honestly.** Report effect size + confidence interval, not just a p-value, and beware many-metric
   fishing (Simmons et al., *False-Positive Psychology*, Psychological Science, 2011).
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Hypothesis & primary metric: … (+ guardrail metrics)
MDE: the smallest lift worth shipping
Design: α, power, computed sample size + run length
Randomization: unit, split, A/A & sample-ratio check
Analysis: effect size + CI, peeking/multiple-comparison plan
Decision rule: ship / no-ship threshold set in advance
Learning Footer
```

## Tips

- Fix sample size and duration before launch; stopping early "because it's significant" manufactures false wins.
- A statistically significant result can be practically trivial — judge the effect size, not just the p-value.
- Sample-ratio mismatch (e.g., 55/45 when you set 50/50) signals a broken test — investigate before believing it.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
