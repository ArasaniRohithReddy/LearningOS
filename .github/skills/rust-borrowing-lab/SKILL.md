---
name: rust-borrowing-lab
description: "Hands-on Rust lab on borrowing and references: shared &T vs mutable &mut T borrows, the borrow-checker rules, and non-lexical lifetimes. Use for 'teach me Rust borrowing', 'hands-on borrow lab', 'references explained', 'cannot borrow as mutable more than once', 'shared vs mutable borrow', or practicing the Rust borrow checker by building examples."
argument-hint: "The reference need"
---

# Rust Borrowing Lab

Learn borrowing by handing out references and reading the borrow checker's verdicts — a guided,
hands-on lab following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner needs a value without owning it, or hit "cannot borrow ... as mutable".
- Teaching aliasing rules and data-race prevention for **Coding Mentor** or a systems role-agent.

## Procedure
**Concept (60s):** a reference borrows access without taking ownership. Two rules: *either* one `&mut`
*or* any number of `&`, and every reference must stay valid (the Book, ch. 4.2).

1. **Shared borrow:** pass `&s` to a function that reads it; the caller still owns `s` afterward.
2. **Many readers:** take two `&s` at once and print both — immutable borrows may overlap.
3. **Exclusive borrow:** take one `&mut s` and mutate through it; a second `&mut` is a compile error.
4. **No mix:** try `&` and `&mut` live together — rejected, so a reader never sees a half-written value.
5. **NLL:** put the last use of `&` before the `&mut`; it compiles (non-lexical lifetimes, Rust 2018).

**Reference sketch:**
```rust
fn main() {
    let mut s = String::from("hi");
    let r1 = &s;                 // shared borrow
    let r2 = &s;                 // another reader — fine
    println!("{r1} {r2}");       // last use of r1/r2 ends their borrow (NLL)
    let w = &mut s;              // exclusive borrow now allowed
    w.push_str(" there");
    println!("{w}");
}
```
**Pitfalls:** holding a `&` past a `&mut` (a checker error, not a logic bug); returning a reference to a
local; assuming borrows last to the closing brace — with NLL they end at last use.

## Output shape
```
Concept: one &mut xor many & ; refs stay valid
Steps 1–5: <what you built + why>; which combo compiled vs errored
Check: any overlapping &mut? reference outliving its owner?
```

## Tips
- The checker rejects *possible* races, not just actual ones — satisfy the rule, don't fight it.
- Ground refs in scope with [`memory-management-coach`](../memory-management-coach/SKILL.md); shared-state races with [`concurrency-coach`](../concurrency-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
