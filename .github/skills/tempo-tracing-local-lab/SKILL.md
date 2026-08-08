---
name: tempo-tracing-local-lab
description: "Hands-on lab: run Grafana Tempo locally with Docker — store traces sent over OTLP and query them in Grafana with TraceQL. Local, free, open-source, no subscription. Use for 'Tempo lab', 'the traces', 'store traces locally', 'TraceQL query', 'view traces in Grafana', or learning a trace backend by doing."
argument-hint: "The traces"
---

# Grafana Tempo Tracing Local Lab

Learn trace storage by *running Tempo yourself* — ingest OTLP spans, then query them in Grafana with
TraceQL — all local and free with no subscription, per [`AGENTS.md`](../../../AGENTS.md). Pairs with
[distributed-tracing-coach](../distributed-tracing-coach/SKILL.md) and [observability-plan](../observability-plan/SKILL.md).

## When to use

- The learner wants a scalable trace **store** to query with TraceQL, not just an all-in-one viewer.
- Reinforcing the **traces** pillar for an SRE, DevOps, or backend role-agent.

## Procedure

1. **Concept:** Tempo is a high-scale trace **backend** that needs only object storage; it ingests via
   OTLP and is queried by **trace ID** or **TraceQL** through Grafana (Grafana *Tempo* docs,
   grafana.com/docs/tempo, 2024).
2. **Docker Compose:** run `grafana/tempo` with `-config.file=/etc/tempo.yaml` (publish `3200`), plus
   `grafana/grafana` (`3000`); `docker compose up -d`, then `docker compose ps`.
3. **Configure:** in `tempo.yaml` enable `distributor.receivers.otlp` (opens `4317`/`4318`) and a
   `local` storage backend; in Grafana add a **Tempo data source** at `http://tempo:3200`.
4. **Verify:** send spans over OTLP, open Grafana *Explore* → Tempo, run TraceQL `{}` (all traces),
   narrow with `{ .service.name = "my-app" }`, then open a trace's span waterfall.
5. **Clean up:** `docker compose down` (add `-v` only to also delete Tempo's local trace volume).

## Output shape

```yaml
services:
  tempo:
    image: grafana/tempo:2.6.1               # official OSS image
    command: ["-config.file=/etc/tempo.yaml"]
    volumes: ["./tempo.yaml:/etc/tempo.yaml:ro"]
    ports: ["3200:3200", "4317:4317", "4318:4318"]   # HTTP API + OTLP in
  grafana:
    image: grafana/grafana:11.4.0            # OSS edition, free
    ports: ["3000:3000"]
    depends_on: [tempo]
```

## Tips

- Send spans through [opentelemetry-collector-lab](../opentelemetry-collector-lab/SKILL.md) first to add batching and sampling before Tempo.
- Prefer Tempo for cheap long-term storage; reach for [jaeger-tracing-local-lab](../jaeger-tracing-local-lab/SKILL.md) when you just want a zero-config viewer.
- End with the **Learning Footer** (`AGENTS.md`) — one TraceQL filter to master + one service to trace yourself.
