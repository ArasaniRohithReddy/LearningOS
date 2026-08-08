---
name: data-labeling-planner
description: "Plan a data-labeling / annotation project: write clear guidelines, sample what to label, measure inter-annotator agreement, run quality control, and pick tooling. Use for 'create labeling guidelines', 'annotation project plan', 'inter-annotator agreement / Cohen's kappa', 'label quality control', 'how many annotators', 'sampling for labeling', or 'ground-truth dataset'. Teaches reliable labels, not just volume."
argument-hint: "The task + dataset"
---

# Data Labeling Planner

Plan annotation so labels are **reliable, not merely numerous** — because a model inherits its labels' flaws —
following the rigor principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner needs ground-truth labels for training or eval and wants them consistent and defensible.
- Pairs with `dataset-explorer` (what to sample) and `eval-designer` (labels become the test set).

## Procedure

1. **Define the label schema.** Exact class definitions, edge cases, and a decision tree; ambiguity here turns
   into noise everywhere downstream (Sambasivan et al., *Data Cascades*, CHI 2021).
2. **Write guidelines with examples** — positive, negative, and hard/borderline — plus a "when unsure" rule;
   iterate them on a small pilot batch before scaling.
3. **Sample deliberately.** Cover the real distribution plus rare/important cases; keep eval items out of
   training, and record how items were chosen (hand to `dataset-explorer`).
4. **Use overlapping annotators and measure agreement** — Cohen's/Fleiss' kappa or Krippendorff's alpha
   (survey: Artstein & Poesio, *Computational Linguistics*, 2008); low agreement means the *guidelines* need
   fixing, not the annotators.
5. **Resolve & adjudicate.** Decide how disagreements are settled (majority, expert, or discussion) and capture
   the gold rationale for reuse.
6. **Quality-control continuously:** gold/honeypot items, spot audits, and re-labeling suspected errors — label
   noise is pervasive (Northcutt et al., arXiv:2103.14749, 2021-03-26).
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Task & labels: schema + edge-case decision tree
Guidelines: examples (pos/neg/borderline) + "when unsure"
Sampling: distribution + rare cases + train/eval separation
Annotators: count, overlap %, agreement metric + target
Adjudication: how disagreements are resolved
QC & tooling: gold items, audits, re-labeling, tool choice
Learning Footer
```

## Tips

- Low inter-annotator agreement is usually a *guideline* bug, not a people bug — fix definitions and re-pilot.
- If humans can't agree on a label, a model won't learn it reliably; measure agreement before scaling spend.
- Keep annotators' rationales; they make errors auditable and speed up onboarding the next batch.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
