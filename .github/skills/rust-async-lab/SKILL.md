---
name: rust-async-lab
description: "Hands-on Rust lab on async: lazy futures, async/await, the .await suspension point, and executors (the Tokio concept). Use for 'teach me Rust async', 'hands-on async/await lab', 'futures explained', 'what does .await do', 'Tokio runtime', or practicing concurrent IO-bound Rust by building async tasks."
argument-hint: "The async task"
---

# Rust Async Lab

Learn async by making slow IO run concurrently on one executor — a guided, hands-on lab following
the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner has IO-bound work (network, disk, DB) and wants concurrency without OS threads.
- Teaching `async`/`.await` and executors for **Coding Mentor** or a backend role-agent.

## Procedure
**Concept (60s):** an `async fn` returns a lazy `Future` that does nothing until awaited; `.await`
suspends it and yields to the *executor* so other tasks run (async/await stabilized Rust 1.39, 2019).

1. **First future:** write an `async fn`; note calling it just makes a `Future` — it hasn't run yet.
2. **Await it:** add a runtime with `#[tokio::main]`; `.await` the future to drive it to completion.
3. **Sequential vs concurrent:** two `.await`s in a row take ~2s; `tokio::join!` runs both in ~1s.
4. **Spawn tasks:** `tokio::spawn` schedules work; `.await` the handle to get its result back.
5. **CPU-bound trap:** a busy loop blocks the executor — offload it via `tokio::task::spawn_blocking`.

**Reference sketch:**
```rust
use tokio::time::{sleep, Duration};
async fn fetch(n: u32) -> u32 {
    sleep(Duration::from_secs(1)).await;   // .await yields while IO waits
    n * n
}

#[tokio::main]                             // Tokio provides the executor
async fn main() {
    let (a, b) = tokio::join!(fetch(2), fetch(3));  // concurrent → ~1s
    println!("{a} {b}");
}
```
**Pitfalls:** building a future but never awaiting it (nothing happens); blocking the loop with
`std::thread::sleep` or CPU work; expecting parallelism from `join!` — it's concurrency on one task.

## Output shape
```
Concept: futures are lazy; .await suspends and yields to the executor
Steps 1–5: <what you built + why>; sequential ~2s vs join! ~1s
Check: every future awaited? anything blocking the executor?
```

## Tips
- Async wins on *waiting* (IO), not computing — send CPU-heavy work to threads/`spawn_blocking`.
- Reason about shared-state races with [`concurrency-coach`](../concurrency-coach/SKILL.md); debug "it never ran" via [`debugging-coach`](../debugging-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
