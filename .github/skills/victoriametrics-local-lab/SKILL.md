---
name: victoriametrics-local-lab
description: "Hands-on lab: run VictoriaMetrics (single-node OSS) locally with Docker — scrape and ingest metrics, then query them with MetricsQL in the built-in vmui. Local, free, open-source, no subscription. Use for 'VictoriaMetrics lab', 'the metrics', 'ingest metrics locally', 'MetricsQL practice', 'vmui query', or learning a time-series database by doing."
argument-hint: "The metrics"
---

# VictoriaMetrics Local Lab

Learn time-series storage by *running VictoriaMetrics yourself* — scrape targets, ingest samples, and
query with MetricsQL — all local and free with no subscription, per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [observability-plan](../observability-plan/SKILL.md) and [alerting-strategy-coach](../alerting-strategy-coach/SKILL.md).

## When to use

- The learner wants a fast, low-memory metrics store with a PromQL-compatible query language locally.
- Reinforcing the **metrics** pillar for an SRE, DevOps, or backend role-agent.

## Procedure

1. **Concept:** VictoriaMetrics single-node is one binary that stores metrics and speaks **MetricsQL**,
   a backwards-compatible superset of PromQL; it can scrape targets itself or accept Prometheus
   `remote_write` (VictoriaMetrics docs, docs.victoriametrics.com, 2024).
2. **Docker Compose:** run `victoriametrics/victoria-metrics` with `-promscrape.config=/etc/vm/scrape.yml`
   and `-retentionPeriod=1`, publishing `8428`; `docker compose up -d`.
3. **Configure:** `scrape.yml` uses Prometheus `scrape_configs` syntax — start by scraping VM's own
   `/metrics` (`localhost:8428`); or point a Prometheus `remote_write` at `.../api/v1/write`.
4. **Verify:** open the built-in UI at `:8428/vmui`, run MetricsQL like
   `rate(vm_http_requests_total[5m])`, then try a MetricsQL extra such as `rollup_rate(...)`.
5. **Clean up:** `docker compose down` (add `-v` only to also delete VM's `-storageDataPath` volume).

## Output shape

```yaml
services:
  victoriametrics:
    image: victoriametrics/victoria-metrics:v1.107.0   # single-node OSS
    command:
      - "-promscrape.config=/etc/vm/scrape.yml"
      - "-retentionPeriod=1"                            # months to keep data
    volumes: ["./scrape.yml:/etc/vm/scrape.yml:ro"]
    ports: ["8428:8428"]   # HTTP API + vmui + remote_write endpoint
# scrape.yml → scrape_configs: [{ job_name: victoriametrics, static_configs: [{ targets: ["localhost:8428"] }] }]
```

## Tips

- VictoriaMetrics is a drop-in **remote_write** store for [prometheus-grafana-local-lab](../prometheus-grafana-local-lab/SKILL.md) when Prometheus retention is too short.
- MetricsQL is a superset of PromQL — existing queries work, but `rate()` still needs a counter and a range vector.
- End with the **Learning Footer** (`AGENTS.md`) — one MetricsQL query to master + one scrape target to add yourself.
