---
name: locust-load-test-lab
description: "Hands-on lab: write user-behavior load tests locally with Locust, the free Python OSS tool, and drive them from its web UI. Learn to model real users with HttpUser and @task, set wait_time, launch the local web UI on port 8089, watch RPS and response-time percentiles live, and run headless with CSV output for CI. Use for 'Locust', 'Python load test', 'load test web UI locally', or learning user-behavior load testing hands-on."
argument-hint: "The endpoints + user behavior/mix"
---

# Locust Load Test Lab

A **hands-on lab** to model realistic user behavior and run a load test **locally** with Locust (free/OSS,
Python), watching the live web UI, per the teaching approach in [`AGENTS.md`](../../../AGENTS.md).
Design the workload mix and metrics first with [load-testing-coach](../load-testing-coach/SKILL.md).

## When to use

- The learner prefers Python and wants to express load as *user behavior* (tasks, weights, wait times).
- Learning to steer a test interactively from a web UI, then reproduce it headless in CI.
- Translating production traffic shares into weighted tasks so the synthetic load resembles real users.

## Procedure

1. **Set up locally.** With Python 3, `pip install locust` (a virtualenv keeps it isolated). Create a
   `locustfile.py` next to your project.
2. **Model behavior.** Define `class WebUser(HttpUser)` with `wait_time = between(1, 5)` and `@task` methods that
   call endpoints via `self.client`; **weight** tasks (e.g. `@task(3)`) so the mix mirrors real traffic.
3. **Launch the web UI.** `locust -f locustfile.py --host http://localhost:8000`, open `http://localhost:8089`,
   set the user count + spawn rate, and start the swarm.
4. **Read it live.** Watch RPS, median and 95th-percentile response times, and the failure count on the
   Statistics and Charts tabs; download the CSV report for a permanent record.
5. **Reproduce headless.** `locust -f locustfile.py --headless -u 100 -r 10 --run-time 1m --csv=out` runs the
   same scenario with no UI, so CI gets identical, comparable numbers on every commit.
6. **Scale & analyze.** If one process saturates its CPU, add workers (`--processes -1` or a distributed run)
   so the generator isn't the bottleneck; then read the percentiles, fix the limit, and rerun.

## Output shape

```
locustfile.py: HttpUser + @task (weighted mix) · wait_time = between(1,5)
UI: locust -f locustfile.py --host http://localhost:8000 → http://localhost:8089
Headless: locust --headless -u 100 -r 10 --run-time 1m --csv=out
Live: NN rps | median / 95%ile response time | failures %
Verdict: percentile vs SLA → bottleneck → fix → rerun
```

## Tips

- Reference docs.locust.io ("Writing a locustfile", "Running distributed"); the web UI defaults to port 8089.
- Locust is free/OSS; weight tasks to reflect real usage; if one machine can't generate enough load, add workers.
- Pair with `load-testing-coach`; end with the **Learning Footer** (`AGENTS.md`) — the behavior model to keep + one task to add.
