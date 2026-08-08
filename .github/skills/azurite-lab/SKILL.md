---
name: azurite-lab
description: "Hands-on Azure lab: practice Azure Storage locally and fully offline with Azurite, Microsoft's free open-source Storage emulator — no Azure subscription, no account, no real keys. Run the mcr.microsoft.com/azure-storage/azurite image with docker compose, point the Azure SDK/CLI/Storage Explorer at Blob 10000, Queue 10001, and Table 10002, then create containers, upload blobs, and queue messages. Use for 'learn Azure Storage without a subscription', 'local Azure emulator', 'offline Azurite lab', or practicing Azure Storage by doing."
argument-hint: "The Azure Storage service to emulate (Blob/Queue/Table)"
---

# Azurite Azure Storage Lab

Learn Azure Storage by *running Microsoft's local emulator* — `docker compose up`, point your SDK at
localhost, build and verify — no subscription or bill, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [azure-storage-lab](../azure-storage-lab/SKILL.md) and [floci-azure-local-lab](../floci-azure-local-lab/SKILL.md).

## When to use

- The learner wants runnable Azure Storage practice with no subscription, account, or budget.
- Reinforcing hands-on Blob/Queue/Table skills offline for an **Azure** or **cloud/backend** role-agent.

## Procedure

1. **Concept:** Azurite is Microsoft's **official, open-source** Azure Storage *emulator* for local dev/test —
   it approximates Blob, Queue, and Table storage, not the full service (Microsoft Learn, *Use Azurite
   emulator for local Azure Storage development*, 2026).
2. **Start it:** `docker compose up` runs `mcr.microsoft.com/azure-storage/azurite`, exposing Blob on
   `10000`, Queue on `10001`, and Table on `10002`.
3. **Point your tools:** use `UseDevelopmentStorage=true` (the well-known devstoreaccount1 connection
   string) so the Azure SDK, Azure CLI, and Storage Explorer target `http://127.0.0.1:10000`.
4. **Do a small exercise:** create a container, upload a blob, then send a queue message with the SDK or
   `az storage` commands.
5. **Verify:** list the container and download the blob back — same SDK shapes as Azure, yet only
   *approximate*, so cross-check surprises in the Azure docs.
6. ⚠ **Clean up:** `docker compose down -v` stops Azurite and drops the local `__blobstorage__` /
   `__queuestorage__` data; nothing bills, but stale state confuses reruns.

## Output shape

```
Start:  docker compose up  →  Blob 10000 · Queue 10001 · Table 10002
Point:  Azure SDK/CLI/Storage Explorer  →  UseDevelopmentStorage=true
Try:    az storage container create --name demo …
Verify: az storage blob list → blob appears   ·   Clean: docker compose down -v ⚠
# compose.yaml
services:
  azurite:
    image: mcr.microsoft.com/azure-storage/azurite:latest
    ports: ["10000:10000","10001:10001","10002:10002"]
# devstore connection string (well-known local account)
UseDevelopmentStorage=true
```

## Tips

- Azurite is free and open source, but it *emulates* storage — supported API versions and edge behaviors lag real Azure, so validate anything you ship against the official Azure Storage docs.
- The devstoreaccount1 key is a *public, well-known* dev credential — never reuse it or run Azurite for production or real data.
- End with the **Learning Footer** (`AGENTS.md`) — one storage type to try next + one behavior to verify against real Azure Storage yourself.
