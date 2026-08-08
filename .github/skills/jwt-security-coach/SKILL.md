---
name: jwt-security-coach
description: "Use JSON Web Tokens securely as a lesson — pin the signing algorithm (never `alg:none`), validate signature and `iss`/`aud`/`exp`, handle expiry, rotation, and safe storage, and know when server sessions beat JWTs. DEFENSIVE only. Use for 'is my JWT secure', 'JWT best practices', 'validate a JWT', 'alg none', 'where to store tokens', or 'JWT vs sessions'."
argument-hint: "The app's token use"
---

# JWT Security Coach

Use **JSON Web Tokens** safely — sign, validate, expire, and store them right, or pick sessions instead —
teaching the trade-offs per [`AGENTS.md`](../../../AGENTS.md). Pairs with
[auth-designer](../auth-designer/SKILL.md) and [secure-code-review](../secure-code-review/SKILL.md).

## When to use

- The learner issues or validates JWTs and wants to confirm they're secure by default.
- Choosing between stateless JWTs and server sessions, or debugging token validation.

## Controls (risk → defense)

| Concern | Risk | Defensive control |
| --- | --- | --- |
| Algorithm | `alg:none` / key confusion | Pin one alg server-side (EdDSA/RS256); reject others |
| Claims | Forged audience/issuer | Validate `iss`, `aud`, `exp`, `nbf` every request |
| Lifetime | Long-lived, no revocation | Short TTL + refresh rotation; deny-list on logout |
| Storage | XSS token theft | HttpOnly+Secure cookie; avoid `localStorage` |
| Secrets | Weak/shared signing key | Strong key in a vault; rotate via `kid` |

## Procedure

1. Confirm what the token authorizes and that the app is the learner's; note issuer and audiences.
2. Pin the signing algorithm server-side; never trust the header `alg` — reject `none` and mismatches.
3. Validate signature and all claims (`iss`, `aud`, `exp`, `nbf`) on every request; fail closed.
4. Set short expiry; add refresh-token rotation and a revocation/deny-list for logout and compromise.
5. Store tokens in HttpOnly+Secure cookies (not `localStorage`); keep the key in a vault, rotate via `kid`.
6. If you need instant revocation or server state, prefer sessions; map controls to RFC 8725 (2020).

## Output shape

```
Token use: <what it authorizes> | Issuer/aud: …
Signing: <alg pinned> — reject none/mismatch
Validation: iss/aud/exp/nbf — every request, fail closed
Lifetime & storage: TTL, rotation, revocation, cookie flags
Verdict: JWT vs sessions — why | Standard: RFC 8725 / RFC 7519
```

## Tips

- Never accept the client's `alg`; a fixed server-side algorithm defeats `alg:none` and key confusion.
- A JWT you can't revoke is a liability — keep TTLs short and rotate refresh tokens.
- Validate fully and end with the **Learning Footer** (`AGENTS.md`).
