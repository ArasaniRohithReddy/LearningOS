---
name: metrics-definition-coach
description: "Define product metrics and KPIs that drive the right behavior — one North Star, supporting metrics via HEART or AARRR, guardrail/counter-metrics, and a vanity-metric check. Use for 'define product metrics', 'what's my North Star metric', 'KPIs for X', 'HEART framework', 'guardrail metrics', or 'is this a vanity metric'. Guards against Goodhart's Law; pairs with okr-coach and ab-test-designer."
argument-hint: "The product + goal"
---

# Metrics Definition Coach

Turn a goal into metrics that reflect real value — not numbers that only look good — following
[`AGENTS.md`](../../../AGENTS.md). Pairs with [`okr-coach`](../okr-coach/SKILL.md) and [`ab-test-designer`](../ab-test-designer/SKILL.md).

## When to use

- The learner needs a metric tree that ties daily work to the product's core value.
- Auditing existing KPIs for vanity, gaming, or missing guardrails.

## Procedure

1. **Name the value and goal:** the outcome the product creates for users and the business — metrics
   serve it, not the reverse.
2. **Pick one North Star:** the single metric that best captures delivered value (e.g., weekly active
   teams, nights booked) — a focal point, not the only number.
3. **Decompose into supporting metrics** with a framework: **HEART** (Happiness, Engagement,
   Adoption, Retention, Task success) for UX, or **AARRR** across the funnel — each with goal → signal.
4. **Split leading vs. lagging:** leading metrics you can act on this week; lagging ones confirm the
   outcome later — you need both.
5. **Add guardrails / counter-metrics:** what must *not* get worse (latency, churn, unit cost) —
   because any single target invites gaming (Goodhart's Law).
6. **Vanity check:** for each metric ask "would a change move a decision?" — if not, cut it; prefer
   rates and cohorts over ever-rising totals.

## Output shape

```
Product value & goal: …
North Star: <metric> — captures value because …
Supporting (HEART / AARRR):
  • <dimension>: goal … → signal / metric …
Leading: … | Lagging: …
Guardrails / counter-metrics: … must not worsen
Vanity check: <metric> → decision it informs (or cut)
```

## Tips

- If a metric would not change a decision, it is decoration — cut it.
- Every target invites gaming; guardrails keep the North Star honest (Goodhart's Law).
- Rates, ratios, and cohorts beat cumulative totals that only ever climb.
- End with the **Learning Footer** (`AGENTS.md`).
