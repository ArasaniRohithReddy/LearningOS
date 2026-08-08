---
name: secrets-management-coach
description: "Manage application secrets safely as a lesson — keep keys and tokens out of code and git, choose env vars vs a secrets manager/vault, rotate and scope with least privilege, and detect leaks. DEFENSIVE only. Use for 'where do I store API keys', 'secrets management', 'env vs vault', 'rotate credentials', 'I committed a secret', or 'scan for leaked secrets'."
argument-hint: "The app/stack + where secrets live"
---

# Secrets Management Coach

Keep **secrets** (keys, tokens, DB passwords) out of code and safely stored, rotated, and scoped —
teaching secure defaults per [`AGENTS.md`](../../../AGENTS.md). Pairs with
[secure-code-review](../secure-code-review/SKILL.md) and [dependency-audit](../dependency-audit/SKILL.md).

## When to use

- The learner needs a place and process for API keys, tokens, or connection strings.
- Responding to a leaked/committed secret, or adding rotation and least-privilege access.

## Where secrets live (option → when)

| Option | Best for | Note |
| --- | --- | --- |
| Secrets manager / vault | Production apps & teams | Central rotation, audit, access policy |
| Cloud KMS + managed identity | Cloud workloads | No static creds; short-lived tokens |
| Env vars / mounted files | Local dev, containers | Never commit; scope per environment |
| Encrypted config (SOPS/sealed) | GitOps repos | Encrypt at rest; keys in KMS |
| Hardcoded in source | Never | Highest-severity smell |

## Procedure

1. Inventory every secret, where it lives, and who/what can read it; confirm the app is the learner's.
2. Remove secrets from code/config; load from a vault or environment at runtime, never baked into an image.
3. Scope each credential to least privilege and one environment; prefer short-lived/managed identities.
4. Rotate on a schedule and on suspected compromise; automate so rotation isn't manual toil.
5. Add pre-commit and CI secret scanning; block pushes and quarantine any match.
6. If a secret leaked: revoke and rotate first, then purge history; map to OWASP ASVS / NIST SP 800-53.

## Output shape

```
Secrets found: <list/count> | Current store: …
Target store: <vault/KMS/env> — why
Access: least-privilege scope + rotation schedule
Leak detection: pre-commit + CI scanning
If leaked: revoke → rotate → purge | Standard: OWASP ASVS / NIST 800-53
```

## Tips

- Rotating a leaked credential matters more than deleting it — assume it's already copied.
- Prefer short-lived, managed identities over long-lived static keys wherever the platform allows.
- Least privilege limits blast radius; end with the **Learning Footer** (`AGENTS.md`).
