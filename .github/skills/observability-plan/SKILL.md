---
name: observability-plan
description: "Instrument a service for observability as a lesson — the three pillars (metrics, logs, traces), OpenTelemetry, which signals matter (RED/USE), controlling cardinality and cost, and turning signals into dashboards and alerts. Use for 'add observability', 'instrument my service', 'set up metrics/logs/traces', 'OpenTelemetry setup', 'what should I monitor', or learning telemetry."
argument-hint: "The service/stack"
---

# Observability Plan

Instrument a service by *what question each signal answers* — so you can debug the unknown, not just
watch known dashboards — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [slo-designer](../slo-designer/SKILL.md).

## When to use

- The learner is adding telemetry to a service or can't answer "what's wrong?" from current signals.
- Reinforcing monitoring practice for an **SRE**, DevOps, or backend role-agent.

## Three pillars

| Pillar | Answers | Watch out for |
| --- | --- | --- |
| Metrics | how much / how often (cheap aggregates) | label **cardinality** |
| Logs | what happened (discrete events) | volume, cost, PII |
| Traces | where time went across services | sampling strategy |

## Procedure

1. **Instrument with OpenTelemetry:** vendor-neutral SDK exporting OTLP; combine auto-instrumentation
   with a few manual spans/metrics (OpenTelemetry docs, *Observability Primer*).
2. **Choose signals:** RED (Rate, Errors, Duration) for request services; USE (Utilization, Saturation,
   Errors) for resources — these become your SLIs (→ [slo-designer](../slo-designer/SKILL.md)).
3. **Correlate:** propagate `trace_id` into structured logs and use exemplars to jump metric → trace,
   so one incident isn't three disconnected tools.
4. **Control cardinality & cost:** bound label values, sample traces, and set log levels/retention —
   unbounded labels blow up cost and query latency.
5. **Dashboards & alerts:** dashboard the SLIs; alert on **symptoms** (user-facing SLO burn), not every
   cause, to cut noise and fatigue.

## Output shape

```
Service: … | Pillars: metrics + logs + traces via OpenTelemetry
Signals: RED (rate/errors/duration) | USE for resources
Correlation: trace_id in logs ; metric→trace exemplars
Cost guards: label budget, trace sampling %, log retention
Dashboards: SLI panels | Alerts: symptom-based (burn rate)
```

## Tips

- Alert on symptoms, not causes; page a human only for what a user would actually feel.
- Cardinality is the silent cost driver — never label metrics with user IDs or raw URLs.
- End with the **Learning Footer** (`AGENTS.md`) — one signal to add + one noisy alert to cut.
