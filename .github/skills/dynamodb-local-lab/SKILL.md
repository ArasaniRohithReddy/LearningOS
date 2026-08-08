---
name: dynamodb-local-lab
description: "Hands-on AWS lab: practice Amazon DynamoDB locally and fully offline with DynamoDB Local, AWS's free official downloadable database — no AWS account, no subscription, no cloud keys. Run amazon/dynamodb-local with docker compose, then point the AWS CLI/SDK at --endpoint-url http://localhost:8000 to create tables, put/query items, and design keys. Use for 'learn DynamoDB without an account', 'local DynamoDB', 'offline DynamoDB Local lab', 'DynamoDB on localhost:8000', or practicing NoSQL data modeling by doing."
argument-hint: "The DynamoDB task (table design/keys/queries)"
---

# DynamoDB Local Lab

Learn DynamoDB by *running AWS's local database* — `docker compose up`, aim the CLI/SDK at localhost, model
and verify — no account or bill, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [aws-dynamodb-lab](../aws-dynamodb-lab/SKILL.md) and [floci-aws-local-lab](../floci-aws-local-lab/SKILL.md).

## When to use

- The learner wants runnable DynamoDB practice with no AWS account, subscription, or budget.
- Reinforcing hands-on NoSQL key design offline for an **AWS**, **backend**, or **data** role-agent.

## Procedure

1. **Concept:** DynamoDB Local is AWS's **official** downloadable build for *local development and testing* —
   it approximates the DynamoDB API with no cloud endpoint or bill (AWS, *DynamoDB local (downloadable
   version)*, 2026).
2. **Start it:** `docker compose up` runs `amazon/dynamodb-local`, listening on port `8000`.
3. **Point your tools:** add `--endpoint-url http://localhost:8000` to the AWS CLI (or set the endpoint on
   your SDK client) with any region and dummy keys.
4. **Do a small exercise:** create a table with a partition/sort key, then `put-item` and `query` a few
   items to feel single-table design.
5. **Verify:** `aws dynamodb list-tables --endpoint-url http://localhost:8000` shows your table — same API
   shapes as DynamoDB, yet only *approximate*, so cross-check surprises in the AWS docs.
6. ⚠ **Clean up:** `docker compose down` stops the container; with `-inMemory` the data was never written to
   disk, so it simply vanishes — no cost, no stale files.

## Output shape

```
Start:  docker compose up  →  DynamoDB Local on http://localhost:8000
Point:  AWS CLI/SDK  →  --endpoint-url http://localhost:8000
Try:    aws dynamodb create-table … --endpoint-url http://localhost:8000
Verify: aws dynamodb list-tables … → table appears   ·   Clean: docker compose down ⚠
# compose.yaml
services:
  dynamodb-local:
    image: amazon/dynamodb-local:latest
    command: "-jar DynamoDBLocal.jar -inMemory -sharedDb"
    ports: ["8000:8000"]
# env for the AWS CLI/SDK (any dummy values work)
AWS_DEFAULT_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```

## Tips

- DynamoDB Local is free and official but *approximate* — throughput, IAM, stream timing, and some limits differ from the cloud, so validate anything you ship against the AWS DynamoDB docs.
- Pass `-sharedDb` so every client sees one database regardless of credentials/region (omit it and items seem to "disappear"); compare designs with [nosql-data-modeling](../nosql-data-modeling/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — one access pattern to model next + one behavior to verify against real DynamoDB yourself.
