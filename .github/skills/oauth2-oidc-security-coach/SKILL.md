---
name: oauth2-oidc-security-coach
description: "DEFENSIVE coach for safe OAuth 2.0 and OpenID Connect design — pick the right flow (authorization code + PKCE, since implicit and password grants are retired), validate redirect URIs strictly, use state and nonce correctly, minimize scopes, resist consent phishing, rotate refresh tokens with reuse detection, and adopt sender-constrained tokens (DPoP/mTLS) or the BFF pattern. Use for 'OAuth security', 'OIDC flow review', 'PKCE', 'redirect URI validation', 'refresh token rotation', 'DPoP / sender-constrained tokens', 'consent phishing', or 'BFF vs SPA tokens'."
argument-hint: "The client type (SPA, mobile, server, CLI, machine) + identity provider and current flow"
---

# OAuth2 / OIDC Security Coach

**Scope guardrail:** defensive only — this skill designs and reviews OAuth/OIDC deployments you own or are
authorized to assess; it will not produce token-theft tooling, consent-phishing kits, or authorization-server
bypass techniques, and redirects such requests to authorized testing and coordinated disclosure. Follows
[`AGENTS.md`](../../../AGENTS.md); pairs with [jwt-security-coach](../jwt-security-coach/SKILL.md) and
[auth-designer](../auth-designer/SKILL.md).

## When to use

- You are choosing a flow for a SPA, mobile app, CLI, or service-to-service integration and want the current
  best practice rather than a 2015 blog post.
- A review must confirm redirect-URI handling, `state`/`nonce`, scope minimization, and token storage.
- Refresh tokens live in browser storage and you need a safer architecture (rotation, DPoP, or a BFF).
- A third-party app is requesting broad delegated permissions and you must judge the consent risk.

## First principles

OAuth 2.0 is **delegated authorization** (an access token for an API); OIDC adds **authentication** (an ID
token about the user). Conflating them is the classic design error: an access token proves a *grant*, never
*who is signed in* to your app.

Three properties carry most of the security: the **authorization code** is single-use and exchanged over a
back channel; **PKCE** binds that code to the client instance that started the flow; and **exact redirect-URI
matching** stops a code from being delivered anywhere else. Current OAuth 2.0 Security Best Current Practice
and OAuth 2.1 retire the implicit grant and the resource-owner-password grant for exactly this reason.

```mermaid
sequenceDiagram
  participant U as User agent
  participant C as Client (or BFF)
  participant AS as Authorization Server
  participant API as Resource Server
  C->>C: generate code_verifier, derive code_challenge (S256), state, nonce
  C->>AS: /authorize (client_id, redirect_uri, scope, state, nonce, code_challenge)
  AS->>U: authenticate + explicit consent screen
  AS-->>C: redirect with code + state (exact registered redirect_uri only)
  C->>C: verify state matches the session
  C->>AS: /token (code + code_verifier + client auth)
  AS-->>C: access token (short TTL, audience-scoped) + refresh (rotating) + id_token
  C->>C: validate id_token: iss, aud, exp, nonce, signature
  C->>API: call with token (bearer, or DPoP/mTLS bound)
  API->>API: validate iss, aud, exp, scope; enforce object-level authz
```

## Flow selection

| Client type | Use | Never use | Key controls |
| --- | --- | --- | --- |
| SPA (browser) | Auth code + PKCE — or a **BFF** holding tokens server-side | Implicit; refresh tokens in `localStorage` | BFF + `HttpOnly` `Secure` `SameSite` cookie; strict CSP |
| Mobile / desktop | Auth code + PKCE in the system browser | Embedded web view; static client secret | App-claimed redirect (app links / custom scheme with PKCE) |
| Server-side web app | Auth code + PKCE, confidential client | Password grant | Client auth (private_key_jwt/mTLS); server-side session |
| CLI / device without browser | Device authorization grant | Password grant; pasting long-lived tokens | User code display, short expiry, clear consent |
| Service to service | Client credentials | User-impersonating flows | mTLS or private_key_jwt; audience-restricted tokens |
| Machine in cloud | Workload identity federation | Long-lived client secrets | See [cloud-iam-least-privilege-coach](../cloud-iam-least-privilege-coach/SKILL.md) |

**Bearer vs sender-constrained:** a bearer token is a bearer bond — whoever holds it, spends it. DPoP or mTLS
binds the token to a key the client proves possession of, so a stolen token is far less useful. Prefer
sender-constrained tokens for high-value APIs; use a BFF when the client is a browser.

## Procedure

1. **Classify the client** (public vs confidential) and the resource, then pick the flow from the table.
   State the runner-up and why it loses — that contrast is what transfers.
2. **Lock down redirect URIs**: register exact absolute URIs, match by string comparison (no wildcards, no
   substring/prefix matching, no open path segments), and never reflect an attacker-supplied `redirect_uri`
   into an error page.
3. **Use PKCE everywhere** (`S256`, never `plain`), including confidential clients — it costs nothing and
   stops code interception and injection.
4. **Use `state` for CSRF and `nonce` for replay**: generate both with a CSRF-safe RNG, bind them to the
   user's session, and reject mismatches. `state` is not a place to store return data unsigned.
5. **Minimize scope and audience.** Request the least scope needed, request it *incrementally* when the user
   reaches the feature, and issue tokens with an explicit `aud` so a token for service A cannot be replayed at
   service B.
6. **Validate tokens properly at the resource server** — issuer, audience, expiry, signature via the JWKS with
   key rotation, and algorithm allow-list. Details in [jwt-security-coach](../jwt-security-coach/SKILL.md).
   Never trust an ID token as an API credential, and never trust an access token as proof of identity.
7. **Design token lifetimes and revocation**: short access-token TTL, rotating refresh tokens with **reuse
   detection** (a replayed refresh token revokes the whole family), plus a revocation endpoint and
   near-real-time propagation.
8. **Store tokens safely.** Browser: BFF with `HttpOnly` cookies, or in-memory only. Mobile: platform keystore.
   Server: a secret manager — see [secrets-management-coach](../secrets-management-coach/SKILL.md).
9. **Harden consent against phishing**: verified publisher requirements, admin-consent workflow for broad or
   privileged scopes, deny-by-default for unverified apps, an inventory of granted third-party consents, and
   alerting on new high-privilege grants.
10. **Enforce authorization after authentication.** A valid token says *may call*, not *may touch this
    object* — object-level checks belong to
    [broken-access-control-coach](../broken-access-control-coach/SKILL.md).
11. **Verify with tests**: tampered `state`, replayed code, wrong `aud`, expired token, mismatched
    `redirect_uri`, reused refresh token, and downgraded algorithm all must fail closed.

## Output shape

```
OAuth/OIDC review — <client + API>                    (authorized: yes)

Client type: <SPA | mobile | server | CLI | service>   confidential: <yes/no>
Flow: authorization code + PKCE (S256)
  Runner-up: <BFF | device grant> — rejected because <...>
Retired/forbidden here: implicit, resource-owner password

Redirect URIs: <exact list>   matching: exact string, no wildcards
CSRF/replay: state = session-bound random | nonce validated in id_token
Scopes: <minimal list>  incremental: yes   audience: <api://...>

Tokens:
  access  TTL <10m>, aud-restricted, <bearer | DPoP | mTLS-bound>
  refresh rotating + reuse detection -> revoke family
  id_token validated: iss, aud, exp, nonce, alg allow-list, JWKS rotation
  storage: <BFF HttpOnly cookie | keystore | secret manager>

Consent hardening: verified publisher | admin consent for <scopes> | grant inventory + alerts
Post-auth authorization: <object-level checks at resource server>

Negative tests (must fail closed):
  tampered state | replayed code | wrong aud | expired token | mismatched redirect_uri
  reused refresh token | alg downgrade
Findings: 1) <...> fix <...>   2) <...> fix <...>
Next: <jwt-security-coach | auth-designer | broken-access-control-coach>
```

## Tips

- **The redirect URI is the whole attack surface of the front channel** — one wildcard undoes PKCE, state,
  and everything else.
- ID token ≠ access token. Sending an ID token to an API, or logging a user in from an access token, is the
  most common OIDC design bug in review.
- Refresh-token rotation without **reuse detection** is bookkeeping; the detection is what turns theft into a
  revocation event.
- For browsers, prefer a BFF: no token ever reaches JavaScript, so XSS stops being an instant account
  takeover. If you cannot, keep tokens in memory and invest heavily in CSP.
- Consent phishing bypasses passwords and MFA entirely — the user is *granting* access. Govern consent like
  you govern admin roles.
- Scope creep is permanent: every scope you request today is one you must justify to a security review and a
  customer later.
- Related: [jwt-security-coach](../jwt-security-coach/SKILL.md),
  [auth-designer](../auth-designer/SKILL.md),
  [phishing-resistant-auth-coach](../phishing-resistant-auth-coach/SKILL.md),
  [api-security-coach](../api-security-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
