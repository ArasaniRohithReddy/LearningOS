---
name: csp-headers-coach
description: "Configure HTTP security headers safely as a lesson — Content-Security-Policy, HSTS, X-Content-Type-Options, frame-ancestors/X-Frame-Options, Referrer-Policy — to reduce XSS and clickjacking, with a report-only rollout. DEFENSIVE only. Use for 'add security headers', 'set up CSP', 'HSTS', 'stop clickjacking', 'reduce XSS with headers', or 'security header review'."
argument-hint: "The site/app"
---

# CSP & Security Headers Coach

Configure **HTTP security headers** — CSP, HSTS, and friends — to cut XSS and clickjacking, rolled out
safely, teaching each defense per [`AGENTS.md`](../../../AGENTS.md). Pairs with
[owasp-top10-explainer](../owasp-top10-explainer/SKILL.md) and [secure-code-review](../secure-code-review/SKILL.md).

## When to use

- The learner wants to add or review response headers that harden a site against browser-side attacks.
- Tightening an existing CSP, or rolling one out without breaking the app.

## Header → what it defends

| Header | Defends against | Safe setting |
| --- | --- | --- |
| Content-Security-Policy | XSS, injection | Allow-list sources; nonces; no `unsafe-inline` |
| Strict-Transport-Security | Protocol downgrade | `max-age` ≥ 1 yr; `includeSubDomains` |
| X-Content-Type-Options | MIME sniffing | `nosniff` |
| CSP `frame-ancestors` (or X-Frame-Options) | Clickjacking | `'none'` or `'self'` per need |
| Referrer-Policy | Referrer leakage | `strict-origin-when-cross-origin` |

## Procedure

1. Confirm the site is the learner's; inventory current headers, inline scripts/styles, and third-party origins.
2. Draft a least-privilege CSP: allow-list needed sources, use nonces/hashes, avoid `unsafe-inline` and `*`.
3. Deploy CSP in **Content-Security-Policy-Report-Only** first; collect violation reports, then tune.
4. Add HSTS, `nosniff`, `frame-ancestors`, and Referrer-Policy; verify HTTPS everywhere before HSTS preload.
5. Promote CSP from report-only to enforcing once reports are clean; keep a reporting endpoint.
6. Re-test after changes; map to the OWASP Secure Headers Project and W3C CSP Level 3.

## Output shape

```
Site: <context> | Current headers: …
CSP: <directives> — nonces, no unsafe-inline
Rollout: Report-Only → tune → enforce
Other headers: HSTS, nosniff, frame-ancestors, Referrer-Policy
Verify: violation reports clean | Ref: OWASP Secure Headers / CSP L3
```

## Tips

- Ship CSP in report-only first — enforcing a wrong policy breaks the app and teaches nothing.
- Prefer nonces/hashes over `unsafe-inline`; `*` and `unsafe-*` defeat the point of CSP.
- Test HTTPS fully before enabling HSTS; end with the **Learning Footer** (`AGENTS.md`).
