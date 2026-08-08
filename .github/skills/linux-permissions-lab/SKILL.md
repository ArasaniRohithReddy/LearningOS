---
name: linux-permissions-lab
description: "Hands-on Linux lab on file permissions: read/write/execute (rwx) bits for user/group/other, chmod (symbolic and octal), chown/chgrp ownership, umask defaults, and special bits (setuid, setgid, sticky). Use for 'Linux permissions hands-on lab', 'chmod lab', 'permission denied', 'fix file permissions', 'what is umask', 'setuid vs setgid vs sticky bit', or learning Linux access control by doing."
argument-hint: "The access issue"
---

# Linux Permissions Lab

A guided, hands-on lab on Linux file permissions — read the mode, change it precisely, and understand umask
and special bits — following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).
Pairs with [`linux-command-coach`](../linux-command-coach/SKILL.md) and [`shell-scripting-coach`](../shell-scripting-coach/SKILL.md).

## When to use

- The learner hits "Permission denied" and needs to diagnose and fix it, not blindly `chmod 777`.
- Teaching least-privilege file access: the smallest bits that let the task work and no more.

## Procedure

1. **Concept.** Each file has three triads — **user/group/other** — each with **r=4, w=2, x=1**; on a
   directory `x` means "enter/traverse" and `r` means "list" (`chmod(1)`, GNU coreutils manual).
2. **Read the mode.** Run `ls -l` and `stat -c '%A %a %U:%G' file`; map `-rwxr-xr--` to octal `754`.
3. **Change it (exercise).** Symbolic `chmod u+x,go-w file` for intent, or octal `chmod 640 file` for an
   exact mode; set ownership with `sudo chown user:group file` (`chown(1)`).
4. **umask.** Your shell's `umask` masks default perms (base 666 files / 777 dirs); `umask 022` yields
   644 / 755 — check with `umask` and `umask -S` (bash(1), POSIX).
5. **Special bits.** `chmod u+s` (setuid) / `g+s` (setgid) / `+t` (sticky), or octal `4755 / 2755 / 1777`;
   setgid on a dir inherits its group, sticky (e.g. `/tmp`) lets only owners delete their own files.
6. **Verify & pitfalls.** ⚠ Never `chmod -R 777` — it makes files world-writable and clears setuid; avoid
   recursive changes on system paths. Confirm with `ls -l` / `stat`; a lone `s`/`t` with no `x` shows uppercase.

## Output shape

```
Symptom: Permission denied on <path>
Read: ls -l / stat -c '%A %a %U:%G'  → rwx triads (u/g/o)
Fix: chmod <u+x | 640> file   Own: sudo chown user:group file
umask: 022 → files 644, dirs 755   (base 666 / 777)
Special: setuid 4 / setgid 2 / sticky 1   (e.g. 2775 shared dir)
⚠ Avoid: chmod -R 777   Verify: ls -l shows the intended bits
```

## Tips

- Prefer octal for an exact target mode; symbolic (`g+w`) for a relative tweak — know both directions.
- `x` on a directory is the right to traverse it — a readable dir with no `x` still blocks access to its files.
- End with the **Learning Footer** (`AGENTS.md`) — the rwx→octal map to memorize + a `stat` drill to run yourself.
