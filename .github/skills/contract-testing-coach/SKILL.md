---
name: contract-testing-coach
description: "Teach consumer-driven contract testing (e.g., Pact) — why it beats brittle end-to-end for service integration, how a consumer defines a contract, how the provider verifies it, and how to gate it in CI. Use for 'contract testing', 'consumer-driven contracts', 'Pact', 'how do I test microservice integration', 'stop brittle E2E', 'verify provider compatibility', or learning service integration testing."
argument-hint: "The services/consumer-provider + stack"
---

# Contract Testing Coach

Teach how two services can trust their integration **without a full live environment** — the consumer
declares what it needs, the provider proves it still delivers — per [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has services that call each other and integration bugs slip past unit tests.
- Hardening an interface before release, complementing [api-testing-coach](../api-testing-coach/SKILL.md) and thinning [e2e-testing-coach](../e2e-testing-coach/SKILL.md) suites.

## Procedure

1. **Explain the idea.** The *consumer* records the exact requests it makes and responses it expects as a
   **contract**; the *provider* replays that contract to prove it still satisfies every consumer.
2. **Contrast with E2E.** End-to-end needs all services live — slow, flaky, and vague about *who* broke.
   Contract tests run each side in isolation, fast, and pinpoint the offending party.
3. **Write the consumer test.** Run the consumer against a **mock provider** built from expectations;
   passing tests emit a contract (a Pact file). Assert shape and interaction, not a full live response.
4. **Verify on the provider.** Publish the contract (e.g., a Pact Broker) and have the real provider
   replay every interaction, using **provider states** to seed the data each case needs.
5. **Gate in CI.** Run provider verification on every change; use a `can-i-deploy` check and contract
   **versioning** so an incompatible change fails *before* release, not in production.
6. **State the limits.** Contracts check the interface and interactions, not full business correctness —
   keep a thin end-to-end smoke and a [test-plan-designer](../test-plan-designer/SKILL.md) strategy around them.

## Output shape

```
Pair: <consumer> → <provider> | stack/tool: <e.g., Pact>
Contract: GET /orders/{id} → 200 {id, total, status}
Consumer test: runs vs mock → emits contract
Provider verify: replays contract + provider states → pass/fail
CI gate: publish + can-i-deploy | version: <n> | E2E smoke kept: …
```

## Tips

- Consumer-driven: the contract encodes only what a consumer actually uses, so providers can evolve safely.
- Reference: Pact docs (pact.io) and Martin Fowler, *Consumer-Driven Contracts* (2011); version every contract.
- Pair with `api-testing-coach`; end with the **Learning Footer** (`AGENTS.md`).
