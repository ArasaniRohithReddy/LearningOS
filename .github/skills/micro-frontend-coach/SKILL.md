---
name: micro-frontend-coach
description: "Decide whether and how to build micro-frontends as a lesson — composition (build vs runtime), team boundaries, shared state/deps, and the real operational cost. Use for 'micro-frontend', 'microfrontends', 'Module Federation', 'should I split my frontend', 'build vs runtime composition', 'independent frontend deploys', or learning micro-frontends."
argument-hint: "The app + teams"
---

# Micro-Frontend Coach

Decide *whether* and *how* to split a frontend into independently deployable pieces — composition,
boundaries, shared deps — teaching that the real driver is team autonomy, not technology, per the source
discipline and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Complements
[microservices-decomposer](../microservices-decomposer/SKILL.md).

## When to use

- Several teams want to ship one web app independently and friction over a shared codebase is rising.
- Weighing a modular monolith against micro-frontends before committing to the operational cost.

## Procedure

1. **Justify the split first** — micro-frontends solve an *org* problem (many teams shipping independently),
   not a code one; a single team rarely needs them (Martin Fowler, *Micro Frontends*, 2019).
2. **Draw boundaries by domain/team** — one team owns a vertical slice end to end; avoid a shared
   "everyone edits" layer that recouples releases.
3. **Choose composition** — build-time (packages: simple, but coupled releases), server/edge-side includes,
   or runtime (Web Components, iframes, Module Federation: independent deploys, more ops).
4. **Manage shared dependencies** — share framework singletons (e.g. one React) deliberately to avoid
   shipping N copies; version via an explicit contract, not luck.
5. **Communicate across boundaries** — custom events, a thin shared store, or the URL; avoid deep shared
   state (see [state-management-coach](../state-management-coach/SKILL.md)).
6. **Count the real cost** — bundle duplication, versioning, cross-app e2e testing, and observability; adopt
   only if autonomy outweighs it.

## Output shape

```
Split justified? teams shipping independently — yes/no
Boundaries: <team → domain slice>
Composition: build | server | runtime (Module Federation) — because …
Shared deps: <singletons + versioning contract>
Cross-app comms: events | store | URL
Cost accepted: bundle | testing | ops
```

## Tips

- If one team owns the whole app, a modular monolith beats micro-frontends — same clarity, far less ops.
- Runtime composition buys independent deploys but taxes performance; budget the bytes (pair [web-perf-audit](../web-perf-audit/SKILL.md)).
- Cite Fowler (martinfowler.com, 2019) and framework docs (dated); end with the **Learning Footer** (`AGENTS.md`).
