---
name: azure-keyvault-lab
description: "Hands-on Azure lab: secure secrets with Azure Key Vault end to end — create a vault, add secrets/keys, control access with Azure RBAC (over access policies), and read them from an app via managed identity and Key Vault references. Use for 'Azure Key Vault lab', 'store a secret', 'Key Vault RBAC vs access policies', 'managed identity secret access', 'Key Vault references', 'Key Vault hands-on lab', or learning secrets management on Azure by doing."
argument-hint: "The secret need"
---

# Azure Key Vault Lab

Learn Key Vault by securing a secret — store it, scope access, then read it with no creds in code — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [azure-functions-lab](../azure-functions-lab/SKILL.md) and [azure-landing-zone-coach](../azure-landing-zone-coach/SKILL.md).

## When to use

- The learner wants secrets out of code and config, read at runtime by a real app.
- Reinforcing least-privilege secret handling for a **cloud/backend/DevOps** role-agent.

## Mental model

A vault stores **secrets, keys, and certificates** behind Entra auth; **soft-delete** is always on so a
deleted vault/secret is recoverable, and **purge protection** blocks early permanent deletion (Microsoft
Learn, *Azure Key Vault soft-delete overview*, 2024).

## Procedure

1. **Create the vault:** choose **Azure RBAC** as the permission model (not legacy access policies) and turn
   on **purge protection** for prod-like vaults.
2. **Add secrets/keys:** store a secret (e.g., a DB connection string) or a key; versioning is automatic —
   never commit these to source.
3. **Grant least privilege:** assign **Key Vault Secrets User** (read values) to the app identity — not
   Secrets Officer/Contributor — scoped at the vault or secret.
4. **Integrate the app:** give it a **managed identity** and read via `DefaultAzureCredential` + `SecretClient`,
   or use **Key Vault references** in App Service/Functions settings — zero secrets in code.
5. **Verify:** the app reads the secret; a principal *without* the role is denied (RBAC works).
6. ⚠ **Rotate & clean up:** set rotation/expiry, prefer **private endpoints** in prod, then delete the vault —
   soft-delete retains it, so purge only if you truly must.

## Output shape

```
Need: <secret/key> | Vault: <name> | Model: Azure RBAC (not access policies)
Protection: soft-delete (always) + purge protection on
Secret: <name> (versioned) | never in source
Access: Key Vault Secrets User → app identity (least privilege)
App: managed identity + DefaultAzureCredential / Key Vault references
Verify: app reads ✓ | unroled principal denied ✓ | Cleanup: delete (soft) [⚠ purge only if needed]
```

## Tips

- Prefer Azure RBAC over access policies, and a managed identity over any stored credential.
- Reference secrets from app settings so rotation needs no redeploy.
- End with the **Learning Footer** (`AGENTS.md`) — one role to scope + one secret to rotate yourself.
