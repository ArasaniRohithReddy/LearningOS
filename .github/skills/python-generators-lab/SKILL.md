---
name: python-generators-lab
description: "Hands-on Python lab on generators and iterators: the yield keyword, lazy evaluation, the iterator protocol, generator expressions, chaining generators into pipelines, and the memory wins over lists. Use for 'teach me generators', 'hands-on generators lab', 'yield explained', 'lazy evaluation', 'process a big file or stream', or practicing Python generators by building a pipeline."
argument-hint: "The data/stream problem"
---

# Python Generators Lab

Learn generators by streaming real data through them — a guided, hands-on lab following the teaching
principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants lazy, memory-cheap iteration and to understand `yield`, not to list everything.
- Processing large files or streams for **Coding Mentor** or a data role-agent.

## Procedure
**Concept (60s):** a function containing `yield` returns a *generator* — it produces values one at a
time and pauses in between, so work is lazy (PEP 255, 2001; expressions PEP 289, 2002).

1. **Feel the difference:** write `squares_list(n)` (builds a list) vs `squares_gen(n)` (yields); compare
   with `sys.getsizeof` and note *when* work happens.
2. **Drive it by hand:** call `next()` on a generator, watch it resume, and catch `StopIteration`.
3. **Generator expression:** rewrite `[x*x for x in it]` as `(x*x for x in it)` — lazy, not materialized.
4. **Build a pipeline:** chain `source → filter → transform`; nothing runs until you pull the end.
5. **Measure the win:** confirm memory stays flat as input grows (O(1) rows in flight).

**Reference sketch:**
```python
def read_lines(path):
    with open(path, encoding="utf-8") as f:
        for line in f:                   # file iteration is already lazy
            yield line.rstrip("\n")

errors = (ln for ln in read_lines("app.log") if "ERROR" in ln)
first = next(errors)                     # nothing is read until you pull
```
**Pitfalls:** a generator is one-shot (exhausted after one pass); no `len()`/indexing; dumping it into a
`list()` throws away the memory win.

## Output shape
```
Concept: yield → lazy, paused, one value at a time
Steps 1–5: <what you built + why>; pipeline = source → filter → transform (all lazy)
Check: memory flat as n grows? re-iterating yields nothing (exhausted)?
```

## Tips
- Reach for generators (or `itertools`) whenever data won't fit in memory or you need a stream.
- Trace one pull end-to-end with [`worked-example`](../worked-example/SKILL.md); drill via [`practice-generator`](../practice-generator/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
