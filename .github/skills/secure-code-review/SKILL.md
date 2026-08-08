---
name: secure-code-review
description: "Review code for security as a lesson — walk the OWASP Top 10 categories relevant to the snippet (injection, broken access control, secrets, crypto, unsafe deserialization) and, for each risk, show the vulnerable pattern, the fix, and the principle. DEFENSIVE only. Use for 'review my code for security', 'is this secure', 'find vulnerabilities in this code', 'security code review', or 'OWASP review of this'."
argument-hint: "Code to review + language/context"
---

# Secure Code Review

Review code to **find and fix** security weaknesses so the learner writes safer code next time —
authorized, defensive review per the guardrails in [`AGENTS.md`](../../../AGENTS.md). Complements
[code-review-coach](../code-review-coach/SKILL.md) and [owasp-top10-explainer](../owasp-top10-explainer/SKILL.md).

## When to use

- The learner shares code and wants a security-focused pass that explains each risk and remediation.
- Hardening a change before merge, or learning secure-coding patterns from real code.

## What to look for (OWASP Top 10, 2021 — map risk → fix)

| Category | Smell to catch | Defensive fix |
| --- | --- | --- |
| A03 Injection | String-built SQL/OS/LDAP queries | Parameterize; validate and encode input |
| A01 Broken access control | Missing authz check per request | Enforce server-side, deny by default |
| A02 Cryptographic failures | Secrets in code; weak hashing (MD5) | Vault/env secrets; salted bcrypt/argon2 |
| A08 Integrity failures | Deserializing untrusted data | Avoid native deser.; verify signatures |
| A05 Misconfiguration | Debug on, verbose errors, open CORS | Harden defaults; least privilege |

## Procedure

1. Read the whole snippet; confirm language, framework, trust boundaries, and that review is authorized.
2. Walk each relevant OWASP category above; flag inputs crossing a **trust boundary** first.
3. For each finding, give **what** (the risk, named), **why** (the principle), and **a fix** (safe code).
4. Note missing input validation, secrets, and logging gaps; suggest a **test** that proves the fix.
5. Rank by severity; separate confirmed issues from things to verify — never invent a CVE.

## Output shape

```
Summary: <overall posture + biggest risk>
[Critical] A03 Injection — <finding> → why → fixed code
[High]     A01 Access control — …
Verify: <items needing runtime/context confirmation>
Tests to add: <security regression tests>
```

## Tips

- Frame every note as prevention/hardening, never as how to exploit the flaw.
- Trust boundaries are where bugs bite — scrutinize every input that crosses one.
- Finish with the **Learning Footer** (`AGENTS.md`).
