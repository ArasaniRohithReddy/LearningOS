---
name: docker-volumes-lab
description: "Hands-on lab on Docker volumes — persist container data the free, local way with no subscription: compare named volumes vs bind mounts, prove data survives container removal, and back up and restore a volume. Use for 'Docker volumes lab', 'the persistence need', 'data disappears when the container restarts', 'named volume vs bind mount', 'back up a volume', or learning Docker persistence by doing. Includes a data-loss safety note."
argument-hint: "The persistence need"
---

# Docker Volumes Lab

Learn persistence by *making data outlive a container yourself* — free, local, no subscription — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [docker-compose-lab](../docker-compose-lab/SKILL.md) and [dockerfile-coach](../dockerfile-coach/SKILL.md).

## When to use

- The learner's data vanishes when a container is recreated and needs durable storage.
- Choosing between a **named volume** and a **bind mount** for a database or dev workflow.

## Mental model

- A container's writable layer dies with it. A **named volume** is Docker-managed storage that
  persists independently and is portable; a **bind mount** maps a specific **host path** into the
  container (great for live-editing dev source, but host-dependent). Pick volumes for data, bind
  mounts for code.

## Procedure

1. **Concept:** contrast named volume vs bind mount vs tmpfs and when each fits.
2. **Create a volume:** `docker volume create appdata` (Docker docs, *Volumes* / *Bind mounts*,
   docs.docker.com, 2024).
3. **Mount & write:** `docker run -d --name db -v appdata:/var/lib/<db> <img>`, then write some rows/files.
4. **Prove persistence:** `docker rm -f db`, re-run with the *same* `-v appdata:...`, and confirm the
   data is still there; `docker volume inspect appdata`.
5. **Back up / restore:** `docker run --rm -v appdata:/data -v ${PWD}:/backup busybox tar czf
   /backup/appdata.tgz -C /data .` (restore by untarring back into the volume).
6. **Clean up:** `docker rm -f db`, then ⚠ `docker volume rm appdata` **destroys the data** — back up first.

## Output shape

```
Volume: appdata (named, Docker-managed) vs bind: ${PWD}/src → /app
Create: docker volume create appdata
Persist: run -v appdata:/path → write → rm -f → re-run → data survives
Backup: docker run --rm -v appdata:/data -v ${PWD}:/backup busybox tar czf …
Clean: docker rm -f db → docker volume rm appdata (destroys data)
```

## Tips

- Use a **named volume** for databases; a **bind mount** for source you edit live during development.
- ⚠ `docker volume rm` and `docker volume prune` permanently delete data — back up before removing.
- End with the **Learning Footer** (`AGENTS.md`) — one volume to persist + one backup to take yourself.
