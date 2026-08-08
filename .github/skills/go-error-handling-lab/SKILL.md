---
name: go-error-handling-lab
description: "Hands-on Go lab on errors: the error interface, returning error values, wrapping with %w, errors.Is and errors.As, and sentinel vs custom error types. Use for 'teach me Go error handling', 'hands-on errors lab', 'wrap errors with %w', 'errors.Is vs errors.As', 'sentinel error', 'custom error type', or practicing idiomatic Go error handling."
argument-hint: "The error case"
---

# Go Error Handling Lab

Learn Go errors by returning, wrapping, and inspecting them yourself — a guided, hands-on lab following
the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *understand* error values, `%w` wrapping, and `errors.Is`/`As` by building them.
- Teaching idiomatic Go error flow for **Coding Mentor** or a backend role-agent.

## Procedure
**Concept (60s):** `error` is a built-in interface (`Error() string`) and errors are ordinary *values* you
return, inspect, and wrap — not exceptions (go.dev/blog/errors-are-values, 2015).

1. **Create & return:** build with `errors.New("…")` or `fmt.Errorf("…")`; check `if err != nil` at the call site.
2. **Sentinel:** `var ErrNotFound = errors.New("not found")`; match the chain with `errors.Is(err, ErrNotFound)`.
3. **Wrap with context:** `fmt.Errorf("load %q: %w", id, err)` — the `%w` verb keeps the cause (Go 1.13, 2019).
4. **Custom type:** a struct with `Error()` (and optional `Unwrap()`); extract it via `errors.As(err, &target)`.
5. **Decide:** sentinel for a known condition callers branch on; custom type when they need fields/detail.

**Reference sketch:**
```go
var ErrNotFound = errors.New("not found")

func load(id string) error {
	return fmt.Errorf("load %q: %w", id, ErrNotFound) // %w wraps the cause
}

func main() {
	err := load("x")
	if errors.Is(err, ErrNotFound) { // unwraps the chain to match
		// handle the known case
	}
}
```
**Pitfalls:** comparing wrapped errors with `==` (use `errors.Is`); wrapping with `%v` loses the chain
(use `%w`); over-wrapping so messages repeat; ignoring the returned `err`.

## Output shape
```
Concept: errors are values — return, wrap (%w), inspect (Is/As)
Steps 1–5: <error you built + why>; sentinel vs custom type
Check: %w not %v? errors.Is for sentinels, errors.As for types? every err checked?
```

## Tips
- Wrap once with context at each boundary; let the top layer decide how to report or log.
- Prefer `errors.Is`/`As` over string matching (go.dev/blog/go1.13-errors, 2019); drill via [`practice-generator`](../practice-generator/SKILL.md).
- Chasing a swallowed error? [`debugging-coach`](../debugging-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
