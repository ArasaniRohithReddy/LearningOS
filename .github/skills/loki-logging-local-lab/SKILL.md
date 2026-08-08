---
name: loki-logging-local-lab
description: "Hands-on lab: run Grafana Loki locally with Docker — ship logs with Promtail, query with LogQL, and view them in Grafana. Local, free, open-source, no subscription. Use for 'Loki lab', 'the logs', 'ship logs locally', 'LogQL practice', 'view logs in Grafana', or learning log aggregation by doing."
argument-hint: "The logs"
---

# Grafana Loki Logging Local Lab

Learn log aggregation by *running Loki yourself* — ship logs, query with LogQL, and view in Grafana,
all local and free with no subscription — per [`AGENTS.md`](../../../AGENTS.md). Pairs with
[logging-strategy-coach](../logging-strategy-coach/SKILL.md) and [prometheus-grafana-local-lab](../prometheus-grafana-local-lab/SKILL.md).

## When to use

- The learner wants centralized logs locally without any hosted or paid logging service.
- Reinforcing the **logs** pillar for an SRE, DevOps, or backend role-agent.

## Procedure

1. **Concept:** Loki indexes only **labels** (not full text), so it stays cheap; an agent
   (**Promtail**, or its successor **Grafana Alloy**) tails files and *pushes* lines to Loki (Loki
   *Overview*, grafana.com/oss/loki, 2024).
2. **Docker Compose:** run `loki` (`:3100`), `promtail` (mount its config plus a log path), and
   `grafana` (`:3000`); `docker compose up -d`, then check `docker compose ps`.
3. **Configure:** Promtail's config sets a `clients` push URL `http://loki:3100/loki/api/v1/push`
   and a scrape job with labels; in Grafana add a **Loki data source** at `http://loki:3100`.
4. **Verify:** in Grafana *Explore*, run a LogQL query like `{job="varlogs"}`, then filter with
   `|= "error"` to watch matching lines stream in from your target.
5. **Clean up:** `docker compose down` (add `-v` only to also delete Loki's chunk-data volume).

## Output shape

```yaml
services:
  loki:
    image: grafana/loki:3.3.2            # official OSS image
    command: -config.file=/etc/loki/local-config.yaml
    ports: ["3100:3100"]
  promtail:
    image: grafana/promtail:3.3.2
    volumes: ["./promtail.yml:/etc/promtail/config.yml:ro", "/var/log:/var/log:ro"]
  grafana:
    image: grafana/grafana:11.4.0        # reuse to view metrics + logs
    ports: ["3000:3000"]
    depends_on: [loki]
```

## Tips

- Keep label **cardinality** low — never label logs with request IDs; filter those with LogQL instead.
- Reuse the same Grafana from [prometheus-grafana-local-lab](../prometheus-grafana-local-lab/SKILL.md) to see metrics and logs together.
- End with the **Learning Footer** (`AGENTS.md`) — one label to add + one LogQL filter to master.
