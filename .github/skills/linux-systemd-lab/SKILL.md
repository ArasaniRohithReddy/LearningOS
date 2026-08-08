---
name: linux-systemd-lab
description: "Hands-on Linux lab on systemd services: read unit files, start/stop/restart, enable at boot, check status, and read logs with journalctl (journald). Use for 'systemd hands-on lab', 'systemctl lab', 'start a service', 'enable service at boot', 'service won't start', 'read journald logs', 'systemctl status', or learning Linux service management by doing."
argument-hint: "The service"
---

# Linux systemd Lab

A guided, hands-on lab on systemd — manage a service unit, enable it at boot, and read its logs — following the
teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`linux-command-coach`](../linux-command-coach/SKILL.md) and [`shell-scripting-coach`](../shell-scripting-coach/SKILL.md).

## When to use

- A service is down or won't come up at boot and the learner needs status + logs to diagnose it.
- Teaching the unit model: what `start` vs `enable` mean and where journald keeps the evidence.

## Procedure

1. **Concept.** systemd manages **units**; a `.service` has `[Unit]`, `[Service]`, `[Install]` sections and lives
   in `/etc/systemd/system` (admin) or `/usr/lib/systemd/system` (vendor) — systemd.unit(5), systemd.service(5).
2. **Inspect.** `systemctl status <name>` shows active state, main PID, and recent log lines; `systemctl cat <name>`
   prints the resolved unit; `systemctl list-units --type=service` lists active ones.
3. **Run it (exercise).** `sudo systemctl start|stop|restart <name>`; `reload` re-reads config without a full
   restart when the service supports it.
4. **Enable at boot.** `start` runs it *now*; `enable` links it for *boot*. Use `sudo systemctl enable --now <name>`
   to do both; confirm with `is-active` and `is-enabled` (systemctl(1)).
5. **Read logs.** `journalctl -u <name> -e` (jump to end), `-f` (follow), `-b` (this boot), `-p err` (priority) —
   journald captures the unit's stdout/stderr (journalctl(1)).
6. **Verify & pitfalls.** ⚠ After editing a unit run `sudo systemctl daemon-reload`; prefer `systemctl edit` drop-ins
   over touching vendor files; don't disable services you depend on. Confirm via `status` + `journalctl`.

## Output shape

```
Unit: <name>.service   Files: /etc/systemd/system, /usr/lib/systemd/system
Status: systemctl status <name>  → active (running) | failed  + PID + logs
Now vs boot: start = now ; enable = boot ; enable --now = both
Logs: journalctl -u <name> -e | -f | -b | -p err
Edit: systemctl edit <name> ; sudo systemctl daemon-reload
Verify: systemctl is-active <name> = active ; is-enabled = enabled
```

## Tips

- `enable` alone won't start a stopped service now, and `start` alone won't survive reboot — use `enable --now`.
- A failed start almost always explains itself in `systemctl status` + `journalctl -u <name>` — read it before guessing.
- End with the **Learning Footer** (`AGENTS.md`) — the start-vs-enable distinction + a `journalctl -u` drill to run.
