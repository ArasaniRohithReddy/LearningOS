---
name: security-hardening-checklist
description: "Produce a prioritized, defensive hardening checklist for a system or service — configuration, authn/authz, secrets, network, logging, patching — each item mapped to CIS or NIST guidance so the learner knows the standard behind it. Use for 'harden my server/app', 'security hardening checklist', 'CIS benchmark for X', 'how do I secure this service', or 'baseline my config'."
argument-hint: "The system/service to harden"
---

# Security Hardening Checklist

Turn a system into a **hardened baseline** with prioritized, actionable controls — defensive and
authorized per [`AGENTS.md`](../../../AGENTS.md). Complements
[threat-model](../threat-model/SKILL.md) and [secure-code-review](../secure-code-review/SKILL.md).

## When to use

- The learner owns (or is authorized to secure) a service and wants a concrete, ranked checklist.
- Establishing a security baseline before go-live, or auditing config drift against a standard.

## Hardening domains (map each to a standard)

| Domain | Sample controls | Reference |
| --- | --- | --- |
| Configuration | Disable defaults, remove unused services/ports | CIS Benchmarks |
| AuthN/AuthZ | MFA, least privilege, deny by default | NIST SP 800-53 (AC, IA) |
| Secrets | Vault/KMS, rotate, no secrets in code | CIS Controls v8 |
| Network | Segment, firewall, TLS in transit | NIST CSF 2.0 (2024) |
| Logging & monitoring | Central logs, alerting, retention | NIST SP 800-53 (AU) |
| Patching | Track components, timely updates | CIS Controls v8 |

## Procedure

1. Scope the asset, its data sensitivity, and exposure; confirm you're authorized to change it.
2. Walk each domain above; for every gap, write a **specific** control (not "be secure").
3. Prioritize by risk (exposure × impact): P1 = internet-facing or protects sensitive data.
4. Cite the CIS/NIST item each control maps to; note how to **verify** it (command/config/scan).
5. Add rollback and a re-check cadence; record residual risk you accept and why.

## Output shape

```
Asset: <service> | Data: <sensitivity> | Authorized: yes
[P1] <domain> — <control> → verify: <check> → ref: <CIS/NIST>
[P2] …
Accepted residual risk: … | Re-check: <cadence>
```

## Tips

- Be specific and measurable — each item should be verifiable, not aspirational.
- Least privilege and deny-by-default beat one-off patches; harden the baseline.
- Close with the **Learning Footer** (`AGENTS.md`).
