---
name: slo-designer
description: "Define SLIs, SLOs, and error budgets for a service as a lesson — choose good indicators (availability, latency, error rate, freshness), set targets from user expectations, compute the error budget, and tie it to on-call and release policy. Use for 'define SLOs', 'set an error budget', 'pick SLIs', 'reliability targets', or learning SRE. Grounded in the Google SRE book."
argument-hint: "The service + reliability expectations"
---

# SLO Designer

Set reliability targets the way SREs reason — measure what users feel, then budget the rest — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [observability-plan](../observability-plan/SKILL.md) and [incident-response-drill](../incident-response-drill/SKILL.md).

## When to use

- The learner needs meaningful reliability targets, not vibes, for a service they own.
- Connecting reliability to release and on-call decisions for an **SRE**/DevOps role-agent.

## Definitions

| Term | Meaning |
| --- | --- |
| SLI | a measured quality signal: good events ÷ valid events |
| SLO | target for the SLI over a window (e.g., 99.9% / 28d) |
| Error budget | `1 − SLO` — the allowed unreliability to spend |

## Procedure

1. **Pick SLIs** from the user journey — availability, latency, error rate, freshness — measured at the
   point closest to the user (Google SRE book, *Service Level Objectives*, 2016).
2. **Define good vs. valid** precisely (e.g., "requests served < 300 ms ÷ all valid requests").
3. **Set the target** from user expectations, not 100% — 100% is the wrong target and blocks all change;
   choose a rolling window (commonly 28–30 days).
4. **Compute the error budget** (`1 − SLO`) and add burn-rate alerts (a fast burn and a slow burn).
5. **Tie budget to policy:** budget healthy → ship features; budget exhausted → freeze risky releases
   and invest in reliability. Feed on-call via [incident-response-drill](../incident-response-drill/SKILL.md).

## Output shape

```
Service: … | User journey: …
SLI: good/valid = … (measured at <edge/LB/client>)
SLO: 99.9% over 28d | Error budget: 0.1% ≈ <X min>/28d
Burn alerts: fast (e.g., 2%/1h) + slow (e.g., 10%/3d)
Policy: budget left → release ; budget out → freeze + reliability work
```

## Tips

- A few SLOs that reflect real user pain beat many vanity metrics — 100% is never the target.
- Budgets only work if honored; agree the freeze rule with the team *before* you burn it.
- End with the **Learning Footer** (`AGENTS.md`) — the SLI to add + the target to justify yourself.
