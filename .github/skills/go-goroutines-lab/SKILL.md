---
name: go-goroutines-lab
description: "Hands-on Go lab on goroutines: launching with the go keyword, the runtime scheduler and GOMAXPROCS, synchronizing with sync.WaitGroup, and finding data races with the -race detector. Use for 'teach me goroutines', 'hands-on goroutines lab', 'WaitGroup', 'the go scheduler', 'fix a data race in Go', or practicing Go concurrency by launching and joining goroutines."
argument-hint: "The concurrency goal"
---

# Go Goroutines Lab

Learn goroutines by launching, joining, and *racing* them yourself — a guided, hands-on lab following
the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *understand* goroutines and the scheduler by writing concurrent Go, not reading about it.
- Reinforcing concurrency for **Coding Mentor** or a backend role-agent; pairs with [`concurrency-coach`](../concurrency-coach/SKILL.md).

## Procedure
**Concept (60s):** `go f()` starts a *goroutine* — a lightweight thread the Go runtime multiplexes onto a
few OS threads (M:N scheduling; `GOMAXPROCS` sets parallelism). See go.dev *Effective Go* (concurrency).

1. **Launch:** run `go say("hi")`; watch `main` sometimes exit first — goroutines need synchronization.
2. **Scheduler:** spawn many goroutines; the runtime schedules them cooperatively at safe points, few threads.
3. **Join with WaitGroup:** `wg.Add(1)` before each `go`, `defer wg.Done()` inside, `wg.Wait()` to block.
4. **Break it:** two goroutines do `counter++` unguarded → lost updates; run `go run -race ./...` to see it.
5. **Fix it:** guard shared state with a `sync.Mutex`, an atomic, or hand ownership over a channel.

**Reference sketch:**
```go
import "sync"

func main() {
	var wg sync.WaitGroup
	for i := 0; i < 5; i++ {
		wg.Add(1) // register each goroutine before launching
		go func(n int) {
			defer wg.Done() // n is its own copy; Go 1.22+ loop vars are per-iteration
		}(i)
	}
	wg.Wait() // block until all 5 finish
}
```
**Pitfalls:** `main` returning before goroutines run; `wg.Add` *after* `go`; sharing a loop variable
pre-Go 1.22; unsynchronized shared state (always try `-race`).

## Output shape
```
Concept: go f() → new goroutine on the runtime scheduler
Steps 1–5: <what you launched + why>; WaitGroup gates main; -race reveals the bug
Check: every Add matched by Done? shared state guarded? main waits?
```

## Tips
- Run with `go run -race` early — the detector finds data races you cannot see (go.dev/blog/race-detector, 2013).
- A goroutine is cheap to start but must be *joined*; go deeper with [`concurrency-coach`](../concurrency-coach/SKILL.md), drill via [`practice-generator`](../practice-generator/SKILL.md).
- Stuck on a deadlock or race? [`debugging-coach`](../debugging-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
