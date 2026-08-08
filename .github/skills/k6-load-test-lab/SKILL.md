---
name: k6-load-test-lab
description: "Hands-on lab: script and run a load test locally with Grafana k6, the free OSS tool. Learn to write a JavaScript scenario, add checks and think time, ramp virtual users with stages, set pass/fail thresholds, and read the end-of-test summary — throughput and latency percentiles p90/p95/p99. Use for 'k6', 'load test locally', 'performance test lab', 'p95 latency', or learning load-test scripting hands-on."
argument-hint: "The endpoint + load goal/SLA"
---

# k6 Load Test Lab

A **hands-on lab** to script and run a load test **locally** with Grafana k6 (free/OSS), then read the
percentiles like an engineer, per the teaching approach in [`AGENTS.md`](../../../AGENTS.md).
Design the workload and metrics first with [load-testing-coach](../load-testing-coach/SKILL.md).

## When to use

- The learner wants to validate capacity or an SLA with a scripted, repeatable test — not a one-off guess.
- Learning why averages lie and how to gate a build on p95/p99 latency and error rate.
- Turning a "will it scale?" hunch into a scripted, versioned experiment you can rerun after each fix.

## Procedure

1. **Set up locally.** Install the k6 binary (package manager or release). Create `script.js` with
   `import http from 'k6/http'` and an `export default function` that hits the endpoint.
2. **Assert correctness.** Add `check(res, { 'status 200': r => r.status === 200 })` so failures surface as a
   check rate, and `sleep(1)` think time so virtual users pace like real ones.
3. **Model the load.** In `export const options`, ramp virtual users with `stages` (e.g. ramp to 20, hold, ramp down)
   — reach steady state before measuring; or override with `--vus`/`--duration`.
4. **Set thresholds (gates).** `thresholds: { http_req_duration: ['p(95)<500'], http_req_failed: ['rate<0.01'] }`
   — a breached threshold makes `k6 run` exit non-zero, so the SLA fails the pipeline automatically.
5. **Run it.** `k6 run script.js` — read the summary: `http_req_duration` avg/med/p(90)/p(95)/max plus
   iterations and requests/sec; the tail (p95/p99) is where user pain lives, not the average.
6. **Find the knee, fix, rerun.** Locate where latency climbs and errors begin, trace the limit (DB, CPU, pool),
   optionally stream results to JSON/CSV or Grafana, then remove the top bottleneck and retest the same profile.

## Output shape

```
Script: script.js  (stages ramp VUs, checks, sleep)
Thresholds: p(95)<500ms · http_req_failed<1%
Run: k6 run script.js   (or --vus 20 --duration 1m)
Summary: http_req_duration avg/med/p(90)/p(95)/max | iterations · NN rps
Verdict: thresholds ✓/✗ → knee at … → bottleneck → fix → rerun
```

## Tips

- Reference the Grafana k6 docs (options, thresholds, metrics); k6 joined Grafana Labs (2021) — search "grafana k6".
- Read the tail (p95/p99), not the mean; keep the load generator off the system-under-test box so the client isn't the limit.
- Pair with `load-testing-coach`; end with the **Learning Footer** (`AGENTS.md`) — the profile to keep + one threshold to add.
