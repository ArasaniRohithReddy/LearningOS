---
name: gcp-datastore-emulator-lab
description: "Hands-on GCP lab: practice Cloud Datastore (Firestore in Datastore mode) locally and fully offline with the free official Datastore emulator — no Google Cloud billing account, no subscription, no real credentials. Start it with gcloud beta emulators datastore start, source env-init to set DATASTORE_EMULATOR_HOST, then use the client libraries to put entities and run queries. Use for 'learn Datastore without billing', 'local Datastore emulator', 'offline GCP NoSQL lab', 'DATASTORE_EMULATOR_HOST', 'hands-on lab', or practicing entities and queries by doing."
argument-hint: "The Datastore task (entities/kinds/queries)"
---

# GCP Datastore Emulator Lab

Learn Datastore by *running Google's local emulator* — start it, source one env var, put an entity and query it
back — no project or bill, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [floci-gcp-local-lab](../floci-gcp-local-lab/SKILL.md) and [gcp-iam-lab](../gcp-iam-lab/SKILL.md).

## When to use

- The learner wants runnable Datastore practice with no Google Cloud billing, subscription, or budget.
- Reinforcing hands-on entity modeling (kinds, keys, queries) offline for a **GCP/backend** role-agent.

## Procedure

1. **Concept:** the Datastore emulator is Google's **official** local *emulator* for dev/test — it approximates
   the Datastore API with no cloud project or bill, and its index/consistency behavior is simulated, not
   identical to production (cloud.google.com/datastore/docs/tools/datastore-emulator, 2026).
2. **Start it:** `gcloud beta emulators datastore start` (needs the free gcloud CLI + Java); it defaults to
   `localhost:8081` and prints the exact env exports you need.
3. **Point your tools:** in the app terminal, run `$(gcloud beta emulators datastore env-init)` to set
   `DATASTORE_EMULATOR_HOST` (and `DATASTORE_PROJECT_ID`) so the client libraries auto-target the emulator.
4. **Do a small exercise:** put an entity of a **kind** with a key and properties, then run a query that filters
   on a property and returns it.
5. **Verify:** get the entity back by key or query with the same client — approximate behavior, so cross-check
   eventual-consistency and composite-index rules against the Datastore docs.
6. ⚠ **Clean up:** stop the emulator with Ctrl-C and `unset DATASTORE_EMULATOR_HOST`; state is in-memory and gone
   on exit, but a stale env var silently keeps apps pointed at nothing.

## Output shape

```
Start:  gcloud beta emulators datastore start        # default localhost:8081
Point:  $(gcloud beta emulators datastore env-init)  # sets DATASTORE_EMULATOR_HOST
Try:    put entity (kind + key + props) → filter query → read back
Verify: query returns the entity   ·   Clean: Ctrl-C + unset DATASTORE_EMULATOR_HOST ⚠
# start (separate terminals)
gcloud beta emulators datastore start
# in the app terminal, before running your code:
$(gcloud beta emulators datastore env-init)
export DATASTORE_PROJECT_ID=demo
```

## Tips

- The emulator is free and official but *approximate* — it simulates eventual consistency and index handling, so validate anything you ship against the official Datastore docs.
- `env-init` is the safe way to point tools at the emulator; reuse the host alongside [floci-gcp-local-lab](../floci-gcp-local-lab/SKILL.md) and pair access checks with [gcp-iam-lab](../gcp-iam-lab/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one query (ancestor, composite filter) to try next + one behavior to verify against real Datastore yourself.
