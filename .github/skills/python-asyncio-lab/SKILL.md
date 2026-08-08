---
name: python-asyncio-lab
description: "Hands-on Python lab on asyncio: coroutines with async/await, scheduling tasks, awaiting many with gather, the single-threaded event loop, and choosing async for IO-bound vs processes for CPU-bound work. Use for 'teach me asyncio', 'hands-on async lab', 'async/await explained', 'run tasks concurrently', 'event loop', or practicing Python async by building concurrent IO."
argument-hint: "The async task"
---

# Python Asyncio Lab

Learn asyncio by making slow IO run concurrently — a guided, hands-on lab following the teaching
principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner has IO-bound work (network, disk, DB) and wants concurrency without threads.
- Teaching `async`/`await` and the event loop for **Coding Mentor** or a backend role-agent.

## Procedure
**Concept (60s):** `async def` defines a coroutine; `await` suspends it and hands control to the *event
loop* so other coroutines run — one thread, cooperative multitasking (PEP 492, 2015).

1. **First coroutine:** write `async def` using `await asyncio.sleep(1)`; run it with `asyncio.run(...)`.
2. **Sequential vs concurrent:** time `await a(); await b()` (~2s) against running both together.
3. **Fan out:** launch many with `asyncio.gather(*coros)` and collect results in order.
4. **Schedule eagerly:** start work with `asyncio.create_task(...)`, then `await` the task later.
5. **CPU-bound trap:** a busy `for` loop blocks the loop — offload via `asyncio.to_thread`/a process pool.

**Reference sketch:**
```python
import asyncio

async def fetch(n):
    await asyncio.sleep(1)               # stand-in for real IO (network/disk)
    return n * n

async def main():
    return await asyncio.gather(*(fetch(i) for i in range(5)))

asyncio.run(main())                      # ~1s total, not 5s
```
**Pitfalls:** calling a coroutine without `await` (you get a coroutine object that never runs); blocking
the loop with `time.sleep`/CPU work; nesting `asyncio.run` (call it once, at the top).

## Output shape
```
Concept: await → suspend; loop runs other coroutines meanwhile
Steps 1–5: <what you built + why>; sequential ~Ns vs gather ~1s
Check: IO-bound (async helps) or CPU-bound (use processes)? every coroutine awaited?
```

## Tips
- Async speeds up *waiting*, not computing — match the tool to IO- vs CPU-bound work.
- Diagnose "it never ran" with [`debugging-coach`](../debugging-coach/SKILL.md); practice more via [`practice-generator`](../practice-generator/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
