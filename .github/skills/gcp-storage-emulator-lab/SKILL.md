---
name: gcp-storage-emulator-lab
description: "Hands-on GCP lab: practice Cloud Storage (GCS) locally and fully offline with the free open-source fake-gcs-server (fsouza) — no Google Cloud billing account, no subscription, no real credentials. Start the container, export STORAGE_EMULATOR_HOST, then use the client libraries to create buckets and upload/list/download objects. Use for 'learn GCS without billing', 'local Cloud Storage emulator', 'offline GCP object storage lab', 'STORAGE_EMULATOR_HOST', 'fake-gcs-server', 'hands-on lab', or practicing buckets and objects by doing."
argument-hint: "The Storage task (buckets/objects/upload/download)"
---

# GCP Storage Emulator Lab

Learn Cloud Storage by *running a local GCS-compatible server* — boot the container, export one env var, upload an
object and read it back — no project or bill, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [floci-gcp-local-lab](../floci-gcp-local-lab/SKILL.md) and [gcp-iam-lab](../gcp-iam-lab/SKILL.md).

## When to use

- The learner wants runnable object-storage practice with no Google Cloud billing, subscription, or budget.
- Reinforcing hands-on GCS basics (buckets, objects, upload/download) offline for a **GCP/backend** role-agent.

## Procedure

1. **Concept:** fake-gcs-server is a free, **third-party (not Google)** OSS server that speaks the GCS JSON/XML
   API locally for dev/test; coverage is partial — IAM, signed URLs, lifecycle, and versioning are limited or
   absent (github.com/fsouza/fake-gcs-server, 2026).
2. **Start it:** `docker run -p 4443:4443 fsouza/fake-gcs-server -scheme http -port 4443` serves the emulator on
   `http://localhost:4443`.
3. **Point your tools:** `export STORAGE_EMULATOR_HOST=http://localhost:4443` so the client libraries target the
   emulator instead of the cloud (add `-public-host`/`-external-url` when download URLs must resolve back).
4. **Do a small exercise:** create a bucket, upload an object with the GCS client, then list the bucket.
5. **Verify:** download the object back and compare bytes — approximate behavior, so cross-check auth, signed
   URLs, and lifecycle semantics against the official Cloud Storage docs.
6. ⚠ **Clean up:** stop the container (Ctrl-C / `docker stop`) and `unset STORAGE_EMULATOR_HOST`; in-memory state
   is gone on exit, but a stale env var silently keeps apps pointed at nothing.

## Output shape

```
Start:  docker run -p 4443:4443 fsouza/fake-gcs-server -scheme http -port 4443
Point:  export STORAGE_EMULATOR_HOST=http://localhost:4443
Try:    create bucket → upload object → list bucket → download back (client library)
Verify: downloaded bytes == uploaded   ·   Clean: docker stop + unset STORAGE_EMULATOR_HOST ⚠
# start (separate terminals)
docker run -p 4443:4443 fsouza/fake-gcs-server -scheme http -port 4443
# in the app terminal, before running your code:
export STORAGE_EMULATOR_HOST=http://localhost:4443
export GOOGLE_CLOUD_PROJECT=demo
```

## Tips

- It's free and handy but *not* Google's product and *approximate* — no real IAM/signed-URL/lifecycle parity, and `STORAGE_EMULATOR_HOST` support varies by client library, so validate anything you ship against the official Cloud Storage docs.
- Pre-seed buckets/objects with a mounted `-data`/`-filesystem-root` folder for repeatable labs; reuse the endpoint alongside [floci-gcp-local-lab](../floci-gcp-local-lab/SKILL.md) and check access with [gcp-iam-lab](../gcp-iam-lab/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one operation (resumable upload, object metadata) to try next + one behavior to verify against real Cloud Storage yourself.
