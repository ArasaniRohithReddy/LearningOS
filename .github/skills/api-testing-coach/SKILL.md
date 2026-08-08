---
name: api-testing-coach
description: "Test an API as a lesson — design happy-path, edge, and error cases; assert status codes, headers, and response schema; cover auth and idempotency; add contract tests; and automate it all in CI. Use for 'how do I test this API', 'write API tests', 'contract testing', 'test error cases', 'assert the JSON schema', or learning API testing."
argument-hint: "The API/endpoints"
---

# API Testing Coach

Turn an API into a test suite that teaches — cover behavior, not just the happy path — per the
teaching approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Design first with
[api-design-review](../api-design-review/SKILL.md); automate with [ci-pipeline-builder](../ci-pipeline-builder/SKILL.md).

## When to use

- The learner has endpoints and wants a principled test plan, not ad-hoc clicks in a REST client.
- Hardening a contract before release, or catching regressions consumers would feel.

## What to cover (teach why each matters)

- **Happy path**: valid request → expected status + body. **Edge**: empty, max, boundary, pagination.
- **Errors**: bad input → `400`, unauthenticated → `401`, forbidden → `403`, missing → `404`; assert
  the error body shape. **Auth**: token present/expired/scoped. **Idempotency**: a retried `PUT`/`DELETE`
  is safe. **Contract**: response matches the schema so consumers don't break silently.

## Procedure

1. **Confirm the contract**: endpoints, auth, and the OpenAPI/schema if one exists.
2. **Enumerate cases** per endpoint: happy, edge, error, auth — one assertion intent each.
3. **Assert precisely**: status code, key headers, and **schema-validate** the JSON body (not one field).
4. **Add contract tests** (consumer-driven, e.g., Pact) so provider changes fail fast.
5. **Automate in CI**: seed/teardown data, run on every PR, keep tests independent and deterministic.

## Output shape

```
API: <endpoints + auth>
Cases:
  GET /orders/{id}  200 → schema ok | 404 unknown id | 401 no token
  POST /orders      201 + Location | 400 invalid body
Contract: <provider/consumer, tool>
CI: run on PR, isolated data, <framework>
```

## Tips

- Assert against the spec (OpenAPI 3.1; HTTP semantics RFC 9110, 2022); validate schema, don't eyeball JSON.
- Keep tests independent and idempotent; test error and auth paths, not just 200s. Pair with [test-plan-designer](../test-plan-designer/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — the coverage habit to keep + one endpoint to test yourself.
