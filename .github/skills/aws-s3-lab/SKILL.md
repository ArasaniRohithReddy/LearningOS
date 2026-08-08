---
name: aws-s3-lab
description: "Hands-on AWS lab: build an S3 bucket end to end — create a bucket, put/get objects, turn on versioning, add lifecycle rules, and lock down access with Block Public Access and a least-privilege policy. Use for 'AWS S3 lab', 'create an S3 bucket', 'S3 versioning', 'S3 lifecycle rules', 'secure an S3 bucket', 'S3 hands-on lab', or learning object storage by doing."
argument-hint: "The storage need"
---

# AWS S3 Lab

Learn S3 by building a bucket — store objects, version them, tier them, and lock down access — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [aws-well-architected-review](../aws-well-architected-review/SKILL.md) and [cloud-cost-optimizer](../cloud-cost-optimizer/SKILL.md).

## When to use

- The learner wants a guided, runnable object-storage bucket, not just theory.
- Reinforcing durable, secure storage for a **cloud/backend/data** role-agent.

## Mental model

S3 stores **objects** (bytes + metadata) under a flat key namespace inside a **bucket** — 11 nines of
durability, and for new buckets Block Public Access is on and ACLs off by default (Amazon S3 User Guide,
*Blocking public access*; default since April 2023).

## Procedure

1. **Create the bucket:** a globally-unique name in one region; keep **Block Public Access ON** — public
   buckets are the classic data leak.
2. **Put & get objects:** upload with keys/prefixes (folders are an illusion); new objects are encrypted at
   rest by default with SSE-S3 (Amazon S3 User Guide; default since January 2023).
3. **Enable versioning:** keep prior versions to survive overwrites and deletes — but each version costs
   storage, so pair it with lifecycle.
4. **Lifecycle rules:** transition cold data to Standard-IA/Glacier and expire old versions and incomplete
   uploads ([cloud-cost-optimizer](../cloud-cost-optimizer/SKILL.md)).
5. **Secure access:** grant a **least-privilege** bucket/IAM policy scoped to the prefix, and hand out
   presigned URLs for temporary access instead of making objects public.
6. ⚠ **Verify & clean up:** confirm a public GET is denied, then empty **all versions** and delete the
   bucket so it stops billing.

## Output shape

```
Need: <what you're storing> | Bucket: <unique-name> @ <region>
Access: Block Public Access ON | policy scoped to <prefix>
Encryption: SSE-S3 (default) | Versioning: on
Lifecycle: →IA @30d, →Glacier @90d, expire old versions
Verify: public GET denied | presigned URL works
Cleanup: empty versions → delete bucket  [⚠ stops storage cost]
```

## Tips

- Never make a bucket public to "make it work" — use a scoped policy, presigned URL, or CloudFront instead.
- Versioning without lifecycle silently grows the bill; expire noncurrent versions.
- End with the **Learning Footer** (`AGENTS.md`) — one policy to tighten + one lifecycle rule to add yourself.
