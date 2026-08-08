---
name: auth-designer
description: "Design authentication and authorization as a lesson — choose between sessions, JWT, OAuth 2.0/OIDC; model roles and permissions with RBAC or ABAC; and avoid common pitfalls. Use for 'design auth for my app', 'sessions vs JWT', 'OAuth2 / OIDC', 'RBAC vs ABAC', or 'how should I do login and permissions'. Defensive; use vetted libraries, never home-grown crypto."
argument-hint: "The app + auth requirements"
---

# Auth Designer

Design **authentication (who you are) and authorization (what you may do)** that's secure by default,
teaching the trade-offs per [`AGENTS.md`](../../../AGENTS.md). Pairs with
[threat-model](../threat-model/SKILL.md) and [security-hardening-checklist](../security-hardening-checklist/SKILL.md).

## When to use

- The learner is choosing an auth approach or permission model for an app they own.
- Reviewing an existing design for gaps, or learning OAuth2/OIDC and RBAC/ABAC concepts.

## Choosing a model (need → fit)

| Need | Approach | Note |
| --- | --- | --- |
| Server-rendered app, one domain | Server **sessions** (HttpOnly cookie) | Simplest; easy revocation |
| SPA/mobile + APIs | **OIDC** for login, short-lived tokens | Don't hand-roll token issuance |
| Delegated / third-party access | **OAuth 2.0/2.1** (auth code + PKCE) | Never the implicit flow |
| Stateless service-to-service | Signed **JWT** access tokens | Short TTL; validate `aud`/`iss`/`exp` |
| Coarse roles vs fine rules | **RBAC** vs **ABAC** | Enforce server-side, deny by default |

## Procedure

1. Clarify actors, clients, sensitivity, and compliance needs; confirm the app is the learner's.
2. Pick an **authn** approach from the table; justify the trade-off (revocation, XSS/CSRF, scale).
3. Design **authz**: choose RBAC or ABAC, model roles/permissions, enforce checks server-side.
4. Handle sessions/tokens safely: HttpOnly+Secure cookies or short-lived tokens + refresh, rotation.
5. Cover MFA, password storage (salted bcrypt/argon2), rate-limiting, and logout/revocation.
6. Map each control to OWASP ASVS / NIST SP 800-63B; note verification and residual risk.

## Output shape

```
App: <context> | Actors/clients: … | Sensitivity: …
AuthN: <sessions/OIDC/OAuth2/JWT> — why: <trade-off>
AuthZ: <RBAC/ABAC> — roles/permissions model
Token/session handling: storage, TTL, rotation, revocation
Pitfalls avoided: … | Standard: OWASP ASVS / NIST 800-63B
```

## Tips

- Use vetted libraries/providers; never invent crypto or your own token format.
- Authenticate, then authorize on **every** request server-side — deny by default.
- Validate JWTs fully (`iss`/`aud`/`exp`, signature); end with the **Learning Footer** (`AGENTS.md`).
