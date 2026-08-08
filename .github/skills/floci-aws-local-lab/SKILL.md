---
name: floci-aws-local-lab
description: "Hands-on AWS lab: practice AWS locally and fully offline with the free, open-source Floci emulator — no cloud account, no subscription, no real credentials. Spin up floci/floci with docker compose, point the AWS CLI/SDK/Terraform/CDK at http://localhost:4566, then run S3, DynamoDB, and Lambda exercises. Use for 'learn AWS without an account', 'local AWS emulator', 'offline AWS lab', 'AWS CLI localhost:4566', 'Floci AWS', or practicing AWS by doing."
argument-hint: "The AWS service to practice (S3/DynamoDB/Lambda/…)"
---

# Floci AWS Local Lab

Learn AWS by *running it on your laptop* — spin up an emulator, point your CLI at it, build and verify —
no account or bill, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [aws-s3-lab](../aws-s3-lab/SKILL.md) and [terraform-module-coach](../terraform-module-coach/SKILL.md).

## When to use

- The learner wants runnable AWS practice with no account, subscription, or budget.
- Reinforcing hands-on cloud skills offline for an **AWS** or **cloud/DevOps** role-agent.

## Procedure

1. **Concept:** Floci is a free, MIT-licensed *local* AWS emulator — "no account, no auth token, just
   `docker compose up`" — for **learning/dev/testing, not production** (github.com/floci-io/floci, 2026).
2. **Start it:** `docker compose up` boots `floci/floci` on the single endpoint
   `http://localhost:4566` (use `floci/floci`, not the deprecated `hectorvent/floci`).
3. **Point your tools:** set `AWS_ENDPOINT_URL=http://localhost:4566` with any region and any
   non-empty keys — one env for the AWS CLI, SDKs, Terraform, CDK, and OpenTofu.
4. **Do a small exercise:** `aws s3 mb s3://my-bucket`, then `aws dynamodb create-table …`; Floci
   runs Docker-backed Lambda, ECS, RDS and more ([aws-lambda-lab](../aws-lambda-lab/SKILL.md)).
5. **Verify:** `aws s3 ls` lists the bucket and `aws dynamodb list-tables` the table — same CLI
   shapes as AWS, yet only *approximate*, so cross-check anything surprising in the AWS docs.
6. ⚠ **Clean up:** `docker compose down -v` stops Floci and the containers it spawned; nothing
   costs money, but stale local state causes confusing reruns.

## Output shape

```
Start:  docker compose up  →  single endpoint http://localhost:4566
Point:  AWS CLI/SDK/Terraform/CDK/OpenTofu  →  AWS_ENDPOINT_URL
Try:    aws s3 mb s3://my-bucket ; aws dynamodb create-table …
Verify: aws s3 ls → bucket appears   ·   Clean: docker compose down -v ⚠
# compose.yaml
services:
  floci:
    image: floci/floci:latest        # not the deprecated hectorvent/floci
    ports: ["4566:4566"]
# env for the AWS CLI/SDK (any dummy values work)
AWS_ENDPOINT_URL=http://localhost:4566
AWS_DEFAULT_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```

## Tips

- Floci's fidelity is *approximate* and not production — validate anything you'll ship against the official AWS docs (floci.io/floci).
- Reuse the endpoint across [aws-lambda-lab](../aws-lambda-lab/SKILL.md), [aws-iam-lab](../aws-iam-lab/SKILL.md), aws-vpc-lab, aws-dynamodb-lab, and aws-ecs-lab; an optional unified CLI ships at floci-io/floci-cli (`floci start && eval $(floci env)`).
- **Let Drona drive it:** with `AWS_ENDPOINT_URL` exported, Drona can run the AWS CLI against local floci — floci is "AI-ready" via **env vars, not an MCP server** (none exists). See [`docs/Floci.md`](../../../docs/Floci.md) for all four clouds, incl. [floci-oracle-local-lab](../floci-oracle-local-lab/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one AWS service to emulate next + one behavior to verify against real AWS yourself.
