---
name: gcp-tasks-emulator-lab
description: "Hands-on GCP lab: practice Cloud Tasks locally and fully offline with the free open-source gcloud-tasks-emulator (aertje/cloud-tasks-emulator) — no Google Cloud billing account, no subscription, no real credentials. Start the container, set CLOUD_TASKS_EMULATOR_HOST and wire an insecure gRPC endpoint in code, then use the client libraries to create queues and tasks. Use for 'learn Cloud Tasks without billing', 'local Cloud Tasks emulator', 'offline GCP task queue lab', 'CLOUD_TASKS_EMULATOR_HOST', 'cloud-tasks-emulator', 'hands-on lab', or practicing queues and tasks by doing."
argument-hint: "The Tasks scenario (queues/tasks/dispatch)"
---

# GCP Tasks Emulator Lab

Learn Cloud Tasks by *running a local emulator* — boot the container, point your client at it, enqueue a task and
watch it dispatch — no project or bill, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [floci-gcp-local-lab](../floci-gcp-local-lab/SKILL.md) and [gcp-iam-lab](../gcp-iam-lab/SKILL.md).

## When to use

- The learner wants runnable Cloud Tasks practice with no Google Cloud billing, subscription, or budget.
- Reinforcing hands-on async patterns (queues, tasks, HTTP targets) offline for a **GCP/backend** role-agent.

## Procedure

1. **Concept:** Cloud Tasks has **no official Google emulator**; aertje/cloud-tasks-emulator is a free **third-party**
   OSS server that mimics the v2 gRPC API for dev/test — rate-limiting, retry/backoff, and dispatch timing are
   approximate (github.com/aertje/cloud-tasks-emulator, 2026).
2. **Start it:** `docker run -p 8123:8123 ghcr.io/aertje/cloud-tasks-emulator:latest -host 0.0.0.0 -port 8123`
   serves the emulator on `localhost:8123`.
3. **Point your tools:** set `CLOUD_TASKS_EMULATOR_HOST=localhost:8123` as a **your-code convention** — unlike
   Pub/Sub, the SDK does *not* auto-read it, so build the client with that endpoint + an **insecure gRPC** channel.
4. **Do a small exercise:** create a queue, then create a task with an HTTP target pointing at a local test server
   and let the emulator dispatch it.
5. **Verify:** your local endpoint receives the task request — approximate behavior, so cross-check retry, rate,
   and dispatch-deadline semantics against the official Cloud Tasks docs.
6. ⚠ **Clean up:** stop the container (Ctrl-C / `docker stop`) and `unset CLOUD_TASKS_EMULATOR_HOST`; in-memory
   state is gone on exit, but a stale value silently keeps apps pointed at nothing.

## Output shape

```
Start:  docker run -p 8123:8123 ghcr.io/aertje/cloud-tasks-emulator:latest -host 0.0.0.0 -port 8123
Point:  export CLOUD_TASKS_EMULATOR_HOST=localhost:8123  (your code: apiEndpoint + insecure gRPC)
Try:    create queue → create task (HTTP target) → emulator dispatches
Verify: local endpoint gets the request   ·   Clean: docker stop + unset CLOUD_TASKS_EMULATOR_HOST ⚠
# start (separate terminals)
docker run -p 8123:8123 ghcr.io/aertje/cloud-tasks-emulator:latest -host 0.0.0.0 -port 8123
# in the app terminal, before running your code:
export CLOUD_TASKS_EMULATOR_HOST=localhost:8123
# NOTE: SDK ignores this var — pass apiEndpoint=localhost:8123 + an insecure channel in code
```

## Tips

- It's free and useful but *not* Google's product and *approximate* — there is no standard `*_EMULATOR_HOST` the SDK honors, so you must wire the insecure endpoint in code and validate retry/dispatch behavior against the official Cloud Tasks docs.
- Great for testing handlers without real HTTP-target auth; pair queue-access design with [gcp-iam-lab](../gcp-iam-lab/SKILL.md) and reuse local wiring alongside [floci-gcp-local-lab](../floci-gcp-local-lab/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one feature (scheduled tasks, retry config) to try next + one behavior to verify against real Cloud Tasks yourself.
