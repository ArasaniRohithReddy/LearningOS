---
name: gcp-spanner-emulator-lab
description: "Hands-on GCP lab: practice Cloud Spanner locally and fully offline with the free official open-source Spanner emulator (Docker image gcr.io/cloud-spanner-emulator/emulator) — no Google Cloud billing account, no subscription, no real credentials. Start the container, export SPANNER_EMULATOR_HOST, create an instance and database, then apply DDL schema and run SQL. Use for 'learn Spanner without billing', 'local Spanner emulator', 'offline GCP relational lab', 'SPANNER_EMULATOR_HOST', 'hands-on lab', or practicing schema and SQL by doing."
argument-hint: "The Spanner task (schema/DDL/SQL)"
---

# GCP Spanner Emulator Lab

Learn Spanner by *running Google's local emulator* — boot the container, export one env var, create a schema and
query it — no instance or bill, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [floci-gcp-local-lab](../floci-gcp-local-lab/SKILL.md) and [gcp-iam-lab](../gcp-iam-lab/SKILL.md).

## When to use

- The learner wants runnable Spanner practice with no Google Cloud billing, subscription, or budget.
- Reinforcing hands-on relational modeling (DDL schema, primary keys, SQL) offline for a **GCP/data** role-agent.

## Procedure

1. **Concept:** the Spanner emulator is Google's **official, open-source** in-memory *emulator* for dev/test — it
   speaks the real gRPC/REST API with no instance or bill, but is **not** performance-faithful and omits some
   features (backups, fine-grained access, certain functions) (cloud.google.com/spanner/docs/emulator, 2026).
2. **Start it:** `docker run -p 9010:9010 -p 9020:9020 gcr.io/cloud-spanner-emulator/emulator`
   (gRPC on 9010, REST on 9020); `gcloud emulators spanner start` runs the same engine without Docker.
3. **Point your tools:** `export SPANNER_EMULATOR_HOST=localhost:9010` for the client libraries; for gcloud,
   `gcloud config set auth/disable_credentials true` and `gcloud config set api_endpoint_overrides/spanner http://localhost:9020/`.
4. **Do a small exercise:** create an instance and database, apply DDL (`CREATE TABLE … PRIMARY KEY (…)`), then
   `INSERT` and `SELECT` rows with SQL.
5. **Verify:** your `SELECT` returns the inserted rows — approximate behavior, so cross-check interleaving,
   transaction, and unsupported-feature notes against the Spanner emulator docs.
6. ⚠ **Clean up:** stop the container (Ctrl-C / `docker stop`) and `unset SPANNER_EMULATOR_HOST`; state is
   in-memory and gone on exit, but a stale env var silently keeps apps pointed at nothing.

## Output shape

```
Start:  docker run -p 9010:9010 -p 9020:9020 gcr.io/cloud-spanner-emulator/emulator
Point:  export SPANNER_EMULATOR_HOST=localhost:9010  (gcloud: disable creds + endpoint override)
Try:    create instance → database → DDL CREATE TABLE → INSERT/SELECT
Verify: SELECT returns rows   ·   Clean: docker stop + unset SPANNER_EMULATOR_HOST ⚠
# start (separate terminals)
docker run -p 9010:9010 -p 9020:9020 gcr.io/cloud-spanner-emulator/emulator
# in the app terminal, before running your code:
export SPANNER_EMULATOR_HOST=localhost:9010
gcloud config set auth/disable_credentials true
gcloud config set api_endpoint_overrides/spanner http://localhost:9020/
```

## Tips

- The emulator is free and official but *approximate* — no real latency/scale, no backups, and some SQL features are unsupported, so validate anything you ship against the official Spanner emulator docs.
- Design and test your DDL and primary keys here (interleaving, hotspot-safe keys), then reuse the endpoint alongside [floci-gcp-local-lab](../floci-gcp-local-lab/SKILL.md) and check access with [gcp-iam-lab](../gcp-iam-lab/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one schema feature (interleaved tables, secondary index) to try next + one behavior to verify against real Spanner yourself.
