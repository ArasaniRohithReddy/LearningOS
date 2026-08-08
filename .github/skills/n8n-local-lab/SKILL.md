---
name: n8n-local-lab
description: "Hands-on lab: run n8n (fair-code workflow automation) locally — free to self-host, no subscription. Start it with `npx n8n` or Docker, create the owner account, and build a no/low-code automation (trigger → nodes → action) in the editor UI at localhost:5678. Use for 'n8n lab', 'run n8n locally', 'self-host n8n', 'no-code automation', 'low-code workflow', 'webhook/schedule trigger', 'local automation no subscription', or learning workflow automation by doing."
argument-hint: "The automation to build"
---

# n8n Local Lab

Learn n8n by *building a real automation on your own machine* — free to self-host, no subscription — per
[`AGENTS.md`](../../../AGENTS.md). Contrast the code-first pipelines of [`data-pipeline-designer`](../data-pipeline-designer/SKILL.md) and [`prefect-local-lab`](../prefect-local-lab/SKILL.md).

## When to use

- The learner wants a visual, node-based tool to wire APIs and actions without writing a full program.
- Reinforcing triggers → transforms → actions, and when low-code beats hand-rolled glue scripts.

## Mental model

- An n8n **workflow** is a graph of **nodes**: one **trigger** node (Manual, Schedule, or Webhook) starts a run,
  then each node transforms JSON items and passes them on. It is **fair-code** under the Sustainable Use License —
  free to self-host for internal use (n8n Docs, *Sustainable Use License*, docs.n8n.io, 2025).

## Procedure

1. **Concept:** every run starts at exactly one **trigger** node; data flows node → node as JSON items you can inspect.
2. **Run it:** `npx n8n` (needs Node.js) *or* `docker run -it --rm -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n`.
3. **Open the editor:** browse to localhost:**5678** and create the **owner account** (the first user), prompted on first launch.
4. **Add a trigger:** start a new workflow and add a **Manual Trigger** (or a **Schedule Trigger** for cron-style runs).
5. **Add & connect nodes:** append an HTTP Request or Set node, wire the connection, then **Execute Workflow** and read each node's output.
6. **Save & activate:** save it; for Schedule/Webhook triggers, toggle **Active** so it runs on its own.

## Output shape

```
Run:    npx n8n   |   docker run -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
Editor: http://localhost:5678  → create owner account (first user)
Flow:   [Manual/Schedule Trigger] → [HTTP Request] → [Set] → (Execute Workflow)
Inspect: click a node → see JSON items in/out
Activate: Save → toggle Active (for Schedule/Webhook triggers)
License: fair-code, Sustainable Use License (free to self-host)
```

## Tips

- Persist the `n8n_data` volume (or `~/.n8n`) or you lose your workflows and credentials when the container is removed.
- Make webhook/schedule automations idempotent so a retried event can't double-send or double-charge — see [`idempotency-coach`](../idempotency-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one node to add + one trigger to reason about yourself.
