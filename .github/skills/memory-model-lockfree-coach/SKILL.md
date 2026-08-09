---
name: memory-model-lockfree-coach
description: "Teach concurrency at the level the hardware and the standard actually define — the happens-before relation, data races as undefined behaviour, std::memory_order relaxed/acquire/release/seq_cst and what each does NOT guarantee, compare-exchange loops and spurious failure, the ABA problem and its reclamation fixes, and the wait-free vs lock-free vs obstruction-free ladder — then hand over a compilable SPSC ring buffer checked with ThreadSanitizer. Use for 'explain memory_order', 'acquire release semantics', 'what is happens-before', 'is my lock-free queue correct', 'compare_exchange_weak vs strong', 'the ABA problem', or 'lock-free vs wait-free'."
argument-hint: "The shared data structure or atomic sequence to verify (+ language: C++20 | Rust | Go | Java)"
---

# Memory Model & Lock-Free Coach

Lock-free code is not "locks but faster" — it is a proof obligation about the **happens-before** relation.
We teach the ordering rules before the tricks, and insist on a checker rather than a plausible argument,
per the verify-before-you-teach rule in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- A learner has written (or copy-pasted) a lock-free queue, stack, or double-checked-locking singleton.
- Code "works on x86" and breaks on AArch64/POWER, or breaks only under `-O2`.
- They need to justify `memory_order_relaxed` in a counter, or an `acquire`/`release` pair in a handoff.
- Don't use it for higher-level patterns (worker pools, pipelines) — that is
  [concurrency-coach](../concurrency-coach/SKILL.md).

## First principles: happens-before is the only guarantee

A **data race** is two conflicting accesses (at least one a write) to the same memory location, not ordered
by happens-before, with at least one non-atomic — undefined behaviour in C++ [intro.races], and undefined in
Rust and (with implementation-limited damage) in the Go memory model. "It printed the right answer" proves
nothing; only an ordering edge does.

```mermaid
sequenceDiagram
  participant P as Producer thread
  participant M as atomic&lt;size_t&gt; tail
  participant C as Consumer thread
  P->>P: buf[i] = value   (plain write)
  P->>M: store(i+1, release)
  Note over P,M: everything sequenced BEFORE the release<br/>is visible to whoever sees this value
  C->>M: load(acquire) sees i+1
  Note over M,C: synchronizes-with edge -> happens-before
  C->>C: read buf[i]   (safe, no race)
  C-->>P: without the release/acquire pair this read is UB
```

| `std::memory_order` | Guarantees | Does **not** guarantee | Typical use |
| --- | --- | --- | --- |
| `relaxed` | atomicity + per-object modification order | any ordering with other variables | statistics counters, refcount *increment* |
| `acquire` (load) | no later access moves before it; pairs with a release | ordering with unrelated atomics | consumer side of a handoff |
| `release` (store) | no earlier access moves after it; publishes prior writes | anything about *later* writes | producer side of a handoff |
| `acq_rel` (RMW) | both, on the same operation | a global total order | CAS in a lock-free structure |
| `seq_cst` (default) | one single total order S over all seq_cst ops | that it is free — fences cost | when in doubt; correctness first |
| `consume` | (intended) data-dependency ordering | anything portable — discouraged since P0371 | avoid; use `acquire` |

**Release/acquire only synchronises through the *same atomic object*.** A release store to `x` read by an
acquire load of `y` creates no edge. Refcounts show the pattern: increment may be `relaxed`, but the final
decrement must be `acq_rel` (or `release` + an `acquire` fence) so the destructor sees every prior write —
this is exactly what `std::shared_ptr` and Rust's `Arc` do.

**CAS.** `compare_exchange_weak` may fail *spuriously* (permitted so LL/SC machines emit one instruction), so
it belongs in a loop; `compare_exchange_strong` fails only on a genuine mismatch. Both take a success and a
failure ordering, and the failure ordering may not be `release`/`acq_rel`. On failure the expected operand is
**updated in place** with the observed value — reload nothing, just loop.

**ABA.** A CAS compares a *value*, not a history: if a pointer is freed and reallocated at the same address,
`A → B → A` makes a stale CAS succeed and corrupts the structure. Treiber's stack (1986) has this bug on
`pop`. Fixes: tagged/versioned pointers with a double-width CAS, hazard pointers (Michael, 2004),
epoch-based reclamation, or RCU — hazard pointers and RCU were adopted for C++26.

**Progress ladder** (Herlihy & Shavit, *The Art of Multiprocessor Programming*): **wait-free** (every thread
finishes in a bounded number of its own steps) ⊂ **lock-free** (some thread always makes progress) ⊂
**obstruction-free** ⊂ **blocking**. "Lock-free" says nothing about latency for *your* thread.

## Procedure

1. **Write the invariant first** in one sentence ("a slot is readable only after `tail` has been published").
   Every ordering choice must defend that sentence.
2. **Draw the happens-before edges** between threads, naming the *same* atomic object on both ends. No edge →
   no guarantee.
3. **Start at `seq_cst`**, get it correct, then weaken one operation at a time and re-argue the invariant.
   Never start relaxed.
4. **Classify each atomic**: producer-published data → `release`; consumer of that data → `acquire`; pure
   counters with no data attached → `relaxed`; read-modify-write in a structure → `acq_rel`.
5. **Loop your weak CAS**: `while (!p.compare_exchange_weak(expected, desired, acq_rel, acquire)) {}` and
   remember `expected` is refreshed by the failing call.
6. **Ask the reclamation question** for any node-removing structure: who frees, and can the address be reused
   while another thread holds it? If you have no answer, you have ABA and a use-after-free.
7. **Check with a tool, not an argument.**
   C++: `g++ -std=c++20 -O2 -pthread -fsanitize=thread ring.cpp -o ring` (and a separate
   `-fsanitize=address,undefined` build). Go: `go test -race -count=100`. Rust: `cargo +nightly miri test`
   plus `loom` for exhaustive interleavings. Java: jcstress.
8. **Justify the choice against a plain mutex**: measure both. An uncontended `std::mutex` is often faster
   than a hand-rolled CAS loop, and always easier to prove. Close with the **Learning Footer**.

## Output shape

```
Invariant:      <one sentence the structure must always satisfy>
Shared state:   <var> : <atomic<T> | plain>   written by <thread>, read by <thread>
HB edges:       <store(release) on X>  --synchronizes-with-->  <load(acquire) on X>
Orderings:      <op> = <relaxed|acquire|release|acq_rel|seq_cst>  because <what it protects>
CAS:            weak-in-loop | strong   success=<order> failure=<order>
ABA risk:       <none (SPSC/no reuse) | present -> tagged ptr | hazard ptr | epoch | RCU>
Progress:       blocking | obstruction-free | lock-free | wait-free   (for which operation)
Checker:        <-fsanitize=thread | go test -race | miri+loom | jcstress>   Result: <clean|report>
Baseline:       mutex version <t0> vs lock-free <t1>  ->  <keep|revert>
Next: <concurrency-coach | cpu-cache-performance-coach | go-context-lab>
Learning Footer
```

## Worked example — a single-producer/single-consumer ring with one release/acquire pair

```cpp
// ring.cpp — g++ -std=c++20 -O2 -pthread -fsanitize=thread ring.cpp -o ring && ./ring
#include <array>
#include <atomic>
#include <cstddef>
#include <iostream>
#include <optional>
#include <thread>

template <class T, std::size_t N>                 // N must be a power of two
class SpscRing {
    static_assert((N & (N - 1)) == 0, "N must be a power of two");
    std::array<T, N> buf_{};
    alignas(64) std::atomic<std::size_t> head_{0};   // written only by the consumer
    alignas(64) std::atomic<std::size_t> tail_{0};   // written only by the producer
public:
    bool push(T v) {                                  // producer thread only
        const auto t = tail_.load(std::memory_order_relaxed);   // our own variable
        const auto h = head_.load(std::memory_order_acquire);   // pairs with pop's release
        if (t - h == N) return false;                           // full (unsigned wrap is fine)
        buf_[t & (N - 1)] = std::move(v);                       // plain write...
        tail_.store(t + 1, std::memory_order_release);          // ...published here
        return true;
    }
    std::optional<T> pop() {                          // consumer thread only
        const auto h = head_.load(std::memory_order_relaxed);
        const auto t = tail_.load(std::memory_order_acquire);   // pairs with push's release
        if (h == t) return std::nullopt;                        // empty
        T v = std::move(buf_[h & (N - 1)]);                     // safe: HB edge established
        head_.store(h + 1, std::memory_order_release);          // frees the slot
        return v;
    }
};

int main() {
    SpscRing<int, 4> q;
    std::thread prod([&] {
        for (int i = 0; i < 10; ++i)
            while (!q.push(i)) std::this_thread::yield();
    });
    long sum = 0;
    for (int got = 0; got < 10; ) {
        if (auto v = q.pop()) { sum += *v; ++got; }
        else std::this_thread::yield();
    }
    prod.join();
    std::cout << "sum=" << sum << " (expected 45)\n";
}
```

Traced output: `sum=45 (expected 45)` — the consumer takes exactly ten values, `0+1+…+9 = 45`, regardless of
interleaving, because the capacity-4 ring simply back-pressures the producer. Why it is correct: the only
cross-thread data is `buf_`, and every read of a slot is preceded by an acquire load of `tail_` that read a
value published by the matching release store, giving a happens-before edge. Edge cases pinned down here:
`t - h` uses modular unsigned arithmetic, so it stays correct across `size_t` wraparound; the `alignas(64)`
keeps `head_` and `tail_` off one cache line (false sharing, see
[cpu-cache-performance-coach](../cpu-cache-performance-coach/SKILL.md)); and there is **no ABA risk** because
nothing is freed or reused by address. Now weaken `release` to `relaxed` in `push` and rebuild with
`-fsanitize=thread` — TSan models the orderings and will typically report a race on `buf_`; note that a
*clean* TSan run is evidence, not proof, since it only observes the interleavings that actually ran.

## Tips

- x86-64 is TSO and hides missing `acquire`/`release`; AArch64, POWER and RISC-V do not. Test on ARM or at
  minimum reason from the standard, never from your laptop.
- Volatile is not atomic in C/C++ — it orders nothing and is not a concurrency tool.
- Double-checked locking is only correct with a `release` store and an `acquire` load; in C++11+ prefer a
  function-local `static` (thread-safe initialisation is guaranteed) or `std::call_once`.
- A relaxed counter is fine for statistics but not for "the data is ready" — that needs a paired edge.
- Every lock-free structure that removes nodes needs a reclamation scheme; without one you have a
  use-after-free wearing a performance costume.
- Prefer a mutex until a benchmark says otherwise — see
  [concurrency-coach](../concurrency-coach/SKILL.md) and [code-optimizer](../code-optimizer/SKILL.md).
- Pair with [cpp-move-semantics-lab](../cpp-move-semantics-lab/SKILL.md),
  [go-context-lab](../go-context-lab/SKILL.md) and
  [rust-smart-pointers-lab](../rust-smart-pointers-lab/SKILL.md); cite the standard, the Go memory model or
  the Rustonomicon with dates (`AGENTS.md` §2) and finish with the **Learning Footer** (`AGENTS.md`).
