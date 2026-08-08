---
name: prometheus-grafana-local-lab
description: "Hands-on lab: run Prometheus + Grafana locally with Docker — scrape metrics from a target, query with PromQL, and build a dashboard. Local, free, open-source, no subscription. Use for 'Prometheus Grafana lab', 'the metrics', 'scrape metrics locally', 'PromQL practice', 'local Grafana dashboard', or learning metrics monitoring by doing."
argument-hint: "The metrics"
---

# Prometheus + Grafana Local Lab

Learn metrics monitoring by *running the stack yourself* — scrape, query with PromQL, and dashboard,
all local and free with no subscription — per [`AGENTS.md`](../../../AGENTS.md). Pairs with
[observability-plan](../observability-plan/SKILL.md) and [alerting-strategy-coach](../alerting-strategy-coach/SKILL.md).

## When to use

- The learner wants to see real metrics flow end-to-end without any hosted or paid service.
- Reinforcing the **metrics** pillar for an SRE, DevOps, or backend role-agent.

## Procedure

1. **Concept:** Prometheus *pulls* metrics by scraping each target's HTTP `/metrics` endpoint on an
   interval and stores them as time series; Grafana queries Prometheus to draw panels (Prometheus
   *Overview*, prometheus.io, 2024).
2. **Docker Compose:** define a `prometheus` service (mount `prometheus.yml`) and a `grafana` service,
   then `docker compose up -d` and `docker compose ps` to confirm both run before configuring.
3. **Configure:** in `prometheus.yml` add a `scrape_configs` job (start by scraping Prometheus itself,
   `localhost:9090`); in Grafana add a **Prometheus data source** at `http://prometheus:9090`.
4. **Verify:** open Prometheus (`:9090`) and run PromQL `up` (1 = target reachable); in Grafana
   (`:3000`, login `admin`/`admin`) build a panel, e.g. `rate(prometheus_http_requests_total[5m])`.
5. **Clean up:** `docker compose down` (add `-v` only to also delete Grafana's named volume and data).

## Output shape

```yaml
services:
  prometheus:
    image: prom/prometheus:v3.1.0        # official OSS image
    volumes: ["./prometheus.yml:/etc/prometheus/prometheus.yml:ro"]
    ports: ["9090:9090"]
  grafana:
    image: grafana/grafana:11.4.0        # OSS edition, free
    ports: ["3000:3000"]
    depends_on: [prometheus]
# prometheus.yml → scrape_configs: [{ job_name: prometheus, static_configs: [{ targets: ["localhost:9090"] }] }]
```

## Tips

- Services reach each other by name on the Compose network — use `http://prometheus:9090`, not localhost.
- PromQL `rate()`/`increase()` need a **counter** and a range vector `[5m]`; graphing a raw counter misleads.
- End with the **Learning Footer** (`AGENTS.md`) — one PromQL query to master + one panel to add yourself.
