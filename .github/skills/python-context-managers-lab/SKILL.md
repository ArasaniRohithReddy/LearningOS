---
name: python-context-managers-lab
description: "Hands-on Python lab on context managers: the with statement, writing __enter__/__exit__, building one from a generator with contextlib.contextmanager, composing with ExitStack/suppress, and guaranteeing resource cleanup even on errors. Use for 'teach me context managers', 'hands-on with-statement lab', '__enter__/__exit__', 'contextlib', 'safe cleanup', or managing resources in Python by building one."
argument-hint: "The resource/cleanup need"
---

# Python Context Managers Lab

Learn context managers by guaranteeing cleanup around real resources — a guided, hands-on lab following
the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner opens something that must be closed/released (file, lock, socket, DB connection).
- Teaching `with` and safe resource handling for **Coding Mentor** or a backend role-agent.

## Procedure
**Concept (60s):** `with` runs `__enter__` on entry and `__exit__` on exit — even if the block raises —
so setup is always paired with teardown (PEP 343, 2005).

1. **See it work:** use `with open(...) as f:` and confirm the file closes even when the body raises.
2. **Class-based:** write a class with `__enter__` (returns the resource) and `__exit__(exc_type, exc, tb)`.
3. **Generator-based:** build one with `@contextlib.contextmanager` using `try: yield ... finally: cleanup`.
4. **Compose:** stack managers with `contextlib.ExitStack`; ignore expected errors via `contextlib.suppress`.
5. **Handle errors:** returning `True` from `__exit__` swallows the exception — usually let it propagate.

**Reference sketch:**
```python
import time
from contextlib import contextmanager

@contextmanager
def timer(label):
    start = time.perf_counter()
    try:
        yield                            # the with-block body runs here
    finally:
        print(f"{label}: {time.perf_counter() - start:.4f}s")
```
**Pitfalls:** cleaning up after `yield` without `try/finally` (skipped on error); accidentally returning a
truthy value from `__exit__` (silently swallows bugs); acquiring a resource without `with` (it leaks).

## Output shape
```
Concept: with → __enter__ then guaranteed __exit__ (even on exception)
Steps 1–5: <what you managed + why>; class-based vs @contextmanager
Check: cleanup runs on the error path? __exit__ doesn't hide exceptions?
```

## Tips
- Put cleanup in `finally` (or after `yield`) so it runs on every path — that's the whole point.
- Debug a leak or swallowed error with [`debugging-coach`](../debugging-coach/SKILL.md); drill via [`practice-generator`](../practice-generator/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
