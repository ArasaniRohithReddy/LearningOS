---
name: rust-ownership-lab
description: "Hands-on Rust lab on ownership: move semantics, Copy vs Clone, the three ownership rules, and values dropped at end of scope. Use for 'teach me Rust ownership', 'hands-on ownership lab', 'move vs copy', 'value borrowed after move', 'why is s1 invalid', or practicing Rust ownership by building examples."
argument-hint: "The value/scope"
---

# Rust Ownership Lab

Learn ownership by moving values and reading the compiler's verdict — a guided, hands-on lab
following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner hits "value borrowed after move" or wants to *understand* who frees memory in Rust.
- Teaching move/copy semantics for **Coding Mentor** or a systems role-agent.

## Procedure
**Concept (60s):** every value has one owner; when the owner leaves scope the value is dropped. Three
rules: each value has an owner, only one at a time, dropped on scope exit (the Book, ch. 4.1).

1. **Own & drop:** put a `String` in a `{ }` block; it frees at `}` (RAII) — no `free` call needed.
2. **Move:** `let s2 = s1;` moves the heap buffer; using `s1` afterward is a compile error — read it.
3. **Copy:** repeat with `i32`; stack-only `Copy` types duplicate, so both bindings stay valid.
4. **Clone:** call `s1.clone()` for an explicit deep copy when you genuinely need two owners.
5. **Move through calls:** pass a `String` to a function; it moves in — return it to hand ownership back.

**Reference sketch:**
```rust
fn main() {
    let s1 = String::from("hi");
    let s2 = s1;                 // move: s1 is now invalid
    // println!("{s1}");         // ✗ error[E0382]: borrow of moved value
    let s3 = s2.clone();         // deep copy: s2 and s3 each own data
    let n = 5;
    let m = n;                   // Copy: i32 duplicated, n still usable
    println!("{s3} {m}");
}
```
**Pitfalls:** expecting assignment to copy heap data (it moves); silencing the checker with `clone()`
everywhere; forgetting a moved-in argument is gone unless the function returns it.

## Output shape
```
Concept: one owner; drop on scope exit
Steps 1–5: <what you built + why>; move vs Copy vs clone outcome
Check: which bindings still valid after the move? any needless clone?
```

## Tips
- Predict *before* compiling: will this line move, copy, or borrow? Then let `rustc` grade you.
- See where the freed memory lived with [`memory-management-coach`](../memory-management-coach/SKILL.md); trace a full example via [`worked-example`](../worked-example/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
