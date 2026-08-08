---
name: cadvisor-lab
description: "Hands-on lab: run cAdvisor locally with Docker — expose per-container CPU, memory, network, and filesystem metrics for Prometheus to scrape. Local, free, open-source, no subscription. Use for 'cAdvisor lab', 'the container metrics', 'container resource usage locally', 'scrape cAdvisor', 'container_cpu_usage', or learning container monitoring by doing."
argument-hint: "The container metrics"
---

# cAdvisor Container Metrics Lab

Learn container monitoring by *running cAdvisor yourself* — expose live per-container resource metrics
and scrape them with Prometheus — all local and free with no subscription, per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [observability-plan](../observability-plan/SKILL.md) and [prometheus-grafana-local-lab](../prometheus-grafana-local-lab/SKILL.md).

## When to use

- The learner wants real container CPU/memory/IO metrics without any hosted or paid agent.
- Reinforcing the **metrics** pillar (resource USE) for an SRE, DevOps, or backend role-agent.

## Procedure

1. **Concept:** cAdvisor (Container Advisor) auto-discovers every running container and exposes its CPU,
   memory, network, and filesystem usage as Prometheus metrics at `/metrics` (Google *cadvisor* repo,
   github.com/google/cadvisor, 2024).
2. **Docker Compose:** run `gcr.io/cadvisor/cadvisor` with read-only host mounts (`/`, `/var/run`,
   `/sys`, `/var/lib/docker`), publish `8080`; `docker compose up -d`.
3. **Configure:** nothing to configure in cAdvisor — add a Prometheus `scrape_configs` job targeting
   `cadvisor:8080` so its metrics land in your TSDB.
4. **Verify:** open the built-in UI at `:8080`, then in Prometheus query
   `rate(container_cpu_usage_seconds_total[5m])` or `container_memory_usage_bytes` per container.
5. **Clean up:** `docker compose down`; cAdvisor is stateless, so nothing persists once it stops.

## Output shape

```yaml
services:
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:v0.49.1   # official Google OSS image
    ports: ["8080:8080"]
    volumes:
      - "/:/rootfs:ro"
      - "/var/run:/var/run:ro"
      - "/sys:/sys:ro"
      - "/var/lib/docker/:/var/lib/docker:ro"
    devices: ["/dev/kmsg"]                     # needed on some Linux hosts
```

## Tips

- Pair cAdvisor (containers) with [node-exporter-lab](../node-exporter-lab/SKILL.md) (host) for full USE-method coverage.
- Container series carry `name`/`image`/`id` labels — aggregate by `name`, and never graph a raw counter without `rate()`.
- End with the **Learning Footer** (`AGENTS.md`) — one container metric to master + one Prometheus job to add yourself.
