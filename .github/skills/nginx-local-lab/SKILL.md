---
name: nginx-local-lab
description: "Hands-on lab: run NGINX locally to learn reverse proxying, static file serving, and location blocks — free, open-source, no subscription. Serve a site with root/index, match request paths with location blocks, and proxy_pass to an upstream app on localhost. Use for 'NGINX lab', 'reverse proxy locally', 'serve static files', 'location block matching', 'proxy_pass to a backend', or learning NGINX config by doing."
argument-hint: "The site or upstream to front"
---

# NGINX Local Lab

Learn NGINX by *running it yourself* — serve static files, match request paths with `location`
blocks, and reverse-proxy to an app — all local and free, per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [load-balancing-coach](../load-balancing-coach/SKILL.md), [caching-strategy-coach](../caching-strategy-coach/SKILL.md), and [tls-ssl-explainer](../tls-ssl-explainer/SKILL.md).

## When to use

- The learner wants a runnable reverse proxy / static web server without any cloud or subscription.
- Grounding `location`, `root`, and `proxy_pass` before load balancing, caching, or TLS termination.

## Procedure

1. **Concept:** an `http` block holds `server` blocks (virtual hosts by `listen`/`server_name`); each
   `server` holds `location` blocks that match the request URI (NGINX Beginner's Guide, nginx.org, 2025).
2. **Start it:** run the official OSS image `nginx:1.27-alpine`, mounting your `nginx.conf` plus a
   static `html/` dir; publish `8080`, then confirm with `curl localhost:8080`.
3. **Serve static:** in `location /` set `root /usr/share/nginx/html;` and `index index.html;` so URLs
   map to files on disk; run `nginx -t` then `nginx -s reload` after edits.
4. **Reverse proxy:** add `location /api/ { proxy_pass http://app:3000/; }` with `proxy_set_header Host
   $host;` so the upstream sees the original host — `/api/` traffic now flows to your app.
5. **Verify & clean up:** hit both routes, watch `access.log`, then stop the container; config lives in
   your mounted files, so it persists for reuse.

## Output shape

```nginx
# nginx.conf (mount into the official nginx image; port 8080)
server {
    listen 8080;
    location / {                       # static file serving
        root /usr/share/nginx/html;
        index index.html;
    }
    location /api/ {                   # reverse proxy to an upstream app
        proxy_pass http://app:3000/;
        proxy_set_header Host $host;
    }
}
```

## Tips

- `location` match order is exact (`=`) → longest prefix → regex (`~`); a trailing `/` on `proxy_pass` rewrites the matched prefix.
- Always `nginx -t` before `nginx -s reload`; never hot-edit a running prod config blindly.
- End with the **Learning Footer** (`AGENTS.md`) — one `location` rule to add + one header to forward yourself.
