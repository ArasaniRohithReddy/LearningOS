---
name: logging-strategy-coach
description: "Design a structured logging strategy as a lesson — structured JSON events, log levels, correlation and trace IDs, what to log and what never to log (secrets/PII), sampling, and cost control. Use for 'design logging', 'structured logging', 'log levels', 'correlation IDs in logs', 'reduce log cost', or learning logging. Grounded in OpenTelemetry and OWASP guidance."
argument-hint: "The service/stack"
---

# Logging Strategy Coach

Design logs you can actually query under pressure — structured, correlated, and cheap enough to
keep — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [observability-plan](../observability-plan/SKILL.md) and [distributed-tracing-coach](../distributed-tracing-coach/SKILL.md).

## When to use

- The learner's logs are unstructured, noisy, or too expensive to retain.
- Reinforcing the **logs** pillar for an SRE, DevOps, or backend role-agent.

## Log levels

| Level | Use for |
| --- | --- |
| ERROR | a failed operation needing attention |
| WARN | recoverable / degraded; may need action |
| INFO | key business events (default in prod) |
| DEBUG | developer detail (off/sampled in prod) |

## Procedure

1. **Log structured events:** emit JSON key–value fields, not free-text strings, so logs are
   machine-queryable and aggregatable (12-Factor App, *Logs*, 2017; OpenTelemetry logs).
2. **Use levels consistently:** define what each level means, default to INFO in prod, and wire level
   into alert routing (→ [alerting-strategy-coach](../alerting-strategy-coach/SKILL.md)).
3. **Correlate:** inject `trace_id`/`span_id` plus a request/correlation ID into every line (W3C Trace
   Context, 2020) so logs join to traces (→ [distributed-tracing-coach](../distributed-tracing-coach/SKILL.md)).
4. **Never log secrets or PII:** no passwords, tokens, or card/PII data; redact at the source (OWASP
   *Logging Cheat Sheet*) — a prod safety and compliance rule, not optional.
5. **Control volume & cost:** sample high-frequency logs, tier retention (hot vs archive), and drop
   chatty DEBUG in prod before it dominates the bill.

## Output shape

```
Service: … | Format: structured JSON
Levels: ERROR/WARN/INFO(default)/DEBUG(sampled)
Correlate: trace_id + span_id + request_id on every line
Never log: passwords, tokens, PII (redact at source)
Cost: sample high-volume | retention tiers | drop prod DEBUG
```

## Tips

- A log line no one can query or afford to keep is not observability — it is cost.
- Redaction belongs at the log call site, not a downstream filter you might forget.
- End with the **Learning Footer** (`AGENTS.md`) — one field to structure + one thing to stop logging.
