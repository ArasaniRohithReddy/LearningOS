---
name: docker-networking-lab
description: "Hands-on lab on Docker networking — connect containers the free, local way with no subscription: compare the default bridge, a user-defined bridge with automatic DNS, and host mode; resolve services by name and publish ports. Use for 'Docker networking lab', 'the container networking', 'containers can't reach each other', 'container DNS', 'bridge vs host', or learning Docker networks by doing. Includes a network-cleanup safety note."
argument-hint: "The container networking"
---

# Docker Networking Lab

Learn container networking by *wiring two containers together yourself* — free, local, no
subscription — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [docker-compose-lab](../docker-compose-lab/SKILL.md) and [k8s-service-networking-lab](../k8s-service-networking-lab/SKILL.md).

## When to use

- The learner has containers that can't reach each other and needs to understand Docker DNS.
- Building intuition for bridge vs host networking before Compose or Kubernetes Services.

## Mental model

- Each container gets its own network namespace. A **user-defined bridge** connects containers *and*
  gives them **embedded DNS**, so they resolve each other by **container name**. The **default**
  bridge has no auto-DNS; **host** mode drops isolation (Linux) and skips port mapping; only
  **published** ports are reachable from the host.

## Procedure

1. **Concept:** contrast default bridge, user-defined bridge (DNS), and host mode with their trade-offs.
2. **Create a network:** `docker network create appnet` (a user-defined bridge) (Docker docs,
   *Networking overview* / *Bridge network driver*, docs.docker.com, 2024).
3. **Attach containers:** `docker run -d --name db --network appnet <img>` and `... --name app
   --network appnet ...`; publish only what the host needs with `-p`.
4. **Verify DNS & reachability:** `docker exec app getent hosts db` (name resolves), `docker exec app
   ping -c1 db`, and `docker network inspect appnet` to list members.
5. **Clean up:** `docker rm -f app db`, then ⚠ `docker network rm appnet` (only after containers detach).

## Output shape

```
Network: appnet (user-defined bridge, embedded DNS)
Create: docker network create appnet
Attach: docker run --network appnet --name db|app | Publish: -p host:container
Verify: getent hosts db / ping db (name-based) | docker network inspect
Clean: docker rm -f app db → docker network rm appnet
```

## Tips

- On the *default* bridge, containers resolve by IP only — use a user-defined bridge for name DNS.
- ⚠ `docker network prune` deletes all unused networks — scope cleanup to the one you created.
- End with the **Learning Footer** (`AGENTS.md`) — one network to create + one name to resolve yourself.
