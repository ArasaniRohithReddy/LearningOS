---
name: python-typing-lab
description: "Hands-on Python lab on type hints: annotating functions, Optional/Union, generics with TypeVar, structural typing with Protocol, and checking it all with mypy. Use for 'teach me type hints', 'hands-on typing lab', 'annotate this code', 'TypeVar', 'Protocol', 'Optional vs Union', 'run mypy', or practicing Python static typing by typing real code."
argument-hint: "The code to type"
---

# Python Typing Lab

Learn type hints by annotating real code and letting a checker find bugs — a guided, hands-on lab
following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants safer, self-documenting code and to understand annotations, not to guess syntax.
- Adding types before a refactor for **Coding Mentor** or any Python role-agent.

## Procedure
**Concept (60s):** hints annotate names for tools and readers; Python does *not* enforce them at
runtime — a checker like mypy does (PEP 484, 2014).

1. **Annotate a function:** add param and return types, then run `mypy file.py` and read the first error.
2. **Optional/Union:** type a maybe-`None` value as `X | None` (PEP 604, 3.10+) or `Optional[X]`.
3. **Generics:** write `first(items: list[T]) -> T | None` with `T = TypeVar("T")` (PEP 585, 3.9+).
4. **Protocol:** define a structural type (duck typing) and accept anything that matches (PEP 544, 2017).
5. **Check strictly:** run `mypy --strict`, fix findings, and confirm hints don't validate runtime data.

**Reference sketch:**
```python
from typing import Protocol, TypeVar

T = TypeVar("T")

def first(items: list[T]) -> T | None:   # PEP 585 generics + PEP 604 union (3.10+)
    return items[0] if items else None

class Named(Protocol):                   # structural typing (PEP 544)
    name: str
```
**Pitfalls:** expecting runtime enforcement (use `dataclasses`/pydantic to validate data); `X | Y` needs
Python 3.10+; over-broad `Any` silences the checker and hides bugs.

## Output shape
```
Concept: hints guide tools; mypy enforces, runtime does not
Steps 1–5: <what you annotated + why>; strict mypy result
Check: Optional handled? TypeVar preserves the input type? Protocol matches by shape?
```

## Tips
- Type at the boundaries first (public functions, return types); let inference cover the rest.
- Have [`code-review-coach`](../code-review-coach/SKILL.md) check the annotations; practice via [`practice-generator`](../practice-generator/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
