---
name: node-exporter-lab
description: "Hands-on lab: run Prometheus node_exporter locally with Docker — expose host CPU, memory, disk, and filesystem metrics for Prometheus to scrape. Local, free, open-source, no subscription. Use for 'node_exporter lab', 'the host metrics', 'host metrics locally', 'scrape node_exporter', 'node_cpu_seconds_total', or learning host monitoring by doing."
argument-hint: "The host metrics"
---

# node_exporter Host Metrics Lab

Learn host monitoring by *running node_exporter yourself* — expose kernel and hardware metrics and
scrape them with Prometheus — all local and free with no subscription, per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [observability-plan](../observability-plan/SKILL.md) and [prometheus-grafana-local-lab](../prometheus-grafana-local-lab/SKILL.md).

## When to use

- The learner wants real host CPU/memory/disk metrics from a *NIX machine without any paid agent.
- Reinforcing the **metrics** pillar (resource USE) for an SRE, DevOps, or backend role-agent.

## Procedure

1. **Concept:** node_exporter reads the kernel's `/proc` and `/sys` and exposes host CPU, memory, disk,
   and filesystem metrics at `/metrics` via pluggable **collectors** (Prometheus *node_exporter* guide,
   prometheus.io, 2024).
2. **Docker Compose:** run `prom/node-exporter` with host `/proc`, `/sys`, and `/` mounted read-only and
   matching `--path.*` flags, publish `9100`; `docker compose up -d`.
3. **Configure:** node_exporter is flag-driven — enable/disable collectors (e.g. `--collector.processes`)
   and exclude pseudo filesystems; add a Prometheus job scraping `node-exporter:9100`.
4. **Verify:** curl `:9100/metrics`, then in Prometheus query `node_memory_MemAvailable_bytes` or
   `rate(node_cpu_seconds_total{mode="idle"}[5m])` to watch host load.
5. **Clean up:** `docker compose down`; node_exporter is stateless, so nothing persists once it stops.

## Output shape

```yaml
services:
  node-exporter:
    image: prom/node-exporter:v1.8.2        # official OSS image
    command:
      - "--path.procfs=/host/proc"
      - "--path.sysfs=/host/sys"
      - "--path.rootfs=/rootfs"
    volumes: ["/proc:/host/proc:ro", "/sys:/host/sys:ro", "/:/rootfs:ro"]
    ports: ["9100:9100"]
```

## Tips

- On Linux, `pid: host` and `network_mode: host` give the most accurate view; only published `9100` is needed to scrape.
- Pair node_exporter (host) with [cadvisor-lab](../cadvisor-lab/SKILL.md) (containers) for complete USE-method coverage.
- End with the **Learning Footer** (`AGENTS.md`) — one node metric to master + one collector to toggle yourself.
