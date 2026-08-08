---
name: load-testing-coach
description: "Design a load/performance test as a lesson — model realistic load, pick the right metrics (throughput, latency percentiles, error rate), choose ramp profiles (smoke/load/stress/soak/spike), and read the results to find the bottleneck. Use for 'load testing', 'performance test', 'k6', 'JMeter', 'how many users can it handle', 'stress test', 'p95/p99 latency', or learning performance testing."
argument-hint: "The system + SLA/goal"
---

# Load Testing Coach

Turn a vague "will it scale?" into a **designed experiment** — realistic load, honest metrics, and a
bottleneck you can name — per the teaching approach in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner needs to validate capacity or an SLA, or find where the system breaks.
- Feeds an [slo-designer](../slo-designer/SKILL.md) target; complements front-end work in [web-perf-audit](../web-perf-audit/SKILL.md).

## Procedure

1. **State the question & model the load.** Capacity, SLA validation, or breaking point? Model *realistic*
   traffic — endpoint mix, concurrency, think time, and varied data — from production logs, not a guess.
2. **Pick metrics that matter.** Throughput (requests/sec), **latency percentiles** (p50/p95/p99 — averages
   hide the tail), error rate, and resource saturation (CPU, memory, connections). Tie each to the goal.
3. **Choose the profile.** *Smoke* (tiny, sanity) → *load* (expected peak) → *stress* (beyond, find the knee)
   → *soak* (hours, find leaks) → *spike* (sudden surge). **Ramp gradually**; reach steady state before measuring.
4. **Run in a prod-like env.** Use a tool (k6, JMeter, Locust, Gatling) from enough load generators;
   isolate the system and monitor **server-side** too, so the client isn't the bottleneck.
5. **Read the results.** Report the tail, not the mean; plot latency vs. throughput to find the **knee**
   where latency climbs; note where errors begin. Trace the limit to CPU, DB, locks, or connection pools.
6. **Fix and retest.** Remove the top bottleneck, rerun the same profile, and record the supported capacity.

## Output shape

```
Goal: <capacity | SLA | breaking point> | SLA: p95 < Xms, errors < Y%
Workload model: <endpoint mix, concurrency, think time, data>
Profile: smoke → load → stress → soak/spike (ramp: …)
Results: throughput NN rps | p95 … p99 … | error onset at … | knee at …
Bottleneck: <CPU/DB/locks/pool> → fix → retest capacity
```

## Tips

- Averages lie under load — decisions live at p95/p99; correlate latency with throughput to find saturation.
- Terminology per k6/Grafana and JMeter docs; keep the load generator from becoming the bottleneck.
- Pair with `slo-designer`; end with the **Learning Footer** (`AGENTS.md`).
