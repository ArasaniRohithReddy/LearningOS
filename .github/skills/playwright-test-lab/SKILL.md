---
name: playwright-test-lab
description: "Hands-on lab: build reliable end-to-end browser tests locally with Playwright, the free OSS framework. Learn to scaffold a project, generate a first test with codegen, use resilient role/test-id locators, rely on web-first auto-retrying assertions (no sleeps), run headless across Chromium/Firefox/WebKit, and debug failures with the trace viewer. Use for 'Playwright', 'E2E test locally', 'browser test lab', 'trace viewer', or learning reliable E2E testing hands-on."
argument-hint: "The app URL + critical flow"
---

# Playwright Test Lab

A **hands-on lab** to build a reliable end-to-end browser test **locally** with Playwright (free/OSS),
so a critical journey is protected without flakiness, per the teaching approach in [`AGENTS.md`](../../../AGENTS.md).
Frame the smallest, most valuable E2E layer first with [e2e-testing-coach](../e2e-testing-coach/SKILL.md).

## When to use

- The learner wants cross-browser confidence on a key user journey (sign-up → checkout) that stays stable.
- Learning why to wait on *state* not *time*, and how a trace turns a flaky failure into a fixable one.
- Building the first, few, most valuable E2E tests atop cheaper unit/integration coverage — the pyramid's tip.

## Procedure

1. **Scaffold locally.** `npm init playwright@latest` installs `@playwright/test`, the browser binaries, and a
   `playwright.config.ts`; example tests land in `tests/`.
2. **Generate a starting point.** `npx playwright codegen <url>` records your clicks into a script; refine that
   into one real journey (e.g. sign-up → checkout) instead of hand-writing selectors.
3. **Use resilient locators.** Prefer user-facing `getByRole`, `getByLabel`, and `getByTestId` over brittle
   CSS/XPath tied to styling that a refactor will move.
4. **Assert with auto-retry.** Use web-first assertions like `await expect(locator).toBeVisible()`; never `sleep`
   — Playwright retries until the condition holds, so tests wait for the app to be *ready*, not a fixed duration.
5. **Run it.** `npx playwright test` runs headless and in parallel across Chromium, Firefox, and WebKit; use
   `--ui` or `--debug` for an interactive, step-through loop while developing.
6. **Debug from the trace.** Enable `trace: 'on-first-retry'` in config; on failure open `npx playwright
   show-report` / `show-trace` to replay every step, and seed each test's own data so it stays isolated.

## Output shape

```
Scaffold: npm init playwright@latest → tests/
Locators: getByRole / getByTestId  (not CSS/XPath)
Assert: await expect(locator).toBeVisible()   (auto-retry, no sleep)
Run: npx playwright test   (--ui to debug, all browsers)
Report: npx playwright show-report | trace on first retry
```

## Tips

- Reference the playwright.dev "Best Practices" docs (locators, auto-waiting, test isolation); set `trace: 'on-first-retry'`.
- Playwright is free/OSS (Microsoft); test journeys not pages, and keep each test seeding its own data for parallel-safety.
- Pair with `e2e-testing-coach`; end with the **Learning Footer** (`AGENTS.md`) — the resilience habit to keep + one flow to add.
