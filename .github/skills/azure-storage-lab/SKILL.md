---
name: azure-storage-lab
description: "Hands-on Azure lab: build Blob Storage end to end — create a storage account and containers, upload blobs, set access tiers and lifecycle rules, and lock down access with Microsoft Entra RBAC and a user-delegation SAS. Use for 'Azure Blob Storage lab', 'create a container', 'blob access tiers', 'SAS vs RBAC', 'secure a storage account', 'Blob hands-on lab', or learning object storage on Azure by doing."
argument-hint: "The storage need"
---

# Azure Storage Lab

Learn Blob Storage by building an account — store blobs, tier them, and lock down access — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [cloud-cost-optimizer](../cloud-cost-optimizer/SKILL.md) and [azure-landing-zone-coach](../azure-landing-zone-coach/SKILL.md).

## When to use

- The learner wants a guided, runnable object-storage account, not just theory.
- Reinforcing durable, secure storage for a **cloud/backend/data** role-agent.

## Mental model

A storage account holds **containers**, which hold **blobs** (block/append/page) under a flat namespace;
data is encrypted at rest by default with 256-bit AES (Microsoft Learn, *Azure Storage encryption*, 2024).

## Procedure

1. **Create the account + container:** private containers only; keep **"allow blob public access" OFF** and
   require secure transfer (HTTPS) — public containers are the classic leak.
2. **Upload & organize blobs:** use key prefixes (folders are an illusion) and pick block blobs for most files.
3. **Set access tiers:** Hot / Cool / Cold for online data, Archive for offline — colder = cheaper storage,
   pricier reads (Microsoft Learn, *Access tiers for blob data*, 2024).
4. **Lifecycle rules:** auto-transition stale blobs to Cool/Cold/Archive and expire old versions
   ([cloud-cost-optimizer](../cloud-cost-optimizer/SKILL.md)).
5. **Secure access — Entra first:** assign **least-privilege** roles (e.g., Storage Blob Data Reader) over
   Shared Key; for temporary links hand out a **user-delegation SAS** (Entra-signed, short expiry), not an
   account-key SAS (Microsoft Learn, *Authorize access to blobs using Microsoft Entra ID*, 2024).
6. ⚠ **Verify & clean up:** confirm anonymous GET is denied and the SAS expires, then delete the container/
   account so it stops billing.

## Output shape

```
Need: <what you're storing> | Account: <name> @ <region>
Access: public access OFF | HTTPS only | Entra RBAC role <…>
Tier: Hot/Cool/Cold/Archive | Encryption: AES-256 (default)
Lifecycle: →Cool @30d, →Archive @180d, expire old versions
Temp access: user-delegation SAS (short expiry, not account key)
Cleanup: delete container/account  [⚠ stops storage cost]
```

## Tips

- Prefer Entra RBAC and a user-delegation SAS over account keys — rotate/disable Shared Key where you can.
- Tiering without lifecycle rules silently grows the bill; automate the transitions.
- End with the **Learning Footer** (`AGENTS.md`) — one role to scope + one lifecycle rule to add yourself.
