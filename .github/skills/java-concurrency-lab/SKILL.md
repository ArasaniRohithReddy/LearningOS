---
name: java-concurrency-lab
description: "Hands-on Java lab on concurrency: start threads with Runnable, submit work to an ExecutorService thread pool, protect shared state with synchronization and happens-before visibility, and compose async work with CompletableFuture. Use for 'teach me Java concurrency', 'hands-on concurrency lab', 'ExecutorService vs new Thread', 'synchronized and visibility', 'CompletableFuture thenApply/thenCompose', or practicing java.util.concurrent safely."
argument-hint: "The concurrent task"
---

# Java Concurrency Lab

Learn concurrency by running tasks yourself — a guided, hands-on lab following the teaching principles
and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *understand* threads, pools, synchronization, and async composition by writing them.
- Reinforcing safe shared state and the memory model for **Coding Mentor** or a Java role-agent.

## Procedure
**Concept (60s):** don't hand-manage threads — submit tasks to an `ExecutorService` and compose results.
Shared mutable state needs a *happens-before* edge (locks, `volatile`) to be visible (JLS §17.4, Java 8+).

1. **One task:** run a `Runnable` on a thread; observe you can't get a return value back.
2. **Pool it:** submit `Callable`s to `Executors.newFixedThreadPool`; collect `Future` results.
3. **Race it:** increment a shared `int` from many tasks; see lost updates without synchronization.
4. **Fix visibility:** switch to `AtomicInteger` or a `synchronized` block; re-run and confirm the count.
5. **Compose async:** chain `CompletableFuture.supplyAsync(...).thenApply(...)` instead of blocking on `get()`.

**Reference sketch:**
```java
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

try (ExecutorService pool = Executors.newFixedThreadPool(4)) {   // AutoCloseable since Java 19
    AtomicInteger count = new AtomicInteger();
    var f = CompletableFuture.supplyAsync(() -> 21, pool).thenApply(n -> n * 2);  // no blocking
    pool.execute(count::incrementAndGet);                        // fire-and-forget task
    System.out.println(f.join());                                // 42
}                                                                // close() awaits termination
```
**Pitfalls:** never `shutdown()`ing a pool (leaked threads); data races from unsynchronized shared state;
calling `future.get()` on the main thread (blocks); deadlock from nested locks; swallowing `InterruptedException`.

## Output shape
```
Concept: submit tasks to a pool; publish state with happens-before
Steps 1–5: <task + why>; race reproduced then fixed; async chain instead of get()
Check: pool closed? shared state synchronized? no blocking on the caller thread?
```

## Tips
- Predict the racy count before step 4 fixes it — the memory model becomes concrete (Socratic).
- Go deeper on patterns with [`concurrency-coach`](../concurrency-coach/SKILL.md); drill more via [`practice-generator`](../practice-generator/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
