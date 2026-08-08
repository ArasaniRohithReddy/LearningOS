---
name: memory-management-coach
description: "Teach how memory works — stack vs heap, allocation, and the models that free it (tracing/refcount garbage collection, manual malloc/free, and Rust ownership/borrowing) — plus common leaks and pitfalls. Use for 'stack vs heap', 'how does GC work', 'why is this leaking', 'explain Rust ownership/borrow checker', 'value vs reference', or reasoning about memory in any language."
argument-hint: "The language + the memory question"
---

# Memory Management Coach

Explain where data lives and who frees it, so the learner can predict allocation and lifetime — from
first principles, per the teaching and visual-aids guidance and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner asks how memory is laid out or reclaimed, or is chasing a leak / lifetime error.
- Pairs with [concurrency-coach](../concurrency-coach/SKILL.md) and [debugging-coach](../debugging-coach/SKILL.md) for races and diagnosis.

## Procedure

1. **Stack vs heap.** Stack = fast, LIFO, automatic per call frame (locals, return addresses); heap =
   dynamic and longer-lived, explicitly managed. Show which one a value lands on and why.
2. **Value vs reference.** Distinguish copying a value from copying a pointer/handle; note aliasing.
3. **Pick the model that frees memory:**
   - **Tracing GC** (JVM, .NET, Go) — reachability from roots; may be generational; pause vs. throughput.
   - **Reference counting** (CPython, Swift ARC) — free at count 0; watch reference **cycles**.
   - **Manual** (C/C++) — `malloc`/`free`, `new`/`delete`; you own every lifetime.
   - **Ownership** (Rust) — one owner, borrows checked at compile time; freed on scope exit (RAII).
4. **Name the pitfalls** — leaks, dangling pointers / use-after-free, double-free, fragmentation, retained
   references (listeners, caches, closures), reference cycles.
5. **Show the fix & trade-off** (safety vs. control vs. latency); confirm with the right profiler.

## Output shape

```
Value: <name> → Stack | Heap (why) · Owner/lifetime: …
Model: <GC / refcount / manual / ownership> — how it frees
Pitfall: <leak / dangling / cycle> → root cause
Fix: <change> | Trade-off: <safety vs control vs pause>
```

## Tips

- "Reference" means different things per language — define it before reasoning about lifetime.
- A GC prevents dangling pointers, not leaks: unreachable ≠ unused; drop retained references.
- Verify with a profiler/sanitizer (Valgrind, ASan, heap dumps); never guess. End with the **Learning Footer** (`AGENTS.md`).
