---
name: floci-azure-local-lab
description: "Hands-on Azure lab: practice Azure locally and fully offline with the free, open-source Floci AZ emulator — no cloud account, no subscription, no auth token. Run floci/floci-az with docker compose, point Azure SDKs/CLI/Terraform at http://localhost:4577, then exercise Azure Functions, Cosmos DB, and Event Hubs. Use for 'learn Azure without a subscription', 'local Azure emulator', 'offline Azure lab', 'Cosmos DB emulator', 'Floci Azure', or practicing Azure by doing."
argument-hint: "The Azure service to practice (Functions/Cosmos DB/Event Hubs/…)"
---

# Floci Azure Local Lab

Learn Azure by *running it on your laptop* — boot the emulator, aim your SDK at it, build and verify —
no subscription or token, per [`AGENTS.md`](../../../AGENTS.md). Pairs with the sibling [floci-aws-local-lab](../floci-aws-local-lab/SKILL.md) and [floci-gcp-local-lab](../floci-gcp-local-lab/SKILL.md).

## When to use

- The learner wants runnable Azure practice with no subscription, token, or budget.
- Reinforcing hands-on cloud skills offline for an **Azure** or **cloud** role-agent.

## Procedure

1. **Concept:** Floci AZ is a free, MIT-licensed *local* Azure emulator with a `dev` auth mode (any
   account name/key, unvalidated) — for **learning/dev/testing, not production** (github.com/floci-io/floci-az, 2026).
2. **Start it:** `docker compose up` boots `floci/floci-az` on `http://localhost:4577`; mount
   `/var/run/docker.sock` so Azure Functions can spawn runtime containers (optional otherwise).
3. **Point your tools:** aim standard Azure SDK clients / connection strings at `http://localhost:4577`;
   for the Cosmos **Java** SDK or **Terraform/OpenTofu azurerm**, set `FLOCI_AZ_TLS_ENABLED=true` (+ `FLOCI_AZ_HOSTNAME`).
4. **Do a small exercise:** create a Cosmos DB and insert a document via its Mongo/PostgreSQL/
   Cassandra/Gremlin API, or run an Event Hubs or Azure Functions flow — all Docker-backed.
5. **Verify:** read the item back with the same client; if TLS is on, trust the self-signed cert from
   `GET http://localhost:4577/_floci/tls-cert`, then cross-check surprises in the Azure docs.
6. ⚠ **Clean up:** `docker compose down -v` stops the emulator and any Function runtime containers
   it spawned, freeing the Docker socket and ports.

## Output shape

```
Start:  docker compose up  →  endpoint http://localhost:4577  (Floci AZ, MIT)
Point:  Azure SDK clients / connection strings  →  http://localhost:4577
Try:    create a Cosmos DB (Mongo/Postgres/Cassandra/Gremlin) or run a Function
Verify: client reads the item back   ·   Clean: docker compose down -v ⚠
# compose.yaml
services:
  floci-az:
    image: floci/floci-az:latest
    ports: ["4577:4577"]
    volumes: ["/var/run/docker.sock:/var/run/docker.sock"]   # Azure Functions
# TLS only for the Cosmos Java SDK or Terraform/OpenTofu azurerm
FLOCI_AZ_TLS_ENABLED=true
FLOCI_AZ_HOSTNAME=localhost
```

## Tips

- Fidelity is *approximate* and not production — verify anything real against the official Azure docs (floci.io/floci-az).
- The same emulator backs Azure Functions, Event Hubs, and Cosmos DB engine APIs; pair with [azure-landing-zone-coach](../azure-landing-zone-coach/SKILL.md) for cloud-design practice.
- End with the **Learning Footer** (`AGENTS.md`) — one Azure service to emulate next + one behavior to verify against real Azure yourself.
