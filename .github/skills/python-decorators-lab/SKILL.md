---
name: python-decorators-lab
description: "Hands-on Python lab on decorators: functions as first-class objects, wrapping a callable, preserving metadata with functools.wraps, decorators that take arguments, and real uses like timing and caching. Use for 'teach me decorators', 'hands-on decorator lab', 'explain @ syntax', 'functools.wraps', 'write a timing or caching decorator', or practicing Python decorators by building them."
argument-hint: "Your Python level or a decorator goal"
---

# Python Decorators Lab

Learn decorators by building them yourself — a guided, hands-on lab following the teaching principles
and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *understand* `@decorator` syntax by writing decorators, not just applying them.
- Reinforcing first-class functions and closures for **Coding Mentor** or a Python role-agent.

## Procedure
**Concept (60s):** a decorator is a callable that takes a function and returns a replacement function;
`@d` above `def f` simply means `f = d(f)` (PEP 318, 2003).

1. **Warm up:** prove functions are objects — pass one as an argument and return one from a closure.
2. **Wrap a call:** write `def log(fn)` returning `wrapper(*args, **kwargs)` that calls and returns `fn`.
3. **Preserve identity:** add `@functools.wraps(fn)` so `__name__`/`__doc__` survive (docs.python.org).
4. **Take arguments:** nest one level deeper — `retry(times)` returns the actual decorator.
5. **Real use:** finish the `timer` below, then swap in `functools.lru_cache` for memoized caching.

**Reference sketch:**
```python
import functools, time

def timer(fn):
    @functools.wraps(fn)                 # keep __name__/__doc__ (docs.python.org)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            return fn(*args, **kwargs)
        finally:
            print(f"{fn.__name__}: {time.perf_counter() - start:.4f}s")
    return wrapper
```
**Pitfalls:** forgetting `wraps` (metadata lost); not returning `fn`'s value; sharing mutable state
across calls; stacking order — `@a` above `@b` applies as `a(b(f))`.

## Output shape
```
Concept: @d means f = d(f)
Steps 1–5: <what you built + why>; final decorator + where @wraps goes
Check: __name__ preserved? *args/**kwargs forwarded? return value passed through?
```

## Tips
- Predict `f.__name__` with and without `@wraps` before running it (Socratic).
- Review your decorator with [`code-review-coach`](../code-review-coach/SKILL.md); drill more via [`practice-generator`](../practice-generator/SKILL.md).
- Stuck on a wrapper? [`debugging-coach`](../debugging-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
