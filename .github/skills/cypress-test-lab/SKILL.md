---
name: cypress-test-lab
description: "Hands-on lab: write end-to-end tests locally with Cypress (free/OSS app) and drive them from its interactive test runner. Learn to install, open the runner, author specs with cy.visit/get/contains, select with stable data-cy hooks, lean on built-in retry-ability instead of fixed waits, stub the network with cy.intercept, and run headless in CI. Use for 'Cypress', 'E2E test locally', 'test runner', 'cy.intercept', or learning Cypress E2E testing hands-on."
argument-hint: "The app URL + critical flow"
---

# Cypress Test Lab

A **hands-on lab** to write end-to-end tests **locally** with Cypress (free/OSS) and watch them run in the
interactive test runner, per the teaching approach in [`AGENTS.md`](../../../AGENTS.md).
Frame the smallest, highest-value E2E layer first with [e2e-testing-coach](../e2e-testing-coach/SKILL.md).

## When to use

- The learner wants a fast feedback loop with a visual runner and time-travel snapshots on a key journey.
- Learning to trust retry-ability over `cy.wait(ms)` and to isolate tests by stubbing the network.
- Building the few, highest-value E2E journeys atop cheaper unit/integration tests — not testing every page.

## Procedure

1. **Set up locally.** With Node.js, `npm install cypress --save-dev`, then `npx cypress open` and choose **E2E**
   to launch the interactive test runner in a real browser.
2. **Author a spec.** Create `cypress/e2e/checkout.cy.js` and drive the app with `cy.visit()`, `cy.get()`,
   `cy.contains()`, `.click()`, and `.type()` to script one real user journey.
3. **Select resiliently.** Target stable `data-cy` attributes rather than CSS tied to styling; chain assertions
   like `.should('be.visible')` so Cypress keeps retrying until the element matches.
4. **Let it retry, don't sleep.** Rely on built-in retry-ability and automatic waiting; wait on a route alias
   from `cy.intercept()` (`cy.wait('@getCart')`), never a fixed `cy.wait(2000)` on the clock.
5. **Watch it run.** Use the runner's time-travel snapshots to hover back over each command and inspect the DOM
   at that moment; seed state fast via `cy.request()` instead of clicking through setup UI.
6. **Run headless in CI.** `npx cypress run` executes every spec headless with video/screenshots on failure;
   keep each spec independent and deterministic so they can run in any order.

## Output shape

```
Install: npm i -D cypress → npx cypress open (E2E)
Spec: cypress/e2e/checkout.cy.js
Selectors: [data-cy=submit]   (not brittle CSS)
Wait: retry-ability + cy.intercept alias   (no cy.wait(ms))
Run: npx cypress run (headless CI) | runner = time-travel debug
```

## Tips

- Reference the docs.cypress.io "Best Practices" (selecting elements, network requests, avoid arbitrary waits).
- The Cypress app is free/OSS; add `data-cy` hooks in the app and stub third parties with `cy.intercept` for deterministic runs.
- Pair with `e2e-testing-coach`; end with the **Learning Footer** (`AGENTS.md`) — the isolation habit to keep + one flow to add.
