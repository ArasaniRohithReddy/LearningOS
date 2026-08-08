---
name: distributed-tracing-coach
description: "Instrument distributed tracing with OpenTelemetry as a lesson — model spans, propagate context across services, choose head vs tail sampling, and read a trace waterfall to find the latency culprit. Use for 'add tracing', 'OpenTelemetry traces', 'context propagation', 'trace sampling', 'why is this request slow', or learning distributed tracing. Grounded in OpenTelemetry and W3C Trace Context."
argument-hint: "The services"
---

# Distributed Tracing Coach

Trace a request across services so you can see *where the time went* instead of guessing — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [observability-plan](../observability-plan/SKILL.md) and [logging-strategy-coach](../logging-strategy-coach/SKILL.md).

## When to use

- The learner can't tell which service or call makes a multi-service request slow.
- Reinforcing the **traces** pillar for an SRE, DevOps, or backend role-agent.

## Concepts

| Term | Meaning |
| --- | --- |
| Trace | one request's journey end-to-end |
| Span | one unit of work (service/call) with timing |
| Context propagation | passing trace IDs across service hops |
| Sampling | which traces you keep (head vs tail) |

## Procedure

1. **Model spans:** one span per unit of work, nested parent→child, with attributes (service, route,
   status) — the building blocks of a trace (Google *Dapper* paper, 2010; OpenTelemetry Traces).
2. **Propagate context:** pass the `traceparent` header across every hop (W3C Trace Context, 2020) —
   broken propagation is the #1 reason traces fragment.
3. **Instrument with OpenTelemetry:** combine auto-instrumentation with a few manual spans, export
   OTLP, and add `trace_id` to logs (→ [logging-strategy-coach](../logging-strategy-coach/SKILL.md)).
4. **Sample deliberately:** head sampling is cheap but blind; tail sampling keeps errors and slow
   traces — choose per cost vs coverage, and keep 100% of errors if you can.
5. **Read the trace:** open the waterfall, find the **critical path** and the longest span → that is
   your latency culprit to fix next.

## Output shape

```
Services: … | SDK: OpenTelemetry → OTLP
Spans: 1 per unit of work, parent→child, key attributes
Propagate: W3C traceparent across every hop
Sampling: head (cheap) or tail (keep errors + slow)
Read: waterfall → critical path → longest span = culprit
```

## Tips

- If a trace stops at a service boundary, you dropped context propagation — fix that first.
- Tail sampling keeps the traces you actually want (errors, slow) at lower cost.
- End with the **Learning Footer** (`AGENTS.md`) — one span to add + one slow path to trace.
