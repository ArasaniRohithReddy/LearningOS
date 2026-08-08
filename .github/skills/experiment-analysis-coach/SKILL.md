---
name: experiment-analysis-coach
description: "Analyze an experiment's results honestly: quantify effect size and its confidence interval, weigh statistical vs practical significance, and catch pitfalls like peeking, sample-ratio mismatch, multiple comparisons, and Simpson's paradox. Use for 'is my A/B test significant', 'how big is the effect', 'can I stop the test early', 'why did my result flip', or 'interpret these experiment results'. Teaches trustworthy read-outs, not dashboard-watching."
argument-hint: "The results"
---

# Experiment Analysis Coach

Read an experiment's results for a **trustworthy** decision — effect size and uncertainty first, the p-value
in context — following the statistical-honesty principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has run a test and needs to interpret it without fooling themselves.
- Pairs with `ab-test-designer` (design/power) and `hypothesis-testing-coach` / `confidence-interval-coach`.

## Procedure

1. **Restate the design.** Hypothesis, primary metric, unit, and planned horizon; confirm the analysis
   matches the pre-registered plan rather than a story found after the fact.
2. **Sanity-check the data.** Sample-ratio mismatch (a 50/50 split arriving as 55/45) signals a broken test;
   check A/A balance and missingness (Kohavi, Tang & Xu, *Trustworthy Online Controlled Experiments*, 2020).
3. **Quantify effect size first.** Absolute + relative lift and a standardized measure such as Cohen's
   $d=\dfrac{\bar{x}_1-\bar{x}_2}{s_p}$ — practical significance beats a bare p-value.
4. **Put a confidence interval on the effect.** If the CI straddles 0 (or your minimum detectable effect),
   you can't claim a win; its width shows precision.
5. **Then read significance in context.** p vs $\alpha$, remembering large $n$ makes trivial effects
   "significant" and small $n$ hides real ones.
6. **Hunt pitfalls:** peeking inflates false positives (Johari et al., *Peeking at A/B Tests*, KDD 2017);
   many metrics/segments → correct or pre-register (Simmons et al., 2011); watch Simpson's paradox in subgroups.
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Design recap: hypothesis, metric, unit, planned horizon
Data checks: sample-ratio mismatch, A/A, missingness
Effect size: absolute + relative + standardized (Cohen's d)
Confidence interval: does it exclude 0 / the MDE?
Significance: p vs α, read alongside the CI
Pitfalls: peeking, multiplicity, Simpson's paradox
Decision: ship / iterate / stop, per the pre-set rule
Learning Footer
```

## Tips

- "Not significant" ≠ "no effect" — an underpowered test can miss a real difference; check the CI width.
- Stopping the moment it looks significant (peeking) manufactures false positives — honor the fixed horizon.
- A significant result can be practically trivial; let the effect size and CI drive the decision.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
