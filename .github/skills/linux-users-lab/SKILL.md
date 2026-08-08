---
name: linux-users-lab
description: "Hands-on Linux lab on users and groups: create and modify accounts with useradd/usermod, manage supplementary groups, grant sudo safely with visudo, and handle passwords and account aging with passwd/chage. Use for 'Linux users hands-on lab', 'user/group lab', 'add a user', 'grant sudo', 'usermod -aG', 'lock an account', 'password expiry chage', or learning Linux account management by doing."
argument-hint: "The account"
---

# Linux Users Lab

A guided, hands-on lab on Linux accounts — create a user, place them in groups, grant sudo safely, and manage
their password — following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Pairs
with [`linux-command-coach`](../linux-command-coach/SKILL.md) and [`shell-scripting-coach`](../shell-scripting-coach/SKILL.md).

## When to use

- The learner must add or modify an account, fix group membership, or grant sudo without locking anyone out.
- Teaching where identity lives (`/etc/passwd`, `/etc/shadow`, `/etc/group`) and how to change it safely.

## Procedure

1. **Concept.** Accounts live in `/etc/passwd`, hashed passwords in `/etc/shadow`, groups in `/etc/group`; a user
   has one **primary** group and any number of **supplementary** groups (useradd(8), group(5)).
2. **Create (exercise).** `sudo useradd -m -s /bin/bash alice` (`-m` makes the home dir); set a password with
   `sudo passwd alice`; inspect with `id alice` and `getent passwd alice`.
3. **Groups.** Add supplementary membership with `sudo usermod -aG sudo alice` — the **`-a` is mandatory**, or
   `-G` *replaces* every supplementary group. Verify with `groups alice`.
4. **Grant sudo.** Add the user to the `sudo` (Debian) or `wheel` (RHEL) group, or add a rule via
   **`sudo visudo`** / a file in `/etc/sudoers.d/` — visudo syntax-checks to prevent lockout (sudoers(5), visudo(8)).
5. **Passwords & aging.** `passwd -l`/`-u` lock/unlock; `chage -l alice` lists aging; `chage -M 90 -E 2026-12-31 alice`
   sets max age and an expiry date (passwd(1), chage(1)).
6. **Verify & pitfalls.** ⚠ `usermod -G` without `-a` drops other groups (can remove sudo); always edit sudoers with
   `visudo`; `userdel -r` also deletes the home dir. Confirm with `id`, `groups`, and `sudo -l -U alice`.

## Output shape

```
Files: /etc/passwd (accounts) · /etc/shadow (hashes) · /etc/group
Create: useradd -m -s /bin/bash alice ; passwd alice ; id alice
Groups: usermod -aG <grp> alice   (⚠ -a required, or -G replaces all)
Sudo: add to sudo/wheel OR visudo → /etc/sudoers.d/  (visudo checks syntax)
Aging: passwd -l|-u ; chage -l alice ; chage -M 90 -E <date> alice
⚠ visudo only ; usermod needs -a   Verify: id ; groups ; sudo -l -U alice
```

## Tips

- The most common mistake is `usermod -G` without `-a` — it silently *replaces* the user's supplementary groups.
- Never hand-edit `/etc/sudoers`; `visudo` validates syntax so one typo can't lock everyone out of root access.
- End with the **Learning Footer** (`AGENTS.md`) — the `-aG` rule + a create-user-and-grant-sudo drill to run.
