---
name: pact-contract-lab
description: "Hands-on lab: run consumer-driven contract tests locally with Pact (free/OSS) and a local Pact Broker. Learn to write a consumer test against a Pact mock server to generate a pact file, verify the provider against that contract, stand up a local OSS broker to publish/version contracts, and gate deploys with can-i-deploy. Use for 'Pact', 'consumer-driven contracts', 'contract test lab', 'local Pact Broker', or learning contract testing hands-on."
argument-hint: "The consumer → provider pair"
---

# Pact Contract Lab

A **hands-on lab** to run consumer-driven contract tests **locally** with Pact (free/OSS) plus a local
Pact Broker, so provider changes fail fast, per the teaching approach in [`AGENTS.md`](../../../AGENTS.md).
Design the contract intent first with [contract-testing-coach](../contract-testing-coach/SKILL.md) and [api-testing-coach](../api-testing-coach/SKILL.md).

## When to use

- The learner has a consumer↔provider pair and wants confidence that a provider change won't break consumers.
- Learning why a contract test (agreed interactions) differs from a full end-to-end or functional API test.
- Wanting fast, isolated tests that catch integration breaks without spinning up both services together.

## Procedure

1. **Set up locally.** Add a Pact library for your stack (`pact-js`, `pact-python`, `pact-jvm`, …) via its
   package manager, and decide which side is the consumer and which is the provider.
2. **Write the consumer test.** Define expected request/response **interactions** against a Pact **mock server**; run it
   to generate a **pact file** (JSON) under `pacts/` — the contract.
3. **Verify the provider.** Run provider verification against that pact file, using **provider states** to seed data;
   no broker is needed to start — a filesystem pact works.
4. **Add a local broker.** Run the OSS Pact Broker locally (e.g. `docker compose up` with the broker + a database);
   the consumer **publishes** the pact and the provider **fetches** it by version/tag.
5. **Gate the deploy.** Run `pact-broker can-i-deploy --pacticipant … --to-environment …` against the local
   broker so a release is blocked unless every consumer's contract is verified.
6. **Iterate.** Change consumer expectations → regenerate the pact → re-verify the provider; keep provider
   states in sync so verification stays honest as the contract evolves.

## Output shape

```
Pair: <consumer> → <provider>
Consumer test → pacts/<consumer>-<provider>.json   (Pact mock server)
Provider verify: run against pact file (or broker URL) + provider states
Local broker: docker compose up (pact-broker + db) → publish / fetch by tag
Gate: pact-broker can-i-deploy --pacticipant … → deploy ✓/✗
```

## Tips

- Reference docs.pact.io (consumer/provider workflow, Pact Broker, `can-i-deploy`); a contract is not a full API test.
- Pact is free/OSS; start broker-less with a filesystem pact, then add the local OSS broker to version and verify contracts.
- Pair with `contract-testing-coach` & `api-testing-coach`; end with the **Learning Footer** (`AGENTS.md`) — one interaction to add yourself.
