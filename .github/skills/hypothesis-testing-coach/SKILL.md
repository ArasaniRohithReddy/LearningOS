---
name: hypothesis-testing-coach
description: "Teach hypothesis testing from first principles: frame the null and alternative, choose the right test (one/two-sample or paired t-test, chi-square, nonparametric), compute and interpret p-values correctly, and reason about Type I/II errors and power. Use for 'is this significant', 'which statistical test', 't-test vs chi-square', 'what does the p-value mean', 'null vs alternative hypothesis', or 'Type I error'. Teaches honest inference, not p-hacking."
argument-hint: "The question"
---

# Hypothesis Testing Coach

Teach hypothesis testing so the learner can choose the right test and read the result **honestly** — not
just chase a `p < 0.05` — following the statistical-honesty principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has a question about a difference or association and needs a valid test plus correct reading.
- Pairs with `ab-test-designer` (design first) and `confidence-interval-coach` / `experiment-analysis-coach`.

## Procedure

1. **Frame it before the data.** State $H_0$ (no effect) and $H_1$, pick one- vs two-sided, and fix the
   significance level $\alpha$ (e.g., 0.05) in advance — choosing after seeing data is p-hacking.
2. **Check assumptions, then pick the test.** Means → one/two-sample or paired $t$-test (normal-ish or large
   $n$ via the CLT); categorical → $\chi^2$ goodness-of-fit or independence; assumptions broken →
   nonparametric (Mann–Whitney, Wilcoxon).
3. **Compute the statistic and p-value**, defined correctly as $P(\text{data this extreme}\mid H_0)$ —
   *not* $P(H_0\mid\text{data})$ (Wasserstein & Lazar, ASA Statement, *The American Statistician*, 2016).
4. **Decide vs $\alpha$** and name the risks: Type I (false positive, rate $\alpha$) vs Type II (miss, rate
   $\beta$); power $=1-\beta$ needs an adequate sample size.
5. **Report effect size + a confidence interval**, not just significance — with large $n$ a trivial effect
   can still be "significant."
6. **Correct for multiple comparisons** (Bonferroni or Benjamini–Hochberg); many tests manufacture false positives.
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Question → H0 / H1 (one- or two-sided), α fixed in advance
Test choice: … + why (assumptions checked)
Statistic & p-value: value + correct interpretation
Errors: Type I / II, power, adequacy of n
Effect size + CI: practical vs statistical significance
Multiplicity: correction when many tests were run
Learning Footer
```

## Tips

- The p-value is **not** the probability the null is true, nor the chance the result is a fluke.
- "Fail to reject $H_0$" ≠ "$H_0$ is true" — absence of evidence isn't evidence of absence.
- Pick the test and $\alpha$ *before* looking; switching tests to reach significance is p-hacking.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
