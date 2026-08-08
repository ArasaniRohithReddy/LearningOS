---
name: python-multiprocessing-lab
description: "Hands-on Python lab on multiprocessing: Process and Pool, map/apply, sharing data with Queue/Pipe/Value/Array, and why the GIL means processes (not threads) give real CPU-bound parallelism. Use for 'teach me multiprocessing', 'hands-on multiprocessing lab', 'Process vs Pool', 'the GIL explained', 'parallelize CPU work', or speeding up CPU-bound Python."
argument-hint: "The parallel task"
---

# Python Multiprocessing Lab

Learn multiprocessing by beating the GIL on CPU work — a guided, hands-on lab following the teaching
principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner has CPU-bound work that threads fail to speed up.
- Teaching parallelism and the GIL for **Coding Mentor** or a Python role-agent.

## Procedure
**Concept (60s):** the GIL lets one thread run Python bytecode at a time, so CPU work doesn't scale with
threads; separate **processes** each own a GIL and run truly in parallel (docs.python.org).

1. **One process:** build `Process(target=fn, args=(…))`, then `start()` and `join()`.
2. **Pool of workers:** `with Pool() as p: p.map(fn, items)` spreads work across CPU cores.
3. **Get results:** `Pool.map` returns them in order; a bare `Process` can't — use a `Queue`.
4. **Share data:** prefer message passing (`Queue`/`Pipe`) over shared `Value`/`Array` state.
5. **Prove it:** time a CPU-bound function with threads (no gain) versus a `Pool` (scales with cores).

**Reference sketch:**
```python
from multiprocessing import Pool

def work(n):                             # CPU-bound: real work per item
    return sum(i * i for i in range(n))

if __name__ == "__main__":               # required: spawn re-imports this file
    with Pool() as pool:                 # one worker per CPU core
        print(pool.map(work, [100_000] * 8))
```
**Pitfalls:** no `if __name__ == "__main__":` guard (spawn relaunches processes recursively); passing
lambdas/closures (unpicklable); expecting thread-style shared memory; IPC overhead dwarfing tiny tasks.

## Output shape
```
Concept: GIL serializes threads; processes each own a GIL → real CPU parallelism
Steps 1–5: <what you parallelized + why>; threads vs Pool timing
Check: __main__ guard? CPU-bound (processes) or IO-bound (async/threads)?
```

## Tips
- Match the tool: processes for CPU-bound, async/threads for IO-bound waiting.
- Compare trade-offs with [`concurrency-coach`](../concurrency-coach/SKILL.md); contrast IO work in [`python-asyncio-lab`](../python-asyncio-lab/SKILL.md).
- Hung or deadlocked? [`debugging-coach`](../debugging-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
