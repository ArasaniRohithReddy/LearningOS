---
name: csharp-async-await-lab
description: "Hands-on C# lab on async/await: returning Task/Task<T>, awaiting without blocking, ConfigureAwait(false), cooperative cancellation with CancellationToken, and avoiding the sync-over-async deadlock. Use for 'teach me async await', 'hands-on async lab', 'ConfigureAwait explained', 'CancellationToken', 'why does .Result deadlock', or practicing C# asynchronous code by building it."
argument-hint: "The async op"
---

# C# Async/Await Lab

Learn async/await by making blocking IO run without freezing a thread — a guided, hands-on lab following
the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner has IO-bound work (HTTP, files, DB) and wants responsiveness without manual threads.
- Teaching `Task`, cancellation, and sync-over-async traps for **Coding Mentor** or a backend role-agent.

## Procedure
**Concept (60s):** `async` marks a method that can `await`; `await` suspends until the `Task` completes and
resumes where it left off — the thread is freed meanwhile (learn.microsoft.com, "async/await", C# 5.0, 2012).

1. **First await:** write `async Task<int>` that `await`s `Task.Delay(1000)`, then returns a value.
2. **Run concurrently:** start two tasks, then `await Task.WhenAll(t1, t2)` instead of awaiting in turn.
3. **Cancel:** thread a `CancellationToken` to `Task.Delay`; cancel it and catch `OperationCanceledException`.
4. **Library manners:** add `ConfigureAwait(false)` where you don't need the original context back.
5. **Break it:** call `.Result` from a UI or classic ASP.NET context and watch sync-over-async deadlock.

**Reference sketch:**
```csharp
async Task<string> FetchAsync(CancellationToken ct)
{
    await Task.Delay(1000, ct).ConfigureAwait(false);  // suspend; free the thread
    return "done";
}

// await FetchAsync(cts.Token);   // never .Result / .Wait() → sync-over-async deadlock
```
**Pitfalls:** `async void` (except event handlers — exceptions are unobservable); blocking with `.Result`/`.Wait()`;
forgetting to pass the token; assuming `await` starts work — the `Task` is already running when you await it.

## Output shape
```
Concept: await suspends until the Task is done; the thread is freed meanwhile
Steps 1–5: <what you built + why>; sequential awaits vs WhenAll
Check: token passed + honored? .Result/.Wait avoided? async Task not async void?
```

## Tips
- `await` the `Task`; never block on it with `.Result`/`.Wait()` in application code.
- Reason about interleaving with [`concurrency-coach`](../concurrency-coach/SKILL.md); debug hangs via [`debugging-coach`](../debugging-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
