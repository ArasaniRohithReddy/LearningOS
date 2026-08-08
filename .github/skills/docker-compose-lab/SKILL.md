---
name: docker-compose-lab
description: "Hands-on lab on Docker Compose — build a multi-service app step by step: define services, a shared network, and named volumes, wire env/config, and order startup with depends_on + healthchecks. Use for 'Docker Compose lab', 'the multi-container app', 'compose file walkthrough', 'services can't reach each other', 'wait for the database', or learning Compose by doing. Includes a destructive-command safety note."
argument-hint: "The multi-container app"
---

# Docker Compose Lab

Learn Compose by *building a running multi-service stack yourself*, one service at a time — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [dockerfile-coach](../dockerfile-coach/SKILL.md) and [kubernetes-manifest-coach](../kubernetes-manifest-coach/SKILL.md).

## When to use

- The learner wants several containers running together (app + db + cache) on one host.
- Reinforcing local-dev orchestration before graduating to Kubernetes.

## Mental model

- A `compose.yaml` declares **services** (containers) on a shared **network** — services reach each
  other by *service name* as DNS — plus named **volumes** for data that must outlive a container.

## Procedure

1. **Scaffold one service:** `services: web: {build|image, ports}`, then `docker compose up` and
   `docker compose ps` to confirm it runs — verify before adding more.
2. **Add a backing service:** add `db:` with a named **volume** so data survives recreates; it joins
   the default network and `web` resolves it by the name `db`.
3. **Wire config:** pass `environment:` / `env_file:`; keep real secrets out of the file and git.
4. **Order startup:** give `db` a `healthcheck:`, then `depends_on: { db: { condition:
   service_healthy } }` so `web` waits for a *ready* db, not just a started one (Compose docs,
   *Services top-level element* / *Control startup order*, docs.docker.com, 2024).
5. **Verify & tear down:** `docker compose logs -f`, hit the app, then ⚠ `docker compose down`
   (add `-v` **only** when you truly intend to delete the volumes and their data).

## Output shape

```
Stack: <web + db + cache> | File: compose.yaml
Services: <name → image/build, ports> | Network: default (name-based DNS)
Volumes: <named → mount path> | Config: environment/env_file (secrets excluded)
Startup: healthcheck(db) → depends_on condition: service_healthy
Verify: up → ps → logs -f | Teardown: down (−v destroys data)
```

## Tips

- Reach a service by its *service name*, never `localhost`; only published `ports:` are host-visible.
- ⚠ `down -v` and `docker volume rm` delete data — never run them against shared or prod stacks.
- End with the **Learning Footer** (`AGENTS.md`) — one healthcheck to add + one volume to name yourself.
