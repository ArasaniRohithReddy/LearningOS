---
name: confidence-interval-coach
description: "Teach confidence intervals from first principles: what the confidence level really means (a property of the procedure, not the probability the parameter sits in this interval), what drives width, and how a CI relates to a p-value and to a Bayesian credible interval. Use for 'what does a 95% confidence interval mean', 'confidence interval vs p-value', 'margin of error', 'how many samples do I need', or 'is my CI correct'. Teaches honest interpretation."
argument-hint: "The estimate"
---

# Confidence Interval Coach

Teach confidence intervals so the learner interprets them **correctly** — coverage is a property of the
method, not of this one interval — following the statistical-honesty principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has an estimate and wants to express and interpret its uncertainty honestly.
- Pairs with `hypothesis-testing-coach`, `experiment-analysis-coach`, and `bayesian-basics-coach`.

## Procedure

1. **Name the estimand.** Population mean, proportion, or difference; give the point estimate and its
   standard error.
2. **Build the interval.** $\bar{x}\pm t^*\dfrac{s}{\sqrt{n}}$ (use $z^*$ when $\sigma$ is known); check the
   assumptions — independence and approximate normality/CLT.
3. **Interpret it right.** "95% confident" means the *procedure* captures the true fixed parameter in 95% of
   repeated samples — **not** a 95% probability that $\theta$ lies in *this* interval (Morey et al.,
   *Psychonomic Bulletin & Review*, 2016).
4. **Understand width.** Driven by variability, $n$, and level; width $\propto 1/\sqrt{n}$, so halving it needs
   $4\times$ the data, and higher confidence widens the interval.
5. **Relate CI and p-value.** A 95% CI excluding the null value ↔ two-sided $p<0.05$, but the CI also shows
   magnitude and precision the p-value hides (Cumming, *The New Statistics*, 2014).
6. **Want a probability about $\theta$?** That is a Bayesian **credible** interval, not a CI — hand off to
   `bayesian-basics-coach`.
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Estimand: parameter + point estimate + standard error
Interval: formula, level, z*/t*, assumptions checked
Correct reading: coverage of the method (not P(θ in interval))
Width drivers: variability, n (∝ 1/√n), confidence level
CI vs p-value: agreement + what the CI adds
Credible interval: when a Bayesian statement is wanted
Learning Footer
```

## Tips

- A 95% CI does **not** say "95% probability $\theta$ is inside" — $\theta$ is fixed; the interval is random.
- Wider isn't worse — it honestly reflects uncertainty; a too-narrow CI often hides broken assumptions.
- Report the interval, not just a point estimate or a lone p-value; it shows size *and* precision.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
