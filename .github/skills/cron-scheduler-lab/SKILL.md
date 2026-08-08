---
name: cron-scheduler-lab
description: "Hands-on lab: schedule jobs locally with cron — free, built-in, no subscription. Read the five crontab fields, install jobs with `crontab -e`, capture output to a log, use absolute paths, and make runs idempotent with flock and a marker file. Use for 'cron lab', 'schedule a job locally', 'crontab syntax', 'cron logging', 'idempotent cron runs', 'stop overlapping cron jobs', or learning job scheduling by doing."
argument-hint: "The job to schedule"
---

# Cron Scheduler Lab

Learn cron by *scheduling a real recurring job on your own machine* — free, built-in, no subscription — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [`bash-cron-lab`](../bash-cron-lab/SKILL.md); graduate to a real orchestrator via [`prefect-local-lab`](../prefect-local-lab/SKILL.md) or [`airflow-dag-coach`](../airflow-dag-coach/SKILL.md).

## When to use

- The learner wants the simplest possible scheduler for recurring local tasks — no daemon to install.
- Practising the three things a cron job must get right: timing, logging, and safe reruns.

## Mental model

- **cron** is a daemon that runs commands on a schedule set by five time fields — minute, hour, day-of-month,
  month, day-of-week — then the command. It runs with a **minimal** environment (no `~`, aliases, or your login
  `PATH`), so absolute paths and explicit logging are mandatory (`man 5 crontab`; Vixie cron / cronie, 2024).

## Procedure

1. **Read the fields:** `*/5 * * * *` = every 5 min; `0 2 * * 1` = 02:00 each Monday; `*` = every.
2. **Install a job:** `crontab -e` to edit, `crontab -l` to list. ⚠ `crontab -r` erases your crontab with no prompt.
3. **Use absolute paths:** cron's `PATH` is bare — call `/usr/bin/python3 /home/me/etl.py`, or set `PATH=` at the top of the file.
4. **Log both streams:** append `>> "$HOME/etl.log" 2>&1`, or the output is silently discarded.
5. **Make it idempotent:** wrap in `flock -n` (no overlap) and guard with a marker/state file so a rerun is a no-op.
6. **Verify:** run the command by hand first, then watch the log after the schedule fires.

## Output shape

```
# crontab -e  → run etl.py at 02:30 daily, logged, no overlap, idempotent
30 2 * * * /usr/bin/flock -n /home/me/.etl.lock \
  /usr/bin/python3 /home/me/etl.py >> /home/me/etl.log 2>&1

Fields:    <min hour dom mon dow> → <command>
Hardening: absolute paths · >> log 2>&1 · flock -n · marker file · MAILTO
Check:     fires on time? output logged? safe if a previous run is still active?
```

## Tips

- ⚠ Test the script by hand first — a broken cron job fails *silently* and repeats the failure forever.
- Idempotency is the whole game for schedulers: a missed or retried run must not double-process — see [`idempotency-coach`](../idempotency-coach/SKILL.md).
- On Windows, run cron inside WSL (or use Task Scheduler). End with the **Learning Footer** (`AGENTS.md`).
