---
name: api-design-review
description: "Review an API design (REST, GraphQL, or gRPC) as a lesson — resource modeling, HTTP semantics and status codes, naming, versioning, pagination, errors, auth, and idempotency — with concrete fixes and the principle behind each. Use for 'review my API', 'is this REST endpoint right', 'API design feedback', 'GraphQL/gRPC schema review', or learning API best practices."
argument-hint: "API spec/endpoints to review (REST/GraphQL/gRPC) + context"
---

# API Design Review

Review an API so the learner internalizes durable interface principles — following the coding
standards and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Every fix teaches the rule behind
it. Complements [code-review-coach](../code-review-coach/SKILL.md).

## When to use

- The learner shares endpoints/schema and wants design feedback that explains the *why*.
- Hardening a public contract before it ships and becomes expensive to change.

## Review checklist (teach the principle behind each)

1. **Resource modeling** — nouns not verbs, right granularity, relationships.
2. **HTTP semantics** — correct methods and status codes; idempotency (PUT/DELETE safe to retry).
3. **Naming & consistency** — plural collections, casing, predictable paths.
4. **Versioning & compatibility** — additive changes, deprecation path.
5. **Pagination / filtering / sorting** — cursor vs. offset trade-offs at scale.
6. **Errors** — structured body (e.g., RFC 9457 Problem Details) with stable codes.
7. **Auth & safety** — authn/authz, scopes, rate limits, input validation at the boundary.

## Procedure

1. Confirm style (REST/GraphQL/gRPC), consumers, and SLAs before judging.
2. Walk the checklist; per finding give **what → why (named principle) → concrete fix** (show the
   corrected request/response).
3. Lead with contract-breaking and security issues; say what's already good.
4. Suggest contract tests and example payloads that lock the behavior in.

## Output shape

```
Summary: <overall + biggest risk>
[Critical] Semantics/Security — finding → why → fix (sample req/resp)
[Major]   Modeling/Versioning — …
[Minor]   Naming/Docs — …
What's good: …
Tests to add: …
Learning Footer
```

## Tips

- Cite the spec (HTTP, RFC 9457, GraphQL/gRPC docs) with dates; never invent semantics.
- REST vs. GraphQL vs. gRPC is a trade-off — match it to callers (see [tech-comparison](../tech-comparison/SKILL.md)).
- End with the **Learning Footer** (`AGENTS.md`).
