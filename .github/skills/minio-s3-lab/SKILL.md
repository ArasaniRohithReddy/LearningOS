---
name: minio-s3-lab
description: "Hands-on object-storage lab: practice the Amazon S3 API locally and fully offline with MinIO, free open-source S3-compatible storage — no AWS account, no subscription, no cloud keys. Run minio/minio with docker compose, open the web console, then point the AWS CLI/SDK at the S3 API on http://localhost:9000 to create buckets and put/get objects. Use for 'learn S3 without an account', 'local S3-compatible storage', 'offline MinIO lab', 'S3 API on localhost', or practicing object storage by doing."
argument-hint: "The S3/object-storage task to practice"
---

# MinIO S3-Compatible Lab

Learn the S3 API by *running local object storage* — `docker compose up`, aim the AWS CLI at localhost,
build and verify — no account or bill, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [aws-s3-lab](../aws-s3-lab/SKILL.md) and [floci-aws-local-lab](../floci-aws-local-lab/SKILL.md).

## When to use

- The learner wants runnable S3-API practice with no AWS account, subscription, or budget.
- Reinforcing hands-on object-storage skills offline for a **cloud/backend/data** role-agent.

## Procedure

1. **Concept:** MinIO is free, open-source (AGPLv3 Community) storage that *implements the S3 API* — it is
   its own product, S3-*compatible* rather than AWS S3, so some features differ
   (github.com/minio/minio, 2026).
2. **Start it:** `docker compose up` runs `minio/minio server /data --console-address ":9001"`, exposing the
   S3 API on `9000` and the web console on `9001`.
3. **Point your tools:** set `AWS_ENDPOINT_URL=http://localhost:9000` with the root user/password as the
   access/secret key, and enable path-style (`aws configure set default.s3.addressing_style path`).
4. **Do a small exercise:** `aws --endpoint-url http://localhost:9000 s3 mb s3://demo`, then put and list an
   object.
5. **Verify:** the bucket and object appear in the console at `http://localhost:9001` and via `aws s3 ls` —
   approximate S3 behavior, so cross-check surprises in the AWS S3 docs.
6. ⚠ **Clean up:** `docker compose down -v` stops MinIO and drops the `/data` volume; nothing bills, but
   stale buckets confuse reruns.

## Output shape

```
Start:  docker compose up  →  S3 API 9000 · console 9001
Point:  AWS CLI/SDK  →  AWS_ENDPOINT_URL=http://localhost:9000 (path-style)
Try:    aws --endpoint-url http://localhost:9000 s3 mb s3://demo
Verify: console 9001 shows bucket   ·   Clean: docker compose down -v ⚠
# compose.yaml
services:
  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    ports: ["9000:9000","9001:9001"]
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
```

## Tips

- MinIO Community (AGPLv3) is free and OSS; a separate commercial edition exists — don't assume enterprise features are free, and treat MinIO as *S3-compatible*, verifying real-S3 details in the AWS docs.
- Change the default `minioadmin` credentials for anything beyond a throwaway lab, and never expose the console publicly.
- End with the **Learning Footer** (`AGENTS.md`) — one S3 feature (versioning, presigned URLs) to try next + one behavior to verify against real AWS S3 yourself.
