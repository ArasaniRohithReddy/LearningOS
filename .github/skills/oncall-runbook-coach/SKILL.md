---
name: oncall-runbook-coach
description: "Build on-call readiness as a lesson — an escalation policy, a runbook index, the first-open dashboards, an alert-to-action map, and a clean shift handoff. Use for 'set up on-call', 'on-call readiness', 'escalation policy', 'runbook index', 'alert to runbook mapping', 'on-call handoff', or learning on-call. Grounded in the Google SRE books."
argument-hint: "The team/service"
---

# On-Call Runbook Coach

Make on-call humane and effective — every page maps to an action, every shift hands off cleanly —
per [`AGENTS.md`](../../../AGENTS.md). Pairs with [runbook-writer](../runbook-writer/SKILL.md) and [alerting-strategy-coach](../alerting-strategy-coach/SKILL.md).

## When to use

- The learner is standing up or improving an on-call rotation for a team/service.
- Reinforcing on-call operations for an **SRE**/DevOps role-agent.

## Escalation tiers

| Tier | Role & expectation |
| --- | --- |
| Primary | first responder, acks within SLA |
| Secondary | backup if primary misses the ack |
| Escalation | incident lead / manager for Sev-1 |

## Procedure

1. **Define the escalation policy:** primary → secondary → manager, with ack/response-time
   expectations and clear contact paths (Google SRE book, *Being On-Call*, 2016).
2. **Build a runbook index:** one linked runbook per alert; write the gaps (→ [runbook-writer](../runbook-writer/SKILL.md)).
3. **Curate first-open dashboards:** the golden-signal/SLO views on-call opens first (→
   [observability-plan](../observability-plan/SKILL.md) and [slo-designer](../slo-designer/SKILL.md)).
4. **Map alert → action:** pair each page with its first response, runbook, and owner — the core of
   readiness (→ [alerting-strategy-coach](../alerting-strategy-coach/SKILL.md)).
5. **Handoff ritual:** end-of-shift summary of open incidents, risks, and silenced alerts.
6. **Keep it sustainable:** cap shift length and page volume, and rehearse (→ [incident-response-drill](../incident-response-drill/SKILL.md)).

## Output shape

```
Team/Service: … | Rotation: primary → secondary → manager (ack SLA)
Runbook index: 1 alert → 1 runbook (write the gaps)
Dashboards: golden-signal/SLO views opened first
Alert→action: [page] → first response → runbook → owner
Handoff: open incidents | risks | silenced alerts
```

## Tips

- Every alert needs a runbook and an owner; unowned pages become 3 a.m. guesswork.
- Protect the human: cap pages per shift and rotate fairly — sustainable on-call is reliable on-call.
- End with the **Learning Footer** (`AGENTS.md`) — one alert to map to an action + one handoff gap to close.
