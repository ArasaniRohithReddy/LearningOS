---
name: airflow-dag-coach
description: "Design an Airflow orchestration DAG as a lesson — tasks and dependencies, idempotent operators, retries/backfills, sensors, and common anti-patterns — with explicit trade-offs. Use for 'Airflow DAG', 'orchestrate a pipeline', 'idempotent tasks', 'backfill / catchup', 'sensors vs pokes', 'retries and SLAs', or learning workflow orchestration."
argument-hint: "The pipeline to orchestrate"
---

# Airflow DAG Coach

Design a DAG the reviewed way — tasks → dependencies → idempotency → retries → sensors —
following the teaching approach in [`AGENTS.md`](../../../AGENTS.md). Orchestrates
[`data-pipeline-designer`](../data-pipeline-designer/SKILL.md), [`cdc-pipeline-coach`](../cdc-pipeline-coach/SKILL.md), and [`dbt-model-coach`](../dbt-model-coach/SKILL.md) runs.

## When to use

- The learner needs to schedule and sequence a pipeline with retries and backfills.
- Making tasks safe to rerun and choosing sensors vs. deferrable operators.

## Anti-patterns (and the fix)

| Anti-pattern | Why it hurts | Fix |
| --- | --- | --- |
| Non-idempotent task | backfills duplicate data | partition + MERGE/overwrite |
| Top-level heavy code | slows every DAG parse | move work into task bodies |
| Poking sensors | pin a worker slot for hours | deferrable / reschedule mode |

## Procedure

1. **Model tasks** — one unit of work each; wire dependencies with `>>` into a DAG (Apache Airflow docs).
2. **Parameterize by run** — use the logical/data-interval date so each run owns exactly one partition.
3. **Make tasks idempotent** — write to a deterministic partition; `MERGE`/overwrite so reruns don't duplicate.
4. **Set retries + backoff** — `retries`, `retry_delay` (exponential), and SLAs/alerts on failure.
5. **Backfill deliberately** — `catchup` + `max_active_runs`; idempotency is what makes backfills safe.
6. **Wait with sensors** — use `reschedule`/deferrable sensors (not `poke`) to free worker slots.

## Output shape

```
Pipeline: … | schedule: … | catchup: on|off
Tasks: extract >> transform >> load >> quality
Idempotency: partition by {{ data_interval_start }} + MERGE
Retries: n + exponential backoff · SLA + alert
Sensors: deferrable/reschedule (not poke)
DAG: A >> [B, C] >> D
Anti-patterns avoided: … (table)
```

## Tips

- Keep DAG files light — heavy imports at top level slow the whole scheduler's parse loop.
- Idempotency plus correct data-interval partitioning are what make backfills trustworthy.
- End with the **Learning Footer** (`AGENTS.md`).
