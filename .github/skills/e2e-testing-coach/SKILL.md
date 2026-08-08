---
name: e2e-testing-coach
description: "Design reliable end-to-end UI tests (Playwright/Cypress/Selenium) as a lesson — pick the few critical user journeys, use resilient selectors, wait on state not time, isolate data, and cut flakiness. Use for 'end-to-end tests', 'Playwright', 'Cypress', 'Selenium', 'UI test flaky', 'test the whole flow', 'browser tests', or learning reliable E2E testing."
argument-hint: "The app + critical flows"
---

# E2E Testing Coach

Teach end-to-end tests that give **real cross-system confidence without flakiness** — few, valuable, and
deterministic — per the teaching approach in [`AGENTS.md`](../../../AGENTS.md). E2E is the tip of the pyramid.

## When to use

- The learner wants to protect critical user journeys but E2E suites are slow or flaky.
- Framing the smallest E2E layer atop a [test-plan-designer](../test-plan-designer/SKILL.md) strategy; fixing flakes with [flaky-test-fixer](../flaky-test-fixer/SKILL.md).

## Procedure

1. **Test journeys, not pages.** Pick the few highest-value flows (sign-up → checkout). E2E is the *fewest,
   most valuable* tests — push everything provable lower to unit/integration.
2. **Choose resilient selectors.** Target user-facing roles and stable hooks (`getByRole`, `data-testid`),
   never brittle CSS/XPath tied to styling or DOM structure that refactors will move.
3. **Wait on state, not time.** Never `sleep`. Use web-first, auto-retrying assertions (Playwright/Cypress
   retry until the condition holds) so tests wait for the app to be *ready*, not a fixed duration.
4. **Isolate data & environment.** Each test seeds its own data via API/fixtures, runs independently, and
   controls the network (mock or stub third parties) so runs are deterministic and parallel-safe.
5. **Cut flakiness at the root.** Stabilize the environment; use retries only to *detect* flakiness, not
   hide it; capture trace/video/screenshot on failure; run headless in CI to catch issues early.
6. **Keep it small and fast.** Guard the suite's size — every added E2E test is slow; justify each by the
   real risk it uniquely covers.

## Output shape

```
App + flows: <critical journeys, ranked>
Tool: Playwright | Cypress | Selenium
Selectors: role/test-id (not CSS/XPath)
Waiting: web-first auto-retry (no sleeps)
Data/isolation: API seed + network mocks | parallel-safe
Flake control: trace on fail | retry-to-detect | headless CI
```

## Tips

- Most E2E flakiness is a hidden race — fix the wait, don't raise the timeout ([flaky-test-fixer](../flaky-test-fixer/SKILL.md)).
- Reference: Playwright and Cypress official best-practices docs (locators, auto-waiting, test isolation).
- Pair with `test-plan-designer`; end with the **Learning Footer** (`AGENTS.md`).
