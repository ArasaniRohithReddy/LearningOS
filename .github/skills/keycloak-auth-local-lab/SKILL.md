---
name: keycloak-auth-local-lab
description: "Hands-on lab: run Keycloak locally with Docker — create a realm, an OIDC client, and users, then practice an OAuth2/OIDC login flow. Local, free, open-source, no subscription. Use for 'Keycloak lab', 'the auth', 'local OIDC provider', 'OAuth2 practice', 'realm and client setup', or learning identity and access by doing."
argument-hint: "The auth"
---

# Keycloak Auth Local Lab

Learn OAuth2/OIDC by *running your own identity provider* — realm, client, users, and a real login,
all local and free with no subscription — per [`AGENTS.md`](../../../AGENTS.md). Pairs with
[auth-designer](../auth-designer/SKILL.md).

## When to use

- The learner wants a real OIDC provider to test logins and tokens without any hosted or paid IdP.
- Reinforcing OAuth2/OIDC fundamentals for a backend, security, or platform role-agent.

## Procedure

1. **Concept:** Keycloak is an OSS identity provider; a **realm** is an isolated tenant, a **client**
   is an app that requests tokens, and OIDC issues ID/access tokens over OAuth2 (Keycloak *Getting
   Started*, keycloak.org, 2024).
2. **Docker Compose:** run `quay.io/keycloak/keycloak` with `command: start-dev` and bootstrap-admin
   env vars on `:8080`; `docker compose up -d` and wait for the *Running* log line.
3. **Configure:** in the admin console (`/admin`) create a **realm**, add an OIDC **client** (set a
   valid redirect URI), then create a **user** with a password under that realm.
4. **Verify:** open the realm's discovery doc
   `/realms/<realm>/.well-known/openid-configuration`, then sign in at the client or account console
   to complete an OIDC login and inspect the issued tokens.
5. **Clean up:** `docker compose down` — `start-dev` uses an ephemeral H2 DB, so the realm resets.

## Output shape

```yaml
services:
  keycloak:
    image: quay.io/keycloak/keycloak:26.1.0   # official OSS image
    command: start-dev
    environment:
      - KC_BOOTSTRAP_ADMIN_USERNAME=admin      # admin console user (Keycloak 26+)
      - KC_BOOTSTRAP_ADMIN_PASSWORD=admin      # change for anything beyond a lab
    ports: ["8080:8080"]
```

## Tips

- `start-dev` is for learning only — no HTTPS and an in-memory DB; never expose it beyond localhost.
- Older images (<26) use `KEYCLOAK_ADMIN`/`KEYCLOAK_ADMIN_PASSWORD` — match env vars to the image tag.
- End with the **Learning Footer** (`AGENTS.md`) — one OIDC term to define + one flow to trace end-to-end.
