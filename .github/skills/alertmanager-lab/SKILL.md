---
name: alertmanager-lab
description: "Hands-on lab: run Prometheus Alertmanager locally with Docker — route, group, and deduplicate firing alerts to receivers with a routing tree. Local, free, open-source, no subscription. Use for 'Alertmanager lab', 'the alerts', 'route alerts locally', 'grouping and inhibition', 'webhook receiver', or learning alert routing by doing."
argument-hint: "The alerts"
---

# Prometheus Alertmanager Lab

Learn alert routing by *running Alertmanager yourself* — group, deduplicate, and route firing alerts
to receivers — all local and free with no subscription, per [`AGENTS.md`](../../../AGENTS.md). Pairs
with [alerting-strategy-coach](../alerting-strategy-coach/SKILL.md) and [observability-plan](../observability-plan/SKILL.md).

## When to use

- The learner wants to see how firing alerts are grouped and routed before wiring real notifications.
- Reinforcing the **alerting** layer for an SRE, DevOps, or backend role-agent.

## Procedure

1. **Concept:** Prometheus evaluates alert rules and *pushes* firing alerts to Alertmanager, which
   **deduplicates**, **groups**, walks a **route** tree, and calls a **receiver** (Alertmanager
   *Configuration* docs, prometheus.io, 2024).
2. **Docker Compose:** run `prom/alertmanager`, mount `alertmanager.yml` under `/etc/alertmanager/`,
   publish `9093`; `docker compose up -d`, then open the UI at `:9093`.
3. **Configure:** set a top `route` with `group_by`, `group_wait`, `group_interval`, `repeat_interval`,
   and a default `receiver`; add child `routes` with `matchers` plus an `inhibit_rules` block.
4. **Verify:** push a test alert with `amtool alert add ...` (or `curl` `/api/v2/alerts`) and watch it
   group in the UI; `amtool config routes test` shows which receiver a label set matches.
5. **Clean up:** `docker compose down` (add `-v` only to also delete Alertmanager's silence/state volume).

## Output shape

```yaml
services:
  alertmanager:
    image: prom/alertmanager:v0.28.0        # official OSS image
    command: ["--config.file=/etc/alertmanager/alertmanager.yml"]
    volumes: ["./alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro"]
    ports: ["9093:9093"]
# alertmanager.yml → route: { group_by: [alertname], group_wait: 30s, receiver: web }
#                    receivers: [{ name: web, webhook_configs: [{ url: "http://sink:8080/" }] }]
```

## Tips

- Tune `group_by`/`group_wait` to batch related alerts into one notification instead of a page storm.
- Point Prometheus (from [prometheus-grafana-local-lab](../prometheus-grafana-local-lab/SKILL.md)) at it via `alerting.alertmanagers`; keep **rules** in Prometheus, routing in Alertmanager.
- End with the **Learning Footer** (`AGENTS.md`) — one route matcher to add + one inhibit rule to write yourself.
