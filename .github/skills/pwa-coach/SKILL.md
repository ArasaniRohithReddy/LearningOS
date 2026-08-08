---
name: pwa-coach
description: "Build a progressive web app as a lesson — service workers, caching strategies, offline support, installability (manifest), and the pitfalls. Use for 'PWA', 'progressive web app', 'service worker', 'offline support', 'installable / add to home screen', 'web app manifest', 'caching strategy', or learning PWAs."
argument-hint: "The app + offline needs"
---

# PWA Coach

Turn a web app into an installable, offline-capable PWA — service worker, manifest, caching strategy —
teaching what each layer buys and where it bites, per the source discipline and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [web-perf-audit](../web-perf-audit/SKILL.md).

## When to use

- The learner wants offline support, installability, or faster repeat visits for a web app.
- Debugging a service worker: stale caches, failed installs, or a broken update flow.

## Procedure

1. **Confirm the need** — PWAs earn their cost when offline, installability, or repeat-visit speed matter;
   require HTTPS and ensure core content works *without* the service worker (web.dev *PWA*, 2023).
2. **Add a web app manifest** — `name`, icons (including maskable), `start_url`, `display: standalone`, and
   theme colour drive installability and the home-screen entry (MDN *Web app manifest*, 2024).
3. **Register a service worker** — a proxy that intercepts `fetch`; scope it and design the
   install/activate lifecycle deliberately (MDN *Service Worker API*, 2024).
4. **Choose caching per request type** — cache-first for hashed static assets, network-first for fresh
   data, stale-while-revalidate for the middle ground (web.dev / Workbox, 2023).
5. **Handle updates & offline UX** — a new worker waits until pages close; prompt to reload, and version and
   clean caches so users aren't stuck on stale code.
6. **Test the failure modes** — offline, flaky network, and the update flow via DevTools *Application* and
   the Lighthouse PWA audit.

## Output shape

```
PWA justified? offline | install | repeat-speed — yes/no
Manifest: name, icons (maskable), display, start_url
Service worker: scope + lifecycle
Caching: static → cache-first | data → network-first | swr
Updates: reload prompt + cache versioning
Tested: offline ✓ | update flow ✓ | Lighthouse ✓
```

## Tips

- The #1 PWA bug is a stale cache serving old code — always version caches and plan the update flow.
- Progressive means it works without the worker; never make core content service-worker-dependent.
- Prefer Workbox over hand-rolled logic; cite web.dev/MDN (dated); pair [caching-strategy-coach](../caching-strategy-coach/SKILL.md); end with the **Learning Footer** (`AGENTS.md`).
