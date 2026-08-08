---
name: jaeger-tracing-local-lab
description: "Hands-on lab: run Jaeger all-in-one locally with Docker — send traces over OpenTelemetry (OTLP) and explore spans in the Jaeger UI. Local, free, open-source, no subscription. Use for 'Jaeger lab', 'the tracing', 'send traces locally', 'OpenTelemetry OTLP to Jaeger', 'explore spans', or learning distributed tracing by doing."
argument-hint: "The tracing"
---

# Jaeger Tracing Local Lab

Learn tracing by *running Jaeger yourself* — emit spans over OTLP and read the waterfall — all local
and free with no subscription, per [`AGENTS.md`](../../../AGENTS.md). Pairs with
[distributed-tracing-coach](../distributed-tracing-coach/SKILL.md) and [observability-plan](../observability-plan/SKILL.md).

## When to use

- The learner wants a real trace backend to send spans to without any hosted or paid service.
- Reinforcing the **traces** pillar for an SRE, DevOps, or backend role-agent.

## Procedure

1. **Concept:** a **trace** is one request's journey; each **span** is a timed unit of work. Jaeger
   *all-in-one* bundles collector, in-memory storage, query, and UI in one container (Jaeger
   *Getting Started*, jaegertracing.io, 2024).
2. **Docker Compose:** run `jaegertracing/all-in-one` with `COLLECTOR_OTLP_ENABLED=true`, publishing
   `16686` (UI), `4317` (OTLP gRPC), and `4318` (OTLP HTTP); `docker compose up -d`.
3. **Configure:** point your app's OpenTelemetry SDK or Collector `OTEL_EXPORTER_OTLP_ENDPOINT` at
   `http://localhost:4317` (gRPC) or `:4318` (HTTP) so spans export straight to Jaeger.
4. **Verify:** generate a few requests, open the UI (`:16686`), pick your **Service**, click *Find
   Traces*, and open a trace to inspect the span waterfall and the longest span.
5. **Clean up:** `docker compose down` — all-in-one uses in-memory storage, so traces vanish on stop.

## Output shape

```yaml
services:
  jaeger:
    image: jaegertracing/all-in-one:1.62.0   # official OSS image
    environment: ["COLLECTOR_OTLP_ENABLED=true"]
    ports:
      - "16686:16686"   # Jaeger UI
      - "4317:4317"     # OTLP gRPC receiver
      - "4318:4318"     # OTLP HTTP receiver
```

## Tips

- Send OTLP straight to Jaeger for a lab; add an OpenTelemetry Collector later for routing and sampling.
- If no traces appear, check the exporter endpoint/port and that the SDK actually flushed spans on exit.
- End with the **Learning Footer** (`AGENTS.md`) — one span attribute to add + one slow path to trace.
