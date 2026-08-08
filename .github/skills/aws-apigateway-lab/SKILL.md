---
name: aws-apigateway-lab
description: "Hands-on AWS lab: build an API Gateway API end to end — choose REST vs HTTP API, define routes and methods, wire a Lambda proxy integration, add an authorizer, and deploy to a stage with throttling and logging. Use for 'AWS API Gateway lab', 'build a REST API', 'HTTP API vs REST API', 'Lambda proxy integration', 'API Gateway stages', 'add an API authorizer', 'API Gateway hands-on lab', or learning API front doors by doing."
argument-hint: "The API"
---

# AWS API Gateway Lab

Learn API Gateway by building an API — route, integrate a Lambda, secure it, then deploy to a stage — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [aws-lambda-lab](../aws-lambda-lab/SKILL.md) and [serverless-designer](../serverless-designer/SKILL.md).

## When to use

- The learner wants a guided, callable HTTPS endpoint in front of a function, not just theory.
- Reinforcing managed routing, auth, and throttling for a **cloud/backend** role-agent.

## Mental model

API Gateway is the managed **front door**: it terminates HTTPS, routes each request to an integration, and
handles auth and throttling. **HTTP APIs** are lower-latency and up to **71% cheaper** than REST APIs; pick
**REST** only for API keys, request validation, or WAF (Amazon API Gateway Developer Guide, *Choosing between REST and HTTP APIs*; HTTP APIs GA 2020).

## Procedure

1. **Pick the flavor:** start with an **HTTP API** for a Lambda backend; choose REST for usage plans, API
   keys, or fine-grained request validation.
2. **Define routes:** add `GET /items` and `POST /items` — method + path pairs that map to integrations.
3. **Wire Lambda proxy:** connect each route with **proxy integration** so the whole request arrives as the
   event and your return becomes the response ([aws-lambda-lab](../aws-lambda-lab/SKILL.md)).
4. **Add auth:** attach a JWT/Cognito or Lambda authorizer — never ship an open write route; grant only
   `lambda:InvokeFunction` on the integration (least privilege).
5. **Deploy to a stage:** publish to `dev`, set **throttling** (rate/burst) and access logging, and use stage
   variables so `prod` differs from `dev` ([aws-cloudwatch-lab](../aws-cloudwatch-lab/SKILL.md)).
6. ⚠ **Verify & clean up:** `curl` the stage URL, confirm the authorizer blocks anonymous calls, then delete
   the API and stages — throttles guard against surprise bills.

## Output shape

```
API: <name> (HTTP|REST) @ region
Routes: GET /items, POST /items → Lambda proxy
Auth: JWT/Cognito|Lambda authorizer (no open writes)
Stage: dev | throttle rate/burst | access logs on
Verify: curl 200 authed / 401 anon
Cleanup: delete stages + API  [⚠ stops endpoint + logs]
```

## Tips

- Practice free and offline first with [floci-aws-local-lab](../floci-aws-local-lab/SKILL.md) — invoke API + Lambda on `localhost:4566`.
- Proxy integration keeps mapping in code; reach for REST mapping templates only when you truly need them.
- End with the **Learning Footer** (`AGENTS.md`) — one route to add + one authorizer to test with a bad token yourself.
