---
name: testcontainers-lab
description: "Hands-on lab on Testcontainers — write integration tests that spin up disposable, local Docker service containers (Postgres, Redis, Kafka) with no subscription, in Java, Python, Go, or Node: start a real dependency, run tests against it, and let it auto-clean. Use for 'Testcontainers lab', 'the integration test', 'real database in tests', 'disposable containers', 'test against Postgres/Kafka', or learning integration testing by doing. Includes a Docker-cleanup safety note."
argument-hint: "The integration test"
---

# Testcontainers Lab

Learn integration testing by *booting a real service in a container from your own test* — free,
local, no subscription — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [ci-pipeline-builder](../ci-pipeline-builder/SKILL.md) and [docker-compose-lab](../docker-compose-lab/SKILL.md).

## When to use

- The learner wants tests to run against a *real* database/broker instead of mocks or a shared server.
- Making integration tests reproducible on a laptop and in CI, with no provisioned infrastructure.

## Mental model

- **Testcontainers** is a test library (Java, Python, Go, Node, .NET…) that starts throwaway **Docker
  containers** for your dependencies, exposes their **mapped host port / connection string**, and
  **auto-removes** them after the test via the Ryuk reaper — so every run starts from a clean state.

## Procedure

1. **Concept & setup:** add the Testcontainers dependency for your language; a Docker runtime must be
   available locally or in CI.
2. **Define the container:** in test setup declare e.g. a `PostgreSQLContainer` (image pinned) with a
   **wait strategy** (port listening / log line) so the test blocks until it is ready.
3. **Start & connect:** start the container, read its `host` / mapped `port` / JDBC URL, and point the
   code-under-test at that dynamic endpoint (Testcontainers docs, *Getting started*, testcontainers.com, 2024).
4. **Run & verify:** exercise real queries/messages and assert behavior end to end.
5. **Clean up:** teardown is automatic (try-with-resources / context manager + Ryuk); ⚠ don't disable
   Ryuk in shared CI or containers may leak.

## Output shape

```
Test: <suite> | Lang: Java|Python|Go|Node | Runtime: local Docker
Container: <PostgreSQLContainer image:pinned> + wait strategy (port/log)
Connect: host + mapped port / connection string (dynamic)
Verify: real queries/messages → assertions pass
Clean: auto (try-with-resources / context mgr + Ryuk reaper)
```

## Tips

- Never hard-code host ports — always read the *mapped* port; fixed ports cause flaky, colliding tests.
- ⚠ Keep the Ryuk reaper enabled so orphaned test containers are cleaned up between runs.
- End with the **Learning Footer** (`AGENTS.md`) — one wait strategy to add + one service to containerize yourself.
