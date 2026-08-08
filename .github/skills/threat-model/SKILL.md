---
name: threat-model
description: "Run an authorized, DEFENSIVE STRIDE threat-modeling exercise on a design — diagram trust boundaries and data flows, enumerate threats per element, rate risk, and propose mitigations to harden the system. Use for 'threat model this', 'STRIDE analysis', 'security design review', 'what could go wrong with this architecture', or learning defensive security design. Defense only — no attack instructions."
argument-hint: "System/feature to threat-model (design + assets)"
---

# Threat Model

Harden a design by thinking like a defender — **authorized, defensive** modeling to close weaknesses,
never an attack playbook — per the security guardrails in [`AGENTS.md`](../../../AGENTS.md). Complements
[architecture-diagram](../architecture-diagram/SKILL.md).

## When to use

- The learner wants to find and fix weaknesses in a system they own or are authorized to review.
- Security design review before build, or as a hands-on threat-modeling lesson.

## STRIDE (map each threat to a control)

| Threat | Property at risk | Example control |
| --- | --- | --- |
| Spoofing | Authentication | strong authn, MFA |
| Tampering | Integrity | signing, input validation |
| Repudiation | Non-repudiation | audit logs |
| Information disclosure | Confidentiality | encryption, least privilege |
| Denial of service | Availability | rate limits, quotas |
| Elevation of privilege | Authorization | authz checks, sandboxing |

## Procedure

1. Define scope, **assets**, and trust levels; confirm the review is authorized.
2. Draw a data-flow diagram in Mermaid with **trust boundaries** as `subgraph`s.
3. For each element (process, store, data flow, external entity) enumerate STRIDE threats and rate
   risk (likelihood × impact, e.g., simple H/M/L); rank them.
4. Propose a **mitigation** per top threat, note residual risk and cost, and record actionable findings.

## Output shape

```
Scope & assets: … (authorized: yes)
DFD:
  ```mermaid
  flowchart LR
    User --> API
    subgraph Boundary[Trust boundary]
      API --> DB[(PII)]
    end
  ```
Threats (per element): S/T/R/I/D/E → risk H/M/L
Mitigations: threat → control → residual risk (list the top 3 to fix first)
```

## Tips

- Stay defensive: enumerate weaknesses to **close** them, never steps to exploit a system.
- Boundaries are where bugs bite — scrutinize every data flow that crosses one.
- End with the **Learning Footer** (`AGENTS.md`).
