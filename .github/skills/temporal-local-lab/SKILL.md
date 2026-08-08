---
name: temporal-local-lab
description: "Hands-on lab: run Temporal (open-source durable execution) locally — free, no subscription. Start the dev server with `temporal server start-dev`, write a Workflow that calls an Activity with the Python SDK, run a Worker, and inspect executions in the Web UI at localhost:8233. Use for 'Temporal lab', 'run Temporal locally', 'workflow and activity', 'durable execution', 'Temporal Web UI', 'local workflow engine no subscription', or learning durable orchestration by doing."
argument-hint: "The workflow to run"
---

# Temporal Local Lab

Learn Temporal by *running a durable workflow engine on your own machine* — free, OSS, no subscription — per
[`AGENTS.md`](../../../AGENTS.md). Use it to make [`saga-pattern-coach`](../saga-pattern-coach/SKILL.md) sagas concrete; contrast the scheduled model of [`airflow-local-lab`](../airflow-local-lab/SKILL.md).

## When to use

- The learner wants a local Temporal to watch workflows survive restarts and retry activities automatically.
- Reinforcing durable execution: workflow code is replayed from history, so activities must be idempotent.

## Mental model

- Temporal splits work into a deterministic **Workflow** (orchestration, replayed from an event history) and
  side-effecting **Activities**; a **Worker** polls a **Task Queue** and runs both. The dev server bundles the
  services + Web UI with local SQLite (Temporal, *temporal server start-dev*, docs.temporal.io, 2025).

## Procedure

1. **Concept:** the Workflow decides *what* runs; Activities do the I/O and may retry. The Web UI at localhost:**8233** shows every event.
2. **Start the server:** install the Temporal CLI, then `temporal server start-dev` — frontend gRPC on **7233**, Web UI on **8233**.
3. **Install the SDK:** `pip install temporalio` in a fresh virtualenv.
4. **Write workflow + activity:** decorate with `@activity.defn` and `@workflow.defn` / `@workflow.run` (below); the workflow calls the activity via `execute_activity`.
5. **Run a Worker + start it:** a `Worker` registers them on a task queue; `await Client.connect("localhost:7233")` then `execute_workflow` starts the run — watch it in the UI.
6. **Clean up:** stop the Worker and `Ctrl-C` the dev server; dev-server state is in-memory by default, so nothing persists.

## Output shape

```
from datetime import timedelta
from temporalio import activity, workflow
@activity.defn
async def greet(name: str) -> str: return f"Hello, {name}!"
@workflow.defn
class Greeting:
    @workflow.run
    async def run(self, name: str) -> str:
        return await workflow.execute_activity(
            greet, name, start_to_close_timeout=timedelta(seconds=10))
# Worker(client, task_queue="tq", workflows=[Greeting], activities=[greet]).run()
temporal server start-dev   # UI http://localhost:8233 · gRPC :7233
```

## Tips

- Keep **Workflow** code deterministic (no clocks, randomness, or direct network) — push all I/O into Activities.
- Activities retry on failure, so make them idempotent — see [`idempotency-coach`](../idempotency-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one activity to add + one timeout/retry to reason about yourself.
