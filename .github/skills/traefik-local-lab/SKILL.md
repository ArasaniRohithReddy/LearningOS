---
name: traefik-local-lab
description: "Hands-on lab: run Traefik locally to learn dynamic routing with the Docker provider and middlewares — free, open-source, no subscription. Traefik auto-discovers containers by their labels and builds routers, services, and middleware chains with no restart. Use for 'Traefik lab', 'dynamic routing locally', 'Docker provider labels', 'Traefik middlewares', 'auto-discover containers', or learning Traefik by doing."
argument-hint: "The containers to route"
---

# Traefik Local Lab

Learn Traefik by *running it yourself* — let it watch Docker and build routes from container labels,
then chain a middleware — all local and free, per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [load-balancing-coach](../load-balancing-coach/SKILL.md), [docker-compose-lab](../docker-compose-lab/SKILL.md), and [tls-ssl-explainer](../tls-ssl-explainer/SKILL.md).

## When to use

- The learner wants routing that updates automatically as containers start and stop.
- Contrasting label-driven, dynamic config with the static files of nginx/HAProxy/Envoy.

## Procedure

1. **Concept:** Traefik has **entryPoints** (ports in), **routers** (rules → service), **services**
   (upstreams), and **middlewares** (transforms), fed by **providers** (Traefik docs, doc.traefik.io, 2025).
2. **Start it:** run `traefik:v3.3` with `--providers.docker`, mount the Docker socket read-only, and
   expose `:80` plus the dashboard on `:8080` for learning only.
3. **Route by label:** give your app container a router-rule label — a `Host(...)` match (see Output
   shape) — and Traefik discovers it and wires the router to the service with no restart.
4. **Add middleware:** attach a `stripprefix` middleware and reference it from the router to rewrite the
   path (drop `/api`) before the upstream sees the request.
5. **Verify & clean up:** `curl -H "Host: app.localhost" localhost` reaches the app; watch the
   dashboard, then `docker compose down` — routes vanish with their containers.

## Output shape

```yaml
# compose.yaml — Traefik watches Docker and routes by labels
services:
  traefik:
    image: traefik:v3.3                        # official OSS image (pin your v3.x)
    command: ["--providers.docker", "--entryPoints.web.address=:80"]
    ports: ["80:80", "8080:8080"]              # dashboard :8080 (dev only)
    volumes: ["/var/run/docker.sock:/var/run/docker.sock:ro"]
  app:
    image: your-app
    labels:
      - "traefik.http.routers.app.rule=Host(`app.localhost`)"
      - "traefik.http.routers.app.middlewares=strip"
      - "traefik.http.middlewares.strip.stripprefix.prefixes=/api"
```

## Tips

- Mount the Docker socket read-only and keep the dashboard off any public interface — it exposes your routing.
- Labels are per-container config; for TLS use an ACME resolver in prod, or a local cert in the lab.
- End with the **Learning Footer** (`AGENTS.md`) — one middleware (rate-limit, basic-auth) to add + one router rule to write yourself.
