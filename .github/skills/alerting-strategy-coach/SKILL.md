---
name: alerting-strategy-coach
description: "Design an alerting strategy as a lesson — alert on symptoms not causes, decide page vs ticket vs dashboard, set thresholds with multi-window burn-rate, and kill noise and alert fatigue. Use for 'design alerts', 'reduce alert noise', 'page vs ticket', 'burn-rate alerting', 'stop alert fatigue', or learning good alerting. Grounded in the Google SRE books."
argument-hint: "The service + signals"
---

# Alerting Strategy Coach

Design alerts that wake a human only for real, user-facing pain — every page actionable, the rest a
ticket or dashboard — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [slo-designer](../slo-designer/SKILL.md) and [observability-plan](../observability-plan/SKILL.md).

## When to use

- The learner's team is drowning in noisy alerts or pages no human can act on.
- Reinforcing alerting judgment for an **SRE**/DevOps role-agent.

## Page, ticket, or dashboard?

| Route | Use when |
| --- | --- |
| Page (wake someone) | user-facing, urgent, **needs a human now** |
| Ticket | real but can wait for business hours |
| Dashboard / log | informational; no action expected |

## Procedure

1. **Alert on symptoms:** page on user-visible pain — SLO burn, error rate, latency — not on every
   cause like CPU (Rob Ewaschuk, *My Philosophy on Alerting*, 2013; Google SRE book, 2016).
2. **Classify each alert:** page only if urgent **and** actionable **and** human-needed; otherwise a
   ticket or dashboard — pages that fail these tests are noise.
3. **Set thresholds by burn rate:** alert on error-budget consumption with **multi-window, multi-burn-rate**
   rules — fast burn (page) + slow burn (ticket) (Google *SRE Workbook*, 2018). Tie to → [slo-designer](../slo-designer/SKILL.md).
4. **Make every page actionable:** link a runbook and a first action (→ [oncall-runbook-coach](../oncall-runbook-coach/SKILL.md)); if
   there is nothing to do, it must not page.
5. **Kill fatigue:** track alert volume, tune or delete flappy alerts, dedupe and group, and review
   noisy pages each rotation — you are removing non-actionable noise, not coverage.

## Output shape

```
Service: … | Signals: SLO burn, errors, latency (symptom-based)
Routing: page = urgent+actionable+human | ticket | dashboard
Burn alerts: fast (page, e.g. 2%/1h) + slow (ticket, e.g. 10%/3d)
Every page → runbook link + first action
Noise review: top flappy alerts → tune/delete each rotation
```

## Tips

- If a page has no human action, downgrade it to a ticket — protect on-call sleep.
- Symptom alerts catch unknown failures; cause alerts only catch the ones you predicted.
- End with the **Learning Footer** (`AGENTS.md`) — one alert to make symptom-based + one to delete.
