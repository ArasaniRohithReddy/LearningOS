---
name: localstack-lab
description: "Hands-on AWS lab: practice AWS locally and fully offline with LocalStack, the free open-source AWS emulator — no cloud account, no subscription, no real credentials. Spin up localstack/localstack with docker compose, point the AWS CLI/SDK/Terraform at http://localhost:4566, then run S3, DynamoDB, SQS, SNS, and Lambda exercises. Use for 'learn AWS without an account', 'local AWS emulator', 'offline AWS lab', 'LocalStack tutorial', 'AWS CLI localhost:4566', or practicing AWS by doing."
argument-hint: "The AWS service to emulate (S3/DynamoDB/SQS/SNS/Lambda/…)"
---

# LocalStack AWS Lab

Learn AWS by *running a local emulator* — `docker compose up`, aim your CLI/SDK at one endpoint, build and
verify — with no account or bill, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [floci-aws-local-lab](../floci-aws-local-lab/SKILL.md) and [aws-s3-lab](../aws-s3-lab/SKILL.md).

## When to use

- The learner wants runnable AWS practice with no account, subscription, or budget.
- Reinforcing hands-on cloud skills offline for an **AWS** or **cloud/DevOps** role-agent.

## Procedure

1. **Concept:** LocalStack is a local AWS *emulator* in one container; the free **Community** edition covers
   core services — S3, DynamoDB, SQS, SNS, Lambda — while advanced services/features are paid **Pro**
   (github.com/localstack/localstack, 2026).
2. **Start it:** `docker compose up` boots `localstack/localstack`, exposing every service on the single
   edge endpoint `http://localhost:4566`.
3. **Point your tools:** set `AWS_ENDPOINT_URL=http://localhost:4566` (or `--endpoint-url`) with any region
   and dummy keys — one setting serves the AWS CLI, SDKs, and Terraform.
4. **Do a small exercise:** `aws --endpoint-url=http://localhost:4566 s3 mb s3://demo`, then create an SQS
   queue and a DynamoDB table.
5. **Verify:** `aws --endpoint-url=http://localhost:4566 s3 ls` lists the bucket — identical CLI shapes to
   AWS, yet only *approximate*, so cross-check surprises in the AWS docs.
6. ⚠ **Clean up:** `docker compose down -v` stops the container and drops local state; nothing bills, but
   stale state causes confusing reruns.

## Output shape

```
Start:  docker compose up  →  edge endpoint http://localhost:4566
Point:  AWS CLI/SDK/Terraform  →  AWS_ENDPOINT_URL / --endpoint-url
Try:    aws --endpoint-url=http://localhost:4566 s3 mb s3://demo
Verify: aws … s3 ls → bucket appears   ·   Clean: docker compose down -v ⚠
# compose.yaml
services:
  localstack:
    image: localstack/localstack:latest   # free Community edition
    ports: ["4566:4566"]
# env for the AWS CLI/SDK (any dummy values work)
AWS_ENDPOINT_URL=http://localhost:4566
AWS_DEFAULT_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```

## Tips

- Community ≠ full AWS: it *emulates* core services and fidelity is approximate — validate anything you ship against the official AWS docs, and never assume Pro-only services are free.
- Reuse the endpoint across [aws-dynamodb-lab](../aws-dynamodb-lab/SKILL.md), [aws-sqs-lab](../aws-sqs-lab/SKILL.md), [aws-sns-lab](../aws-sns-lab/SKILL.md), and [aws-lambda-lab](../aws-lambda-lab/SKILL.md); compare with [floci-aws-local-lab](../floci-aws-local-lab/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one AWS service to emulate next + one behavior to verify against real AWS yourself.
