---
name: go-channels-lab
description: "Hands-on Go lab on channels: unbuffered vs buffered, send and receive, the select statement, directional channel types, and closing to build a pipeline. Use for 'teach me Go channels', 'hands-on channels lab', 'buffered vs unbuffered', 'select statement', 'close a channel', 'Go pipeline', or practicing Go concurrency by wiring producers to consumers."
argument-hint: "The pipeline"
---

# Go Channels Lab

Learn channels by wiring producers to consumers and building a pipeline yourself — a guided, hands-on lab
following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *understand* channels, `select`, and closing by building a working pipeline.
- Teaching CSP-style concurrency for **Coding Mentor**; pairs with [`concurrency-coach`](../concurrency-coach/SKILL.md).

## Procedure
**Concept (60s):** a channel is a typed conduit — `ch <- v` sends, `<-ch` receives. Unbuffered channels
*synchronize* sender and receiver (a rendezvous); buffered ones queue up to capacity (go.dev *Effective Go*).

1. **Unbuffered:** `make(chan int)`; a send blocks until a receiver is ready — a handoff, not a buffer.
2. **Buffered:** `make(chan int, 2)`; a send blocks only when full, a receive only when empty.
3. **Directions:** type params as `chan<- int` (send-only) or `<-chan int` (receive-only) to encode intent.
4. **Close & range:** the *producer* calls `close(ch)`; a consumer `for v := range ch` ends when closed; use `v, ok := <-ch`.
5. **Select:** `select` waits on several channels; add `default` for non-blocking or `time.After` for a timeout.

**Reference sketch:**
```go
func gen(nums ...int) <-chan int { // returns a receive-only channel
	out := make(chan int)
	go func() {
		defer close(out) // the sender closes, exactly once
		for _, n := range nums {
			out <- n
		}
	}()
	return out
}

// consume: for v := range gen(1, 2, 3) { use(v) }
```
**Pitfalls:** sending on a closed channel *panics*; closing from the receiver side; forgetting to close
leaves `range` blocked; a nil channel blocks forever.

## Output shape
```
Concept: unbuffered = handoff; buffered = queue up to cap
Steps 1–5: <stage you built + why>; producer closes, consumer ranges
Check: sender (not receiver) closes? select has default/timeout? directions typed?
```

## Tips
- "Don't communicate by sharing memory; share memory by communicating" (Go Proverbs, Rob Pike).
- Chain stages into pipelines (go.dev/blog/pipelines, 2014); coordinate with [`concurrency-coach`](../concurrency-coach/SKILL.md), drill via [`practice-generator`](../practice-generator/SKILL.md).
- Hit a deadlock ("all goroutines are asleep")? [`debugging-coach`](../debugging-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
