---
name: go-generics-lab
description: "Hands-on Go lab on generics: type parameters, constraints (any, comparable, cmp.Ordered), union and ~ approximation elements, type inference, and when to prefer generics over interfaces. Use for 'teach me Go generics', 'hands-on generics lab', 'type parameters', 'constraints', 'when to use generics', or practicing reusable Go code with type parameters."
argument-hint: "The reusable code"
---

# Go Generics Lab

Learn generics by writing one function that works over many types — a guided, hands-on lab following the
teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *understand* type parameters and constraints by turning duplicated code generic.
- Teaching reusable, type-safe Go for **Coding Mentor** or a backend role-agent.

## Procedure
**Concept (60s):** type parameters (Go 1.18, 2022) let one function or type work over many types with
compile-time safety — no `any` casts or copy-paste per type (go.dev/blog/intro-generics).

1. **Parameterize:** `func Map[T, U any](s []T, f func(T) U) []U` — `[T, U any]` are the type parameters.
2. **Infer:** call `Map(nums, sq)` and let the compiler infer `T`/`U`; write `Map[int, int](…)` only when needed.
3. **Constrain:** restrict with a constraint — `comparable`, or `cmp.Ordered` for `< > ==` (Go 1.21, 2023).
4. **Union & `~`:** write `~int | ~float64` to admit those *underlying* types (the `~` approximation element).
5. **When to use:** reach for generics over duplicated code or reflection; keep a plain interface if behavior suffices.

**Reference sketch:**
```go
func Max[T cmp.Ordered](s []T) T { // constraint: orderable types only
	m := s[0]
	for _, v := range s[1:] {
		if v > m { // allowed because T is cmp.Ordered
			m = v
		}
	}
	return m
}

// Max([]int{3, 1, 2}) == 3 ; Max([]string{"a", "c", "b"}) == "c"
```
**Pitfalls:** using generics where a simple interface would do; indexing `s[0]` on an empty slice;
expecting runtime method dispatch — constraints bind operators/methods at *compile* time.

## Output shape
```
Concept: [T any] = one implementation, many types, checked at compile time
Steps 1–5: <generic fn you wrote + why>; inference vs explicit type args
Check: constraint minimal (any/comparable/Ordered)? would an interface be enough?
```

## Tips
- "Write code, not types" — use generics for containers/algorithms, not everywhere (go.dev/blog/when-generics, 2022).
- Compare against an interface-based version; review with [`code-review-coach`](../code-review-coach/SKILL.md), drill via [`practice-generator`](../practice-generator/SKILL.md).
- Cryptic constraint error? [`debugging-coach`](../debugging-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
