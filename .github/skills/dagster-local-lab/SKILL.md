---
name: dagster-local-lab
description: "Hands-on lab: run Dagster (open-source data orchestrator) locally — free, no subscription. Install it, define software-defined assets and an op-based job, launch `dagster dev`, then materialize assets and read lineage in the UI at localhost:3000. Use for 'Dagster lab', 'run Dagster locally', 'software-defined assets', 'ops and jobs', 'materialize an asset', 'Dagster UI', 'local data orchestrator no subscription', or learning asset-based orchestration by doing."
argument-hint: "The assets to build"
---

# Dagster Local Lab

Learn Dagster by *materializing real assets on your own machine* — free, OSS, no subscription — per
[`AGENTS.md`](../../../AGENTS.md). Design first with [`data-pipeline-designer`](../data-pipeline-designer/SKILL.md); contrast the task-first model of [`airflow-dag-coach`](../airflow-dag-coach/SKILL.md) and [`airflow-local-lab`](../airflow-local-lab/SKILL.md).

## When to use

- The learner wants a local Dagster to model **assets** (the data you produce) and see their lineage.
- Comparing asset-centric orchestration with Airflow's task-centric DAGs and Prefect's flows.

## Mental model

- Dagster centers on **software-defined assets** (`@asset`) — each function *is* a table/file it produces, and
  Dagster infers lineage from the arguments. Lower-level `@op`/`@job` still exist; `Definitions` registers them.
  `dagster dev` runs the webserver + daemon locally (Dagster, *dagster dev*, docs.dagster.io, 2025).

## Procedure

1. **Concept:** an **asset** is a persisted object (table/file); its parameters declare upstream assets, so lineage is automatic.
2. **Install:** `pip install dagster dagster-webserver` in a fresh virtualenv.
3. **Define assets:** write `@asset` functions (and optionally an `@op`/`@job`) and register them via `Definitions` (below).
4. **Launch the UI:** `dagster dev -f defs.py`, then open localhost:**3000** — find your assets in the **Assets** tab.
5. **Materialize:** click **Materialize** to run the asset graph; watch the run, logs, and lineage update.
6. **Iterate:** `dagster dev` hot-reloads on save — edit an asset and re-materialize to see the graph change.

## Output shape

```
# defs.py
from dagster import asset, op, job, Definitions
@asset
def raw(): return [1, 2, 3]
@asset
def clean(raw): return [x * 10 for x in raw]   # lineage: raw → clean
@op
def ping(): return "pong"
@job
def ops_job(): ping()
defs = Definitions(assets=[raw, clean], jobs=[ops_job])
# dagster dev -f defs.py   → UI http://localhost:3000 → Assets → Materialize
```

## Tips

- Prefer **assets** for anything you persist; reach for `@op`/`@job` only for imperative side-effect steps.
- Make an asset's compute idempotent (overwrite its partition) so re-materializing never duplicates — see [`idempotency-coach`](../idempotency-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one asset to add + one dependency to reason about yourself.
