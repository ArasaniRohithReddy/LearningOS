---
name: floci-gcp-local-lab
description: "Hands-on GCP lab: practice Google Cloud locally and fully offline with the free, open-source floci-gcp emulator — no cloud account, no billing, no real credentials. Start floci/floci-gcp with docker compose, point GCP SDKs/gcloud/Terraform at localhost:4588, then exercise Pub/Sub, Firestore, Cloud Storage, and Secret Manager. Use for 'learn GCP without an account', 'local GCP emulator', 'offline GCP lab', 'Pub/Sub emulator', 'Floci GCP', or practicing GCP by doing."
argument-hint: "The GCP service to practice (Pub/Sub/Firestore/Storage/…)"
---

# Floci GCP Local Lab

Learn Google Cloud by *running it on your laptop* — boot the emulator, point your SDK/gcloud at it,
build and verify — no account or billing, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [gcp-pubsub-lab](../gcp-pubsub-lab/SKILL.md) and [gcp-cloud-storage-lab](../gcp-cloud-storage-lab/SKILL.md).

## When to use

- The learner wants runnable GCP practice with no account, billing, or budget.
- Reinforcing hands-on cloud skills offline for a **GCP** or **cloud/data** role-agent.

## Procedure

1. **Concept:** floci-gcp is a free, MIT-licensed *local* GCP emulator speaking real wire protocols on
   one port; credentials aren't validated — **learning/dev/testing, not production** (github.com/floci-io/floci-gcp, 2026).
2. **Start it:** `docker compose up` boots `floci/floci-gcp` on `http://localhost:4588` — one port
   multiplexing gRPC and REST via HTTP/2 ALPN.
3. **Point your tools:** export the standard Google emulator host vars (`PUBSUB_EMULATOR_HOST`,
   `FIRESTORE_EMULATOR_HOST`, `STORAGE_EMULATOR_HOST`, `SECRET_MANAGER_EMULATOR_HOST`) to `localhost:4588` + `GOOGLE_CLOUD_PROJECT`.
4. **Do a small exercise:** publish and pull a Pub/Sub message ([gcp-pubsub-lab](../gcp-pubsub-lab/SKILL.md)),
   or write a Firestore doc / a Cloud Storage object with the GCP SDK, gcloud, or Terraform.
5. **Verify:** pull the message back or re-read the object with the same client — real protobuf-over-
   gRPC and REST, so cross-check anything surprising against the Google Cloud docs.
6. ⚠ **Clean up:** `docker compose down -v` stops the emulator and clears local state so the next
   run starts clean.

## Output shape

```
Start:  docker compose up  →  single endpoint http://localhost:4588
Point:  GCP SDKs / gcloud / Terraform  →  *_EMULATOR_HOST=localhost:4588
Try:    publish + pull a Pub/Sub message, or write a Firestore doc
Verify: message pulls back   ·   Clean: docker compose down -v ⚠
# compose.yaml
services:
  floci-gcp:
    image: floci/floci-gcp:latest
    ports: ["4588:4588"]
PUBSUB_EMULATOR_HOST=localhost:4588
FIRESTORE_EMULATOR_HOST=localhost:4588
STORAGE_EMULATOR_HOST=http://localhost:4588
SECRET_MANAGER_EMULATOR_HOST=localhost:4588
GOOGLE_CLOUD_PROJECT=floci-local
```

## Tips

- Fidelity is *approximate* and not production — confirm anything real against the official Google Cloud docs (floci.io/floci-gcp).
- Reuse the endpoint across [gcp-cloud-functions-lab](../gcp-cloud-functions-lab/SKILL.md), [gcp-bigquery-lab](../gcp-bigquery-lab/SKILL.md), gcp-iam-lab, and gcp-gke-lab.
- **Let Drona drive it:** with the emulator-host env vars exported, Drona can run `gcloud`/SDK calls against local floci — floci is "AI-ready" via **env vars, not an MCP server** (none exists). See [`docs/Floci.md`](../../../docs/Floci.md) for the unified CLI (`floci gcp start && eval $(floci gcp env)`) and the sibling [floci-oracle-local-lab](../floci-oracle-local-lab/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one GCP service to emulate next + one behavior to verify against real GCP yourself.
