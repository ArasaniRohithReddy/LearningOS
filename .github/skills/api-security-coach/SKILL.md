---
name: api-security-coach
description: "Harden a web API defensively as a lesson — authentication and per-object authorization, input validation, rate limiting, output encoding, and the OWASP API Security Top 10 (2023). DEFENSIVE only. Use for 'secure my API', 'API security review', 'BOLA / broken object level authorization', 'rate limit my API', 'validate API input', or 'OWASP API Top 10'."
argument-hint: "The API + auth model"
---

# API Security Coach

Harden a **web/HTTP API** — authenticate, authorize per object, validate, and throttle — teaching each
control per [`AGENTS.md`](../../../AGENTS.md). Pairs with
[auth-designer](../auth-designer/SKILL.md) and [threat-model](../threat-model/SKILL.md).

## When to use

- The learner owns an API and wants to confirm authN/authZ, validation, and throttling are in place.
- Reviewing endpoints against the OWASP API Security Top 10, or hardening before exposure.

## OWASP API risk → defense (2023)

| API risk | Defense |
| --- | --- |
| API1 Broken object-level authz (BOLA) | Check ownership per object, server-side |
| API2 Broken authentication | Vetted authN; validate tokens; MFA |
| API3 Broken property-level authz | Allow-list fields in/out; no mass-assignment |
| API4 Unrestricted resource use | Rate-limit, quota, pagination, size caps |
| API8 Misconfiguration | Harden defaults; TLS; least privilege |

## Procedure

1. Map endpoints, data objects, and the auth model; confirm the API is the learner's.
2. Enforce authentication on every route, then **per-object** authorization (owner/tenant checks) server-side.
3. Validate and allow-list input and output fields via schema; block mass-assignment and over-fetching.
4. Add rate limiting, quotas, pagination, and payload-size limits to bound resource use.
5. Encode/serialize output safely; return minimal errors; require TLS and secure defaults.
6. Add a regression test proving one user can't access another's objects; map to OWASP API Top 10 (2023).

## Output shape

```
API: <context> | Auth model: …
AuthZ: per-object ownership checks — every route
Input/output: schema validation, field allow-list, no mass-assignment
Limits: rate limit, quota, pagination, size caps
Verify: cross-user BOLA regression test | Ref: OWASP API Top 10 (2023)
```

## Tips

- BOLA is the top API risk — authorize the object, not just the user, on every request.
- Allow-list fields in and out; never trust client-supplied IDs or bulk-bind request bodies.
- Throttle to bound abuse; end with the **Learning Footer** (`AGENTS.md`).
