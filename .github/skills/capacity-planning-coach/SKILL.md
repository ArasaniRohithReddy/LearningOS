---
name: capacity-planning-coach
description: "Plan capacity and scaling as a lesson — model peak demand from growth, find per-instance limits with load testing, size headroom (Little's Law), autoscale on the right signal, and balance cost. Use for 'capacity planning', 'how many instances', 'plan for scale', 'autoscaling strategy', 'headroom and saturation', or learning capacity planning. Grounded in the Google SRE book and the USE method."
argument-hint: "The service + growth"
---

# Capacity Planning Coach

Size a service from evidence — measured limits and forecast demand — instead of guessing, per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [slo-designer](../slo-designer/SKILL.md) and [observability-plan](../observability-plan/SKILL.md).

## When to use

- The learner must decide how much to provision, or a service is saturating under load.
- Reinforcing capacity and scaling judgment for an **SRE**/DevOps role-agent.

## Demand inputs

| Input | Example |
| --- | --- |
| Demand driver | requests/sec, QPS, active connections |
| Growth + seasonality | +X%/quarter, daily/holiday peaks |
| Per-instance limit | max throughput before SLO breaks |
| Headroom target | N+1 / N+2, % buffer for spikes |

## Procedure

1. **Model demand:** pick the driving metric (RPS/QPS/connections) and forecast **peak**, not
   average, including growth and seasonal spikes.
2. **Find the ceiling:** load-test one instance to saturation for max safe throughput before latency
   or error SLOs break (→ [load-testing-coach](../load-testing-coach/SKILL.md)) — in a prod-like env, never blindly against prod.
3. **Size with headroom:** instances = peak ÷ per-instance limit, plus a buffer (e.g., N+1); recall
   **Little's Law** — concurrency ≈ arrival rate × latency (Google SRE book, *Handling Overload*, 2016).
4. **Autoscale on the right signal:** scale on utilization/saturation (USE method, Brendan Gregg,
   2012), set min/max and cooldowns, and shed load to avoid cascading failure.
5. **Balance cost:** right-size instances, use reserved/spot for baseline vs burst, and re-forecast
   regularly — over-provision only reliability-critical paths.

## Output shape

```
Service: … | Demand driver: … | Forecast peak: …
Per-instance limit: … (load test to saturation)
Instances = peak ÷ limit + headroom (N+1 / % buffer)
Autoscale on: utilization/saturation | min/max | cooldown
Cost: right-size + reserved/spot | shed load before collapse
```

## Tips

- Plan for peak with headroom; averages hide the spikes that actually page you.
- Autoscaling can't outrun a cascading failure — add load shedding and sane limits.
- End with the **Learning Footer** (`AGENTS.md`) — the demand metric to forecast + one limit to load-test.
