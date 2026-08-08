---
name: linux-processes-lab
description: "Hands-on Linux lab on processes: inspect with ps and top, send signals with kill (SIGTERM vs SIGKILL), manage shell jobs (bg/fg/jobs/nohup), and set priority with nice/renice. Use for 'Linux processes hands-on lab', 'ps/top lab', 'kill a process', 'SIGTERM vs SIGKILL', 'background a job', 'nice/renice priority', or learning Linux process control by doing."
argument-hint: "The process"
---

# Linux Processes Lab

A guided, hands-on lab on Linux processes — find them, signal them, background them, and reprioritize them —
following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`linux-command-coach`](../linux-command-coach/SKILL.md) and [`shell-scripting-coach`](../shell-scripting-coach/SKILL.md).

## When to use

- A process is hung or hogging CPU and the learner needs to inspect, signal, or reprioritize it safely.
- Teaching the signal model and job control instead of reflexively reaching for `kill -9`.

## Procedure

1. **Concept.** A process has a **PID**, a parent (**PPID**), a state, and a niceness; **signals** are how the OS
   asks or forces it to act (`ps(1)`, `signal(7)`).
2. **Inspect.** `ps aux` / `ps -ef` for a snapshot, `top` (or `htop`) live; find one with `pgrep -a name` or
   `pidof name`. Note the PID, %CPU, and **NI** (nice) columns.
3. **Signal (exercise).** `kill <pid>` sends **SIGTERM (15)** — a polite "clean up and exit"; `kill -9` sends
   **SIGKILL** the process can't catch. `kill -HUP` often reloads config; `pkill`/`killall` match by name.
4. **Job control.** `cmd &` backgrounds; **Ctrl-Z** suspends; `jobs`, `bg %1`, `fg %1` manage them; `nohup cmd &`
   or `disown` let a job survive logout (bash job-control manual).
5. **Priority.** `nice -n 10 cmd` starts it low-priority; `renice -n 5 -p <pid>` adjusts a running one. Range is
   **-20 (highest) … 19 (lowest)**; only root may go negative (nice(1), renice(1)).
6. **Verify & pitfalls.** ⚠ SIGKILL gives no chance to flush or clean up — try SIGTERM first; never signal PID 1.
   Confirm the process is gone with `ps`/`pgrep` and check the new NI value in `top`.

## Output shape

```
Find: ps aux | grep <name>  /  pgrep -a <name>   → PID, %CPU, NI
Signal: kill <pid> (SIGTERM 15)  → last resort kill -9 (SIGKILL)
Jobs: cmd &  ·  Ctrl-Z  ·  jobs / bg %1 / fg %1  ·  nohup cmd &
Priority: nice -n 10 cmd ; renice -n 5 -p <pid>   (range -20…19)
⚠ Prefer SIGTERM ; never kill PID 1   Verify: pgrep <name> is empty
```

## Tips

- `kill` doesn't only "kill" — it *sends a signal*; default 15 asks nicely, 9 is the non-negotiable last resort.
- Lower nice number = more CPU priority; you can always lower your own priority, but not raise it without root.
- End with the **Learning Footer** (`AGENTS.md`) — the SIGTERM-before-SIGKILL habit + a `nice`/`renice` drill to run.
