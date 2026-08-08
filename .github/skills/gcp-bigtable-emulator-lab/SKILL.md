---
name: gcp-bigtable-emulator-lab
description: "Hands-on GCP lab: practice Cloud Bigtable locally and fully offline with the free official Bigtable emulator — no Google Cloud billing account, no subscription, no real credentials. Start it with gcloud beta emulators bigtable start, source env-init to set BIGTABLE_EMULATOR_HOST, then use cbt or the client libraries to create tables and read/write rows by row key. Use for 'learn Bigtable without billing', 'local Bigtable emulator', 'offline GCP wide-column lab', 'BIGTABLE_EMULATOR_HOST', 'hands-on lab', or practicing tables and row keys by doing."
argument-hint: "The Bigtable task (tables/column families/row keys)"
---

# GCP Bigtable Emulator Lab

Learn Bigtable by *running Google's local emulator* — start it, source one env var, write a row and read it
back — no cluster or bill, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [floci-gcp-local-lab](../floci-gcp-local-lab/SKILL.md) and [gcp-iam-lab](../gcp-iam-lab/SKILL.md).

## When to use

- The learner wants runnable Bigtable practice with no Google Cloud billing, subscription, or budget.
- Reinforcing hands-on wide-column modeling (tables, column families, row keys) offline for a **GCP/data** role-agent.

## Procedure

1. **Concept:** the Bigtable emulator is Google's **official** in-memory *emulator* for dev/test — it approximates
   the data API with no cloud instance or bill, and is single-node with **no persistence, replication, or GC-policy
   enforcement** (cloud.google.com/bigtable/docs/emulator, 2026).
2. **Start it:** `gcloud beta emulators bigtable start` (needs the free gcloud CLI + Java); it defaults to
   `localhost:8086`.
3. **Point your tools:** in the app terminal, run `$(gcloud beta emulators bigtable env-init)` to set
   `BIGTABLE_EMULATOR_HOST` so `cbt` and the client libraries auto-target the emulator.
4. **Do a small exercise:** with `cbt`, `createtable`, add a **column family**, then `set` a cell on a **row key**
   and read it back with `lookup`/`read`.
5. **Verify:** the row you wrote reads back under the same key — approximate behavior, so cross-check row-key
   design, GC policies, and performance semantics against the Bigtable docs.
6. ⚠ **Clean up:** stop the emulator with Ctrl-C and `unset BIGTABLE_EMULATOR_HOST`; state is in-memory and gone
   on exit, but a stale env var silently keeps apps pointed at nothing.

## Output shape

```
Start:  gcloud beta emulators bigtable start          # default localhost:8086
Point:  $(gcloud beta emulators bigtable env-init)    # sets BIGTABLE_EMULATOR_HOST
Try:    cbt createtable → add column family → set cell on row key → read back
Verify: row reads back by key   ·   Clean: Ctrl-C + unset BIGTABLE_EMULATOR_HOST ⚠
# start (separate terminals)
gcloud beta emulators bigtable start
# in the app terminal, before running cbt/your code:
$(gcloud beta emulators bigtable env-init)
cbt -project demo -instance demo createtable my-table   # then: createfamily / set / read
```

## Tips

- The emulator is free and official but *approximate* — it omits persistence, replication, GC policies, and real performance, so validate row-key design and anything you ship against the official Bigtable docs.
- Row-key design is the whole game in Bigtable — practice avoiding hotspots here, then reuse the host alongside [floci-gcp-local-lab](../floci-gcp-local-lab/SKILL.md) and check access with [gcp-iam-lab](../gcp-iam-lab/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one row-key pattern (reverse-timestamp, salting) to try next + one behavior to verify against real Bigtable yourself.
