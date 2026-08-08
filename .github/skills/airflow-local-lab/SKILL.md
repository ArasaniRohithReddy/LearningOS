---
name: airflow-local-lab
description: "Hands-on lab: run Apache Airflow locally with Docker Compose — free, open-source, no subscription. Fetch the official docker-compose.yaml, author a DAG in ./dags, start the stack, unpause it, and watch tasks run in the web UI at localhost:8080. Use for 'Airflow lab', 'run Airflow locally', 'Airflow in Docker Compose', 'author and run a DAG', 'Airflow web UI', 'local orchestration no subscription', or learning workflow orchestration by doing."
argument-hint: "The DAG/pipeline to run"
---

# Apache Airflow Local Lab

Learn Airflow by *running the real scheduler on your own machine* — free, no cloud, no subscription — per
[`AGENTS.md`](../../../AGENTS.md). Design first with [`airflow-dag-coach`](../airflow-dag-coach/SKILL.md) and [`data-pipeline-designer`](../data-pipeline-designer/SKILL.md); contrast [`prefect-local-lab`](../prefect-local-lab/SKILL.md) and [`dagster-local-lab`](../dagster-local-lab/SKILL.md).

## When to use

- The learner wants a disposable local Airflow to author, trigger, and observe a DAG end to end.
- Seeing how the scheduler parses DAG files, queues tasks, and surfaces retries and logs in the UI.

## Mental model

- Airflow is a **scheduler + web UI + workers**: it parses Python **DAG** files from `./dags`, then runs each
  task on schedule with retries and logging. The official Compose quickstart wires the scheduler, api-server,
  worker, triggerer, Postgres, and Redis for you (Apache Airflow, *Running Airflow in Docker*, airflow.apache.org, 3.x, 2025).

## Procedure

1. **Concept:** a DAG is Python; tasks wire with `>>`. The UI at localhost:**8080** is where you trigger runs and read logs.
2. **Fetch the stack:** `curl -LfO https://airflow.apache.org/docs/apache-airflow/stable/docker-compose.yaml`, then `mkdir -p ./dags ./logs ./plugins ./config`.
3. **Initialize:** `echo -e "AIRFLOW_UID=$(id -u)" > .env`, then `docker compose up airflow-init` — migrates the DB and creates the `airflow` / `airflow` login.
4. **Start & verify:** `docker compose up -d`, then `docker compose ps` until services read *healthy* *before* opening the UI.
5. **Author a DAG:** drop `hello_dag.py` (below) in `./dags`; the scheduler auto-parses it — unpause and trigger it in the UI, then read each task's log.
6. ⚠ **Clean up:** `docker compose down` (add `--volumes` **only** when you truly want to delete the metadata DB).

## Output shape

```
# ./dags/hello_dag.py  — TaskFlow API (Airflow 3.x)
from airflow.sdk import dag, task
@dag(schedule="@daily", catchup=False)
def hello():
    @task
    def extract(): return 42
    @task
    def load(x): print(x)
    load(extract())
hello()
curl -LfO .../docker-compose.yaml → docker compose up airflow-init → up -d
# UI localhost:8080 (airflow/airflow) → unpause → trigger → logs → down
```

## Tips

- ⚠ Quick-start only: this Compose file ships no production security — keep 8080 on localhost, never expose it publicly.
- Keep DAG files light and make tasks idempotent so retries and backfills never duplicate — see [`idempotency-coach`](../idempotency-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one task to add + one retry policy to reason about yourself.
