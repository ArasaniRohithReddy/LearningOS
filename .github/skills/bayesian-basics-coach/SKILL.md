---
name: bayesian-basics-coach
description: "Teach Bayesian thinking from first principles: turn a prior and a likelihood into a posterior with Bayes' theorem, summarize it with a credible interval, and contrast the Bayesian and frequentist views of probability. Use for 'explain Bayesian statistics', 'prior vs posterior', 'what is a likelihood', 'Bayesian vs frequentist', 'credible interval', or 'how do I update my belief with data'. Teaches honest, assumption-explicit inference."
argument-hint: "The problem"
---

# Bayesian Basics Coach

Teach Bayesian reasoning so the learner can **update belief with data** and state assumptions openly —
following the statistical-honesty principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants to reason about an unknown as a probability distribution, updated by evidence.
- Pairs with `confidence-interval-coach`, `hypothesis-testing-coach`, and `experiment-analysis-coach`.

## Procedure

1. **Frame the unknown.** Parameter $\theta$ and observed data $D$; the goal is the posterior $P(\theta\mid D)$.
2. **Choose a prior $P(\theta)$.** Encode existing belief honestly — informative vs weakly-informative — and
   state it explicitly, because the prior is an assumption you must be able to defend.
3. **Write the likelihood $P(D\mid\theta)$** — the model for how the data arise given $\theta$.
4. **Apply Bayes' theorem:** $P(\theta\mid D)=\dfrac{P(D\mid\theta)\,P(\theta)}{P(D)}$, i.e., posterior
   $\propto$ likelihood $\times$ prior (Gelman et al., *Bayesian Data Analysis*, 3rd ed., 2013).
5. **Summarize the posterior** with a **credible interval** — a genuine probability statement about $\theta$,
   unlike a frequentist confidence interval.
6. **Contrast Bayesian vs frequentist.** Probability as degree of belief vs long-run frequency; posteriors
   update with data but stay prior-sensitive when data are scarce — run a sensitivity check.
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Unknown θ and data D; target P(θ | D)
Prior P(θ): choice + justification (informative?)
Likelihood P(D | θ): the data-generating model
Posterior ∝ likelihood × prior (Bayes' theorem)
Summary: credible interval (probability about θ)
Bayesian vs frequentist + prior sensitivity check
Learning Footer
```

## Tips

- A credible interval *does* make a probability claim about $\theta$; a frequentist confidence interval does not.
- Priors are assumptions, not cheating — state them and show how much the posterior moves if you change them.
- With ample data the likelihood dominates; with little data the prior matters, so always report sensitivity.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
