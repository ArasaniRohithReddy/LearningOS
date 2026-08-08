---
name: opentelemetry-collector-lab
description: "Hands-on lab: run the OpenTelemetry Collector locally with Docker — build a receivers → processors → exporters pipeline for traces, metrics, and logs. Local, free, open-source, no subscription. Use for 'OpenTelemetry Collector lab', 'the telemetry pipeline', 'run the collector locally', 'OTLP receiver and exporter', 'batch processor', or learning telemetry pipelines by doing."
argument-hint: "The telemetry pipeline"
---

# OpenTelemetry Collector Local Lab

Learn telemetry routing by *running the Collector yourself* — wire receivers → processors → exporters
and watch OTLP flow — all local and free with no subscription, per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [observability-plan](../observability-plan/SKILL.md) and [distributed-tracing-coach](../distributed-tracing-coach/SKILL.md).

## When to use

- The learner wants one agent to receive, process, and fan out telemetry without any hosted collector.
- Reinforcing the vendor-neutral **pipeline** layer for an SRE, DevOps, or backend role-agent.

## Procedure

1. **Concept:** the Collector is a vendor-agnostic pipeline — **receivers** take data in, **processors**
   batch/transform it, **exporters** send it out, joined per signal under `service.pipelines`
   (OpenTelemetry *Collector* docs, opentelemetry.io, 2024).
2. **Docker Compose:** run `otel/opentelemetry-collector-contrib`, mount your config at
   `/etc/otelcol-contrib/config.yaml`, publish `4317` (OTLP gRPC) and `4318` (OTLP HTTP); `up -d`.
3. **Configure:** define `receivers: otlp`, `processors: [memory_limiter, batch]`, and start with the
   `debug` exporter, then wire a `traces` pipeline `[otlp] → [memory_limiter, batch] → [debug]`.
4. **Verify:** send OTLP to `localhost:4318`, watch spans print from the `debug` exporter in
   `docker compose logs -f`; the Collector's own `:8888/metrics` confirms it is healthy.
5. **Clean up:** `docker compose down`; later swap `debug` for an `otlp`/`prometheus` exporter to ship
   to [tempo-tracing-local-lab](../tempo-tracing-local-lab/SKILL.md) or a metrics backend.

## Output shape

```yaml
services:
  otel-collector:
    image: otel/opentelemetry-collector-contrib:0.116.0   # official OSS distro
    command: ["--config=/etc/otelcol-contrib/config.yaml"]
    volumes: ["./config.yaml:/etc/otelcol-contrib/config.yaml:ro"]
    ports:
      - "4317:4317"   # OTLP gRPC receiver
      - "4318:4318"   # OTLP HTTP receiver
      - "8888:8888"   # collector's own metrics
# config.yaml → service.pipelines.traces: { receivers: [otlp], processors: [batch], exporters: [debug] }
```

## Tips

- Order matters: put `memory_limiter` first and `batch` last so batches respect the memory limit.
- The `logging` exporter was renamed **`debug`** — use `debug` on current builds; route the logs pipeline per [logging-strategy-coach](../logging-strategy-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one processor to add + one exporter to wire yourself.
