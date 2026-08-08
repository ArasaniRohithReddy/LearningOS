---
name: gcp-firestore-emulator-lab
description: "Hands-on GCP lab: practice Cloud Firestore locally and fully offline with the free official Firestore emulator (gcloud CLI or the Firebase Local Emulator Suite) — no Google Cloud billing account, no subscription, no real credentials. Start it with gcloud emulators firestore start, export FIRESTORE_EMULATOR_HOST, then use the client libraries to write documents and run queries. Use for 'learn Firestore without billing', 'local Firestore emulator', 'offline GCP NoSQL lab', 'FIRESTORE_EMULATOR_HOST', 'hands-on lab', or practicing documents and queries by doing."
argument-hint: "The Firestore task (documents/collections/queries)"
---

# GCP Firestore Emulator Lab

Learn Firestore by *running Google's local emulator* — start it, export one env var, write a doc and query it
back — no project or bill, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [floci-gcp-local-lab](../floci-gcp-local-lab/SKILL.md) and [gcp-iam-lab](../gcp-iam-lab/SKILL.md).

## When to use

- The learner wants runnable Firestore practice with no Google Cloud billing, subscription, or budget.
- Reinforcing hands-on document modeling (collections, documents, queries) offline for a **GCP/backend** role-agent.

## Procedure

1. **Concept:** the Firestore emulator is Google's **official** local *emulator* for dev/test — it approximates
   the Firestore API in-process with no cloud project or bill, and does **not** enforce production index or
   scaling limits (cloud.google.com/firestore/docs/emulator, 2026).
2. **Start it:** `gcloud emulators firestore start --host-port=localhost:8080` (needs the free gcloud CLI + Java);
   the Firebase Local Emulator Suite (`firebase emulators:start`) wraps the same engine and adds a UI + rules.
3. **Point your tools:** in the app terminal, `export FIRESTORE_EMULATOR_HOST=localhost:8080` (and
   `GOOGLE_CLOUD_PROJECT=demo`) so the client libraries auto-target the emulator instead of the cloud.
4. **Do a small exercise:** create a document under a collection, then run a filtered `where()` query that returns it.
5. **Verify:** re-read the document/query with the same client — approximate behavior, so cross-check
   composite-index, transaction, and consistency semantics against the Firestore docs.
6. ⚠ **Clean up:** stop the emulator with Ctrl-C and `unset FIRESTORE_EMULATOR_HOST`; state is in-memory and gone
   on exit, but a stale env var silently keeps apps pointed at nothing.

## Output shape

```
Start:  gcloud emulators firestore start --host-port=localhost:8080
Point:  export FIRESTORE_EMULATOR_HOST=localhost:8080 ; GOOGLE_CLOUD_PROJECT=demo
Try:    add doc to collection → run where() query → read back (client library)
Verify: query returns the doc   ·   Clean: Ctrl-C + unset FIRESTORE_EMULATOR_HOST ⚠
# start (separate terminals)
gcloud emulators firestore start --host-port=localhost:8080
# in the app terminal, before running your code:
export FIRESTORE_EMULATOR_HOST=localhost:8080
export GOOGLE_CLOUD_PROJECT=demo
```

## Tips

- The emulator is free and official but *approximate* — it skips real index enforcement, security-rules parity (gcloud flavor), and scaling limits, so validate anything you ship against the official Firestore docs.
- Use the **Firebase Local Emulator Suite** ([firebase-emulator-lab](../firebase-emulator-lab/SKILL.md)) when you also want security rules + a UI; reuse the endpoint alongside [floci-gcp-local-lab](../floci-gcp-local-lab/SKILL.md) and check access with [gcp-iam-lab](../gcp-iam-lab/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one query shape (composite index, collection group) to try next + one behavior to verify against real Firestore yourself.
