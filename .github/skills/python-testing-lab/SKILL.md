---
name: python-testing-lab
description: "Hands-on Python lab on testing with pytest: test_* functions, plain assert, fixtures for setup, @pytest.mark.parametrize for data-driven cases, and pytest.raises for expected errors. Use for 'teach me pytest', 'hands-on testing lab', 'write unit tests', 'fixtures explained', 'parametrize tests', or practicing Python testing by writing tests."
argument-hint: "The code to test"
---

# Python Testing Lab

Learn testing by writing tests for real code — a guided, hands-on lab following the teaching
principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *verify* behavior with pytest instead of eyeballing code.
- Building a testing habit for **Coding Mentor** or any Python role-agent.

## Procedure
**Concept (60s):** a test is a `test_*` function using a bare `assert`; pytest auto-discovers it and
rewrites the assert to print a rich failure diff (docs.pytest.org).

1. **First test:** write `def test_add(): assert add(2, 3) == 5`; run `pytest -q`.
2. **Arrange with a fixture:** an `@pytest.fixture` returns setup data; request it by its parameter name.
3. **Parametrize:** `@pytest.mark.parametrize("a,b,expected", [...])` runs one test over many cases.
4. **Assert errors:** wrap a failing call in `with pytest.raises(ValueError):`.
5. **Select & isolate:** use the `tmp_path` fixture; run `-k name` to filter and `-x` to stop on first fail.

**Reference sketch:**
```python
import pytest
from calc import add                      # code under test

@pytest.fixture
def base():                              # fresh setup per test
    return 100

@pytest.mark.parametrize("amount,expected", [(10, 110), (0, 100)])
def test_add(base, amount, expected):
    assert add(base, amount) == expected
```
**Pitfalls:** files/functions not named `test_*` aren't collected; comparing floats with `==` (use
`pytest.approx`); over-broad fixture scope leaking state; testing many behaviors in one function.

## Output shape
```
Concept: test_* + bare assert; fixtures arrange, parametrize multiplies cases
Steps 1–5: <what you tested + why>; passing vs failing output read
Check: named test_*? one behavior per test? edge cases parametrized?
```

## Tips
- Name each test for the behavior; aim for one reason to fail per test.
- Generate cases with [`test-writer`](../test-writer/SKILL.md); go test-first via [`tdd-coach`](../tdd-coach/SKILL.md).
- Stuck on a red test? [`debugging-coach`](../debugging-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
