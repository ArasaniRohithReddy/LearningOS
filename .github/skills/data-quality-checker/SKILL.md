---
name: data-quality-checker
description: "Define data-quality checks for a dataset or pipeline as a lesson — the dimensions (completeness, validity, uniqueness, freshness, accuracy, consistency), executable tests, warn/error thresholds, placement, and alerting. Use for 'add data quality checks', 'is this data trustworthy', 'dbt tests / Great Expectations', 'detect nulls/duplicates/stale data', 'set DQ thresholds', or learning data reliability."
argument-hint: "The dataset/table + rules"
---

# Data Quality Checker

Turn "is the data good?" into measurable, executable checks — dimensions → rules → thresholds → alerting —
following the teaching approach in [`AGENTS.md`](../../../AGENTS.md). Gates
[`data-pipeline-designer`](../data-pipeline-designer/SKILL.md) and complements [`dbt-model-coach`](../dbt-model-coach/SKILL.md).

## When to use

- The learner needs to trust a table or block a pipeline when data is bad.
- Turning vague quality worries into concrete tests and thresholds.

## Dimensions (DAMA UK, *Six Primary Dimensions*, 2013)

| Dimension | Question | Example test |
| --- | --- | --- |
| Completeness | missing values? | null rate < 0.5% |
| Validity | right format/range? | email regex, amount ≥ 0 |
| Uniqueness | duplicates? | PK is unique |
| Freshness | up to date? | max(load_ts) within SLA |
| Consistency | agrees across tables? | totals reconcile |
| Accuracy | matches reality? | spot-check vs. source |

## Procedure

1. **Scope**: which columns/rows feed real decisions? Test those hardest — not everything equally.
2. **Pick dimensions per column** from the table above; write each as a measurable rule.
3. **Make tests executable**: dbt generic/singular tests, Great Expectations, or SQL assertions in the DAG.
4. **Set thresholds**: distinguish **warn** (log) vs. **error** (fail the run); pick numbers from history, not guesses.
5. **Place checks**: at ingestion (bronze), post-transform (silver/gold), and as a pre-publish gate.
6. **Alert & own**: route failures to an owner; log metrics over time to catch slow **drift**, not just hard breaks.
7. **Decide blocking vs. non-blocking** per check — data correctness vs. availability is a real trade-off.

## Output shape

```
Critical fields: …
Checks: column | dimension | rule | threshold | warn/error
  order_id | uniqueness | unique | 0 dups | error
  load_ts  | freshness  | < 6h old | SLA | error
Placement: bronze | silver | gold gate
Alerting: owner + channel; trend log for drift
```

## Tips

- Freshness is the most-missed dimension — stale data passes every other check.
- Prefer failing loudly at a gate over silently publishing bad gold; measure trends, not just pass/fail.
- End with the **Learning Footer** (`AGENTS.md`).
