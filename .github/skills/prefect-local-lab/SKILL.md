---
name: prefect-local-lab
description: "Hands-on lab: run Prefect (open-source Python orchestration) locally — free, no subscription. Write a flow that calls tasks, start the self-hosted server, point the client at it, run the flow, and watch it in the UI at localhost:4200. Use for 'Prefect lab', 'run Prefect locally', 'self-hosted Prefect server', 'flows and tasks', 'Prefect UI', 'local orchestration no subscription', or learning Python-native workflow orchestration by doing."
argument-hint: "The flow to run"
---

# Prefect Local Lab

Learn Prefect by *orchestrating plain Python on your own machine* — free, OSS, no subscription — per
[`AGENTS.md`](../../../AGENTS.md). Design first with [`airflow-dag-coach`](../airflow-dag-coach/SKILL.md) and [`data-pipeline-designer`](../data-pipeline-designer/SKILL.md); contrast [`dagster-local-lab`](../dagster-local-lab/SKILL.md).

## When to use

- The learner wants a local Prefect to turn ordinary Python functions into observed, retryable workflows.
- Comparing Prefect's decorate-your-functions model with Airflow DAGs and Dagster assets.

## Mental model

- A Prefect **flow** (`@flow`) is a Python function that orchestrates **tasks** (`@task`); flows run locally with
  no server at all. Running `prefect server start` adds a self-hosted API + UI (SQLite by default) so runs are
  tracked and visible (Prefect, *Self-hosted server*, docs.prefect.io, v3, 2025).

## Procedure

1. **Concept:** decorate a function with `@flow`; call `@task`-decorated functions inside it — that is the whole model.
2. **Install:** `pip install -U prefect` in a fresh virtualenv.
3. **Write flow + tasks:** create `flow.py` (below) and run `python flow.py` — it executes locally, no server required.
4. **Start the server:** in a second terminal, `prefect server start` → API + UI at localhost:**4200**.
5. **Point the client at it:** `prefect config set PREFECT_API_URL=http://127.0.0.1:4200/api`, then rerun `python flow.py`.
6. **Observe:** open localhost:4200 → **Flow Runs** to inspect the run, task states, retries, and logs.

## Output shape

```
# flow.py
from prefect import flow, task
@task(retries=2)
def extract(): return 42
@task
def load(x): print(x)
@flow
def etl():
    load(extract())
if __name__ == "__main__":
    etl()
# prefect server start  → UI http://127.0.0.1:4200
# prefect config set PREFECT_API_URL=http://127.0.0.1:4200/api  → python flow.py
```

## Tips

- Flows run fine with no server — start the server only when you want the UI, run history, and scheduling.
- Add `retries=` to tasks and keep them idempotent so a retried task can't double-write — see [`idempotency-coach`](../idempotency-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one task to add + one retry policy to reason about yourself.
