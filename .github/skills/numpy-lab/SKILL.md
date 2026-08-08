---
name: numpy-lab
description: "Hands-on lab on NumPy: create ndarrays, use broadcasting to combine different shapes, replace loops with vectorized ops, reduce along axes, and measure the performance win — learning by running real code. Use for 'numpy lab', 'practice numpy', 'broadcasting explained', 'axis=0 vs axis=1', 'vectorize with numpy', 'why is numpy faster', or a guided hands-on array exercise. Teaches by doing."
argument-hint: "The numeric task"
---

# NumPy Lab

A guided, hands-on lab that builds NumPy intuition by writing and timing array code — following the
teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`pandas-lab`](../pandas-lab/SKILL.md) and [`worked-example`](../worked-example/SKILL.md).

## When to use

- The learner wants to *practice* ndarrays, broadcasting, and axes rather than just read the rules.
- Before pandas/ML work, to understand the vectorized engine underneath (Harris et al., *Array
  programming with NumPy*, Nature 585, 2020).

## Procedure

1. **Concept first.** An `ndarray` is a fixed-size, homogeneous (`dtype`) block of memory with a `shape`;
   vectorized ops run compiled C loops, not Python ones — that's the speed.
2. **Create & inspect.** Build arrays with `np.array`, `np.arange`, `np.zeros`; check `.shape`, `.dtype`, `.ndim`.
3. **Exercise — broadcasting.** Add a `(3,1)` and a `(1,4)` array; predict the `(3,4)` result. Rule: align
   shapes on the right; each dim must be equal or one must be 1 (numpy.org User Guide: *Broadcasting*).
4. **Exercise — axes.** On a 2-D array, compute `a.sum(axis=0)` (down rows → per column) vs `axis=1`
   (across columns → per row); say aloud what each collapses.
5. **Exercise — vectorize & time.** Replace a Python loop with `a * b` / `np.dot`; compare with `%timeit`.
6. **Reference solution sketch.** Show the broadcast expression and the reduction that replace the loop.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Task: … | Arrays: shape + dtype
Broadcast: (3,1) + (1,4) → (3,4)   # why the shapes align
Axis: a.sum(axis=0) per column | a.sum(axis=1) per row
Vectorized: (a * b).sum()   # replaces the loop
Timing: loop vs vectorized (µs)
Learning Footer
```

## Tips

- A basic slice is a **view**, not a copy — writing to it mutates the original; use `.copy()` when needed.
- `axis=k` names the axis that disappears in a reduction, not the one you "keep".
- Keep dtypes deliberate: integer arrays truncate; shapes that can't align raise a broadcasting `ValueError`.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
