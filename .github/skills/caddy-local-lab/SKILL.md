---
name: caddy-local-lab
description: "Hands-on lab: run Caddy locally to learn automatic HTTPS with its built-in local CA, reverse proxying, and the Caddyfile — free, open-source, no subscription. Serve a site, get trusted certs for localhost via `tls internal`, and reverse_proxy to an app. Use for 'Caddy lab', 'automatic HTTPS locally', 'local CA certificates', 'Caddyfile walkthrough', 'reverse_proxy directive', or learning Caddy by doing."
argument-hint: "The site or upstream to serve"
---

# Caddy Local Lab

Learn Caddy by *running it yourself* — a tiny Caddyfile, automatic HTTPS from a local CA, and a
one-line reverse proxy — all local and free, per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [tls-ssl-explainer](../tls-ssl-explainer/SKILL.md) and [load-balancing-coach](../load-balancing-coach/SKILL.md).

## When to use

- The learner wants HTTPS on localhost without buying certs or hand-driving OpenSSL.
- Comparing a batteries-included server to the manual config in [nginx-local-lab](../nginx-local-lab/SKILL.md).

## Procedure

1. **Concept:** Caddy configures sites from a simple **Caddyfile**; for internal/localhost names it
   issues certs from its own **local CA** via `tls internal` (Caddy docs, caddyserver.com, 2025).
2. **Start it:** run the official OSS image `caddy:2`, mount a `Caddyfile`, and publish `80`/`443`; a
   `localhost` site auto-serves HTTPS on first request.
3. **Reverse proxy:** a site block `localhost { reverse_proxy app:3000 }` fronts your app — Caddy also
   load-balances and health-checks multiple upstreams for free.
4. **Trust the CA:** run `caddy trust` (or install the root from the `/data` volume) so the browser
   accepts the cert without warnings; `curl` can use `--cacert` instead.
5. **Verify & clean up:** `curl https://localhost` shows a valid chain; stop the container — the issued
   certs and CA key live under the mounted `/data` volume.

## Output shape

```caddyfile
# Caddyfile (mount into the official caddy:2 image; ports 80 + 443)
localhost {
    tls internal               # certs from Caddy's local CA (run `caddy trust`)
    reverse_proxy app:3000     # proxy upstream; auto load-balance + health checks
}
site.localhost {
    root * /srv                # static file server
    file_server
}
```

## Tips

- Caddy (Apache-2.0) enables HTTPS by default — for real public domains it uses Let's Encrypt/ZeroSSL, not the local CA.
- Persist the `/data` volume so the local CA and certs survive restarts; `caddy trust` needs local admin rights.
- End with the **Learning Footer** (`AGENTS.md`) — one extra site block to add + one directive (encode, header) to try yourself.
