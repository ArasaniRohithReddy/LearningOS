---
name: owasp-top10-explainer
description: "Explain the OWASP Top 10 (or a single category) for learning — with a minimal vulnerable-vs-fixed code example and the mitigation, so the learner recognizes and prevents the risk. DEFENSIVE and educational only. Use for 'explain the OWASP Top 10', 'what is injection / broken access control', 'OWASP A03', 'teach me web app security risks', or 'how do I prevent X'."
argument-hint: "A category or 'all' + stack"
---

# OWASP Top 10 Explainer

Teach the most common web risks so the learner can **recognize and prevent** them — educational and
defensive per [`AGENTS.md`](../../../AGENTS.md). Pairs with
[secure-code-review](../secure-code-review/SKILL.md) and [threat-model](../threat-model/SKILL.md).

## When to use

- The learner wants to understand a risk category and how to defend against it, with examples.
- Onboarding to secure coding, or prepping for a security review or interview.

## The OWASP Top 10 (2021)

| # | Category | One-line defense |
| --- | --- | --- |
| A01 | Broken access control | Enforce authz server-side, deny by default |
| A02 | Cryptographic failures | TLS everywhere; strong salted hashing; no secrets in code |
| A03 | Injection | Parameterize queries; validate and encode input |
| A04 | Insecure design | Threat-model early; secure-by-design patterns |
| A05 | Security misconfiguration | Harden defaults; least privilege; patch |
| A06 | Vulnerable components | Track and update dependencies |
| A07 | Auth failures | MFA, session hygiene, rate-limit login |
| A08 | Integrity failures | Verify signatures; avoid unsafe deserialization |
| A09 | Logging & monitoring failures | Log security events; alert; protect logs |
| A10 | SSRF | Validate/allow-list outbound URLs |

## Procedure

1. Pick the category (or walk all 10); confirm the learner's stack for tailored examples.
2. Explain **why it happens** and its impact in plain terms, from first principles.
3. Show a **minimal** vulnerable snippet (labeled, non-weaponized) beside the **fixed** version.
4. State the mitigation and principle; note how to **verify** the fix and the next category to learn.

## Output shape

```
Category: <Axx — name> (OWASP Top 10, 2021)
Why it happens: … | Impact: …
Vulnerable (for understanding): <minimal snippet>
Fixed: <snippet> — principle: …
Mitigation & verify: control → how to confirm it
```

## Tips

- Vulnerable examples are illustrative and minimal — never a working exploit or attack guide.
- Prevention over blame: pair every risk with its control and a way to test it.
- End with the **Learning Footer** (`AGENTS.md`).
