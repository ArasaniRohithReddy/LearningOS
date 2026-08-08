---
name: test-data-builder
description: "Design maintainable test data as a lesson — prefer builders/factories over inline literals, choose minimal vs realistic data, and keep tests isolated so order never matters. Use for 'test data', 'test fixtures', 'object mother', 'builder pattern for tests', 'factory (FactoryBot/factory_boy/Faker)', 'setup data for tests', or learning to keep test data maintainable."
argument-hint: "The system under test + framework"
---

# Test Data Builder

Make test data that **reveals intent and resists change** — so a test reads as its own spec and never
breaks because an unrelated field moved — per the teaching approach in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- Tests are cluttered with sprawling literal objects, or share fixtures that leak state between them.
- Setting up data for [test-writer](../test-writer/SKILL.md) tests or fixing order-dependence with [flaky-test-fixer](../flaky-test-fixer/SKILL.md).

## Procedure

1. **Prefer builders/factories over literals.** A builder returns a *valid default* object; each test
   overrides only the one field under test. The override names exactly what the test is about.
2. **Minimal by default, realistic when it matters.** Use the smallest valid object so noise stays low;
   switch to realistic values (formats, i18n, boundaries) only where the behavior actually depends on them.
3. **Isolate every test.** Each test builds its own data — no shared mutable fixtures — with unique keys
   and per-test cleanup/rollback, so tests pass in any order and in parallel.
4. **Pick the pattern.** *Object Mother* for a few canonical cases, *Builder* for many variations, and
   *factories* (FactoryBot, factory_boy, Faker, Bogus) for volume. Keep them in test support, not production.
5. **Cover edges and invalid data.** Add builder variants for boundary and invalid inputs to drive
   error-path and validation tests, not just the happy object.
6. **Keep data next to the test.** Prefer local, explicit setup over distant "magic" fixtures a reader
   must hunt down; the test should explain itself.

## Output shape

```
System/framework: <SUT + test framework>
Default builder: aValidUser() → override only { the field under test }
Minimal vs realistic: <which fields must be realistic and why>
Isolation: per-test build + cleanup | unique keys | parallel-safe
Patterns: ObjectMother | Builder | factory (<tool>) | invalid-data variants
```

## Tips

- A test polluted with irrelevant data hides its own point — make the meaningful field the only visible one.
- Reference: Meszaros, *xUnit Test Patterns* (2007) — Object Mother, Test Data Builder, Fresh Fixture.
- Pair with `test-writer`; end with the **Learning Footer** (`AGENTS.md`).
