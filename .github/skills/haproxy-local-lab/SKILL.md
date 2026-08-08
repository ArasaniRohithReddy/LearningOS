---
name: haproxy-local-lab
description: "Hands-on lab: run HAProxy locally to learn L4 (TCP) and L7 (HTTP) load balancing, backends, and health checks — free, open-source, no subscription. Define frontend/backend sections, pick a balance algorithm, and drain unhealthy servers with active checks. Use for 'HAProxy lab', 'L4 vs L7 load balancing locally', 'frontend backend config', 'balance roundrobin', 'health checks', or learning HAProxy by doing."
argument-hint: "The backends to balance"
---

# HAProxy Local Lab

Learn HAProxy by *running it yourself* — front a pool of backends, switch between L4 and L7, and let
health checks eject bad servers — all local and free, per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [load-balancing-coach](../load-balancing-coach/SKILL.md) and [tls-ssl-explainer](../tls-ssl-explainer/SKILL.md).

## When to use

- The learner wants a real load balancer to see round-robin, health checks, and draining in action.
- Turning the theory in [load-balancing-coach](../load-balancing-coach/SKILL.md) into runnable config.

## Procedure

1. **Concept:** a config has `global`/`defaults`, a `frontend` (what to accept) and `backend`s (where to
   send); `mode tcp` is L4, `mode http` is L7 (HAProxy Configuration Manual, docs.haproxy.org, 2025).
2. **Start it:** run the official OSS image `haproxy:3.1-alpine`, mount `haproxy.cfg`, and publish `80`
   plus `8404` for the stats page.
3. **Balance L7:** set `mode http`, `balance roundrobin`, and two `server` lines pointing at app
   replicas; requests now spread across both.
4. **Health checks:** add `option httpchk GET /health` with `check` on each server so a failing replica
   is drained until it recovers — verify by stopping one app.
5. **Verify & clean up:** loop `curl localhost` to watch responses alternate, open `/stats` on `8404`,
   then stop the container; config persists in your mounted file.

## Output shape

```haproxy
# haproxy.cfg (mount into the official haproxy image; ports 80 + 8404)
defaults
    mode http
    timeout connect 5s
    timeout client  30s
    timeout server  30s
frontend web
    bind :80
    default_backend apps
backend apps
    balance roundrobin
    option httpchk GET /health         # active L7 health check
    server a app-a:3000 check
    server b app-b:3000 check
```

## Tips

- Use `mode tcp` for raw L4 (databases, gRPC passthrough) and `mode http` for path/header routing and retries.
- Enable the stats page (`stats enable`) in the lab to *see* health, sessions, and queue depth per server.
- End with the **Learning Footer** (`AGENTS.md`) — one algorithm (leastconn, uri hash) to try + one server to fail on purpose yourself.
