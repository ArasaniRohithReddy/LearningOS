---
name: envoy-local-lab
description: "Hands-on lab: run Envoy locally to learn its core objects — listeners, clusters, and routes — free, open-source, no subscription. Write a static bootstrap where a listener's HTTP connection manager routes virtual hosts to upstream clusters. Use for 'Envoy lab', 'listeners clusters routes locally', 'Envoy static config', 'HTTP connection manager', 'route to a cluster', or learning Envoy by doing."
argument-hint: "The upstream to front with Envoy"
---

# Envoy Local Lab

Learn Envoy by *running it yourself* — a static bootstrap with one listener, a route table, and an
upstream cluster — all local and free, per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [load-balancing-coach](../load-balancing-coach/SKILL.md) and [tls-ssl-explainer](../tls-ssl-explainer/SKILL.md).

## When to use

- The learner wants to see how a modern L7 proxy maps listeners → routes → clusters explicitly.
- Grounding sidecar / service-mesh data-plane config before a mesh or gRPC deep dive.

## Procedure

1. **Concept:** a **listener** accepts connections and runs filters; the HTTP connection manager holds a
   **route** table whose virtual hosts point at named **clusters** (upstreams) (Envoy docs, envoyproxy.io, 2025).
2. **Start it:** run the official OSS image `envoyproxy/envoy:v1.33-latest`, mount `envoy.yaml`, and
   publish `10000` (proxy) plus `9901` (admin).
3. **Wire a route:** in the connection manager add a `virtual_hosts` entry matching prefix `/` and
   routing to `cluster: app`; define that cluster's endpoints under `clusters:`.
4. **Inspect it:** browse the admin page on `:9901` — `/config_dump`, `/clusters`, and `/stats` show the
   live config and upstream health.
5. **Verify & clean up:** `curl localhost:10000` reaches the app via Envoy; stop the container — the
   static config lives in your mounted file.

## Output shape

```yaml
# envoy.yaml (static bootstrap; proxy :10000, admin :9901)
static_resources:
  listeners:
  - address: { socket_address: { address: 0.0.0.0, port_value: 10000 } }
    filter_chains:
    - filters:
      - name: envoy.filters.network.http_connection_manager
        # typed_config.route_config.virtual_hosts:
        #   - domains: ["*"], routes: [{ match: {prefix: "/"}, route: {cluster: app} }]
  clusters:
  - name: app
    type: STRICT_DNS                 # resolve the upstream by name
    load_assignment: { cluster_name: app }   # lb_endpoints → app:3000
```

## Tips

- Envoy (Apache-2.0) is config-heavy on purpose: listeners, routes, and clusters are separate so a control plane can push each independently.
- Learn from the admin interface — `/config_dump` and `/clusters` are the fastest way to see what Envoy actually loaded.
- End with the **Learning Footer** (`AGENTS.md`) — one route match (prefix, header) to add + one cluster to load-balance across yourself.
