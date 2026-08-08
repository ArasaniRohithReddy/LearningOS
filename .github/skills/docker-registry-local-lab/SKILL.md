---
name: docker-registry-local-lab
description: "Hands-on lab to run a private Docker Registry locally with the open-source registry:2 image — no subscription, no Docker Hub — then tag, push, and pull your own images, list the catalog via the /v2 API, and persist data with a volume. Use for 'local registry', 'private image repo', 'push/pull without Docker Hub', 'registry:2', or learning container image distribution by doing."
argument-hint: "The image to push/pull locally"
---

# Docker Registry Local Lab

Learn how container images move by running your *own* private registry — the open-source `registry:2`
image — then push and pull to it, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [dockerfile-coach](../dockerfile-coach/SKILL.md) and [ci-pipeline-builder](../ci-pipeline-builder/SKILL.md).

## When to use

- You want a private image store on your machine or LAN — no Docker Hub account, no pull-rate limits.
- Learning image naming, tags, and distribution before wiring a registry into CI.

## Mental model

- A registry is an HTTP service speaking the **/v2** Distribution API. An image name that begins with
  `host:port/` (e.g. `localhost:5000/app`) tells Docker *where* to push/pull; `localhost` is treated
  as insecure-OK, so no TLS is needed for a local lab.

## Procedure

1. **Run it:** `docker run -d -p 5000:5000 --name registry registry:2` (Distribution docs, *Deploy a
   registry server*); add `-v registry-data:/var/lib/registry` so images survive a restart.
2. **Tag for the registry:** `docker tag <img> localhost:5000/<img>` — the `localhost:5000/` prefix is
   what routes the push.
3. **Push & pull:** `docker push localhost:5000/<img>`, then remove the local copy and
   `docker pull localhost:5000/<img>` to prove it round-trips.
4. **Inspect via API:** `curl http://localhost:5000/v2/_catalog` and `…/v2/<img>/tags/list` to see
   exactly what the registry holds.
5. **Add auth (optional):** put it behind **TLS + htpasswd** before sharing beyond localhost — plain
   HTTP is lab-only.

## Output shape

```
Tool: Docker Registry (registry:2, OSS Distribution) | Port: 5000
Persist: -v registry-data:/var/lib/registry
Tag: docker tag app localhost:5000/app
Push/Pull: docker push|pull localhost:5000/app
API: GET /v2/_catalog , /v2/<name>/tags/list
Prod: add TLS + htpasswd (localhost is insecure-OK) | distribution.github.io (2025)
```

## Tips

- Remote clients need TLS or an explicit `insecure-registries` entry in `daemon.json` — `localhost` is exempt.
- Build lean images to push ([dockerfile-coach](../dockerfile-coach/SKILL.md)); prune old tags so `/var/lib/registry` doesn't grow forever.
- End with the **Learning Footer** (`AGENTS.md`) — one image you round-tripped + one tag to push yourself.
