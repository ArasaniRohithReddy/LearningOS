---
name: bash-cron-lab
description: "Hands-on Bash lab on scheduling jobs with cron: the five crontab time fields, crontab -e/-l, capturing output to a log, absolute paths in cron's minimal environment, and idempotent jobs guarded by flock. Use for 'practice cron', 'hands-on lab', 'crontab syntax', 'schedule a bash job', 'cron logging', 'stop overlapping cron jobs', or learning job scheduling in Bash by doing."
argument-hint: "The scheduled task"
---

# Bash Cron Lab

Learn to schedule jobs that **actually run and leave a trail** — with cron syntax, logging, and locking —
a guided, hands-on lab following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *practice* writing crontab entries and safe scheduled scripts, not just read syntax.
- Automating recurring tasks; pairs with [`shell-scripting-coach`](../shell-scripting-coach/SKILL.md).

## Procedure
**Concept (60s):** each crontab line is five time fields — minute hour day-of-month month day-of-week —
then the command; cron runs it with a *minimal* environment (`man 5 crontab`; Vixie cron).

1. **Open crontab:** `crontab -e` to edit, `crontab -l` to list. ⚠ `crontab -r` erases it with no prompt.
2. **Read the fields:** `*/5 * * * *` = every 5 min; `0 2 * * 1` = 02:00 each Monday; `*` means every.
3. **Use absolute paths:** cron's `PATH` is bare — call `/usr/bin/rsync`, or set `PATH=` at the top of the file.
4. **Log everything:** append both streams — `>> "$HOME/job.log" 2>&1` — or the output is discarded.
5. **Make it idempotent:** wrap the job in `flock -n "$HOME/.job.lock"` so overlapping runs can't collide.

**Reference sketch:**
```bash
# crontab -e  → run backup.sh at 02:30 daily, logged, no overlap
MAILTO="me@example.com"
30 2 * * * /usr/bin/flock -n /home/me/.backup.lock /home/me/backup.sh >> /home/me/backup.log 2>&1
```
**Pitfalls:** a literal `%` must be escaped as `\%` in crontab; cron has no `~`, aliases, or your login
`PATH`; jobs run in the system timezone; long jobs overlap unless guarded by `flock`.

## Output shape
```
Schedule: <min hour dom mon dow> → <command>
Hardening: absolute paths ; >> log 2>&1 ; flock lock ; idempotent body
Check: runs on time? output logged? safe if the previous run is still active?
```

## Tips
- ⚠ Test the script by hand first — a broken cron job fails silently and repeats the failure forever.
- Redirect to a log and read it; set `MAILTO=""` (or a real address) to catch cron's own errors.
- Pair with [`shell-scripting-coach`](../shell-scripting-coach/SKILL.md) & [`linux-command-coach`](../linux-command-coach/SKILL.md); version crontabs with [`git-coach`](../git-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
