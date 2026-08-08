---
name: python-dataclasses-lab
description: "Hands-on Python lab on dataclasses: declaring fields, safe mutable defaults with field(default_factory), frozen immutable instances, __post_init__ validation, generated comparison/ordering, and when to pick namedtuple or pydantic instead. Use for 'teach me dataclasses', 'hands-on dataclass lab', '@dataclass', 'frozen dataclass', 'default_factory', or modeling data in Python by building one."
argument-hint: "The model/data"
---

# Python Dataclasses Lab

Learn dataclasses by modeling real data with less boilerplate — a guided, hands-on lab following the
teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner needs a small typed data holder and wants generated `__init__`/`__repr__`/`__eq__`.
- Modeling domain objects for **Coding Mentor** or a backend/data role-agent.

## Procedure
**Concept (60s):** `@dataclass` reads your typed fields and generates `__init__`, `__repr__`, and `__eq__`
for you (PEP 557, added in Python 3.7).

1. **Declare fields:** add a `@dataclass` with typed attributes and defaults; get the dunder methods free.
2. **Mutable default:** use `field(default_factory=list)` — never `= []` (one list shared by all instances).
3. **Validate:** add `__post_init__` to check or normalize fields and raise on bad data.
4. **Freeze it:** `@dataclass(frozen=True)` makes instances immutable and hashable (usable as dict keys).
5. **Order it:** `@dataclass(order=True)` generates `<`/`>` from the field tuple; sort a list of instances.

**Reference sketch:**
```python
from dataclasses import dataclass, field

@dataclass(order=True)
class Player:
    name: str
    score: int = 0
    items: list[str] = field(default_factory=list)   # not = [] (shared!)

    def __post_init__(self):
        if self.score < 0:
            raise ValueError("score must be >= 0")
```
**Pitfalls:** `= []` as a default (shared mutable bug); `frozen=True` blocks assignment even in
`__post_init__` (use `object.__setattr__`); dataclasses don't check types — pydantic does.

## Output shape
```
Concept: @dataclass generates __init__/__repr__/__eq__ from fields
Steps 1–5: <what you modeled + why>; namedtuple (immutable tuple) vs dataclass vs pydantic (validates)
Check: mutable default via factory? frozen hashable? order sorts correctly?
```

## Tips
- Prefer a frozen dataclass for value objects; a mutable one for records you update in place.
- Trace `__post_init__` with [`worked-example`](../worked-example/SKILL.md); review the model with [`code-review-coach`](../code-review-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
