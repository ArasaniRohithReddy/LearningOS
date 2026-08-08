---
name: sampling-methods-coach
description: "Teach sampling from first principles: pick a probability design (simple random, stratified, cluster, systematic), size the sample from a target margin of error, and spot bias (selection, coverage, nonresponse, voluntary-response) that no sample size can fix. Use for 'how do I sample', 'stratified vs cluster sampling', 'what sample size do I need', 'is my sample representative', 'sampling bias', or 'margin of error'. Teaches representative, honest study design."
argument-hint: "The study"
---

# Sampling Methods Coach

Teach sampling so the learner draws a **representative** sample and knows which bias no $n$ can fix —
following the statistical-honesty principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner is planning a survey or study and must choose a design and defend representativeness.
- Pairs with `ab-test-designer`, `dataset-explorer`, and `confidence-interval-coach`.

## Procedure

1. **Define population, frame, and unit.** A sampling frame that misses groups bakes in coverage bias from
   the very start.
2. **Pick a probability design:** simple random (baseline), **stratified** (sample within homogeneous strata
   → more precise), **cluster** (sample whole groups → cheaper, less precise), or systematic — every unit
   must have a known, non-zero chance.
3. **Size the sample.** From margin of error $E$, confidence, and variability:
   $n\approx\left(\dfrac{z^*\sigma}{E}\right)^2$; precision improves only as SE $\propto 1/\sqrt{n}$.
4. **Guard against bias.** Selection, coverage, nonresponse, and voluntary-response bias (e.g., the 1936
   *Literary Digest* poll) — a bigger sample **cannot** fix a biased frame.
5. **Check representativeness.** Compare the sample to the population on known traits; weight or
   post-stratify to correct imbalance.
6. **Report** the design, $n$, margin of error, and known limitations honestly (Lohr, *Sampling: Design and
   Analysis*, 2019).
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Population, sampling frame, and unit
Design: SRS / stratified / cluster / systematic + why
Sample size: n ≈ (z*σ / E)² for the target margin of error
Bias audit: selection, coverage, nonresponse, voluntary
Representativeness: sample vs population + weighting
Report: design, n, margin of error, limitations
Learning Footer
```

## Tips

- A large sample does not cure bias — a biased frame just yields a precisely wrong answer (1936 *Literary Digest*).
- Stratify to cut variance when subgroups differ; cluster to cut cost, accepting less precision per unit.
- "Representative" is a claim to defend with evidence, not a default — compare the sample to the population.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
