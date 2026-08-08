---
name: go-interfaces-lab
description: "Hands-on Go lab on interfaces: implicit (structural) satisfaction, small single-method interfaces, type assertions with comma-ok, and type switches over any. Use for 'teach me Go interfaces', 'hands-on interfaces lab', 'implicit interface satisfaction', 'type assertion', 'type switch', 'accept interfaces return structs', or practicing Go interfaces by designing abstractions."
argument-hint: "The abstraction"
---

# Go Interfaces Lab

Learn interfaces by designing small abstractions and satisfying them yourself — a guided, hands-on lab
following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *understand* implicit satisfaction, small interfaces, and type switches by building them.
- Reinforcing idiomatic Go design for **Coding Mentor** or a backend role-agent.

## Procedure
**Concept (60s):** an interface is a set of method signatures, and a type satisfies it *implicitly* — just
by having those methods, with no `implements` keyword (structural typing; go.dev *Effective Go*, interfaces).

1. **Define small:** `type Shape interface{ Area() float64 }`; implement `Area` on a concrete struct.
2. **Implicit satisfaction:** pass that struct where a `Shape` is expected — it just fits, no declaration.
3. **Small is strong:** prefer one- or two-method interfaces (`io.Reader`); *accept interfaces, return structs*.
4. **Type assertion:** recover the concrete value with `v, ok := x.(T)` — check `ok`, never the panicking form.
5. **Type switch:** branch on the dynamic type via `switch v := x.(type) { case Shape: … }` over an `any`.

**Reference sketch:**
```go
type Shape interface{ Area() float64 } // small interface
type Rect struct{ W, H float64 }

func (r Rect) Area() float64 { return r.W * r.H } // implicitly satisfies Shape

func describe(x any) string {
	switch v := x.(type) { // type switch on dynamic type
	case Shape:
		return fmt.Sprintf("area=%.1f", v.Area())
	}
	return "unknown"
}
```
**Pitfalls:** a nil interface is *not* an interface holding a nil pointer (the "typed nil" trap); oversized
interfaces weaken the abstraction; asserting without the `, ok` form panics on a mismatch.

## Output shape
```
Concept: having the methods makes the type fit — satisfaction is implicit
Steps 1–5: <interface + impl you wrote + why>; assertion vs type switch
Check: interface small? used comma-ok assert? typed-nil trap avoided?
```

## Tips
- "The bigger the interface, the weaker the abstraction" (Go Proverbs, Rob Pike, 2015) — design to behavior.
- Review your abstraction with [`code-review-coach`](../code-review-coach/SKILL.md); drill more via [`practice-generator`](../practice-generator/SKILL.md).
- Baffled by a typed-nil panic? [`debugging-coach`](../debugging-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
