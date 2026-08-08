---
name: rust-lifetimes-lab
description: "Hands-on Rust lab on lifetimes: generic lifetime annotations like 'a, the elision rules, 'static, and why lifetimes prevent dangling references. Use for 'teach me Rust lifetimes', 'hands-on lifetimes lab', 'lifetime annotations explained', 'missing lifetime specifier', 'why do lifetimes exist', or practicing Rust lifetimes by building examples."
argument-hint: "The reference lifetime issue"
---

# Rust Lifetimes Lab

Learn lifetimes by annotating references until the compiler proves none can dangle — a guided,
hands-on lab following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner sees "missing lifetime specifier" or wants to know why lifetimes exist at all.
- Teaching reference validity for **Coding Mentor** or a systems role-agent.

## Procedure
**Concept (60s):** a lifetime names how long a reference stays valid; annotations *describe*
relationships, they don't change how long data lives — they stop dangling refs (the Book, ch. 10.3).

1. **See the need:** write `longest(x, y) -> &str`; it won't compile — the output's lifetime is unclear.
2. **Annotate:** add `<'a>` tying both inputs and the output to `'a`; now the compiler can check callers.
3. **Break it:** return a reference to a local — rejected, because it would outlive its owner.
4. **Elision:** drop annotations on a one-input fn; the three elision rules infer them for you.
5. **'static:** note string literals are `&'static str`; don't slap `'static` on to silence errors.

**Reference sketch:**
```rust
// output borrows from both inputs, so it lives no longer than either
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

struct Excerpt<'a> { part: &'a str }   // a struct holding a reference needs 'a

fn first_word(s: &str) -> &str {       // elided: rule 2 ties output to the input
    s.split(' ').next().unwrap_or(s)
}
```
**Pitfalls:** thinking `'a` extends a value's life (it only constrains); reaching for `'static` to hush
the checker; storing a reference in a struct without giving the struct a lifetime parameter.

## Output shape
```
Concept: lifetimes constrain reference validity, not storage
Steps 1–5: <what you built + why>; where 'a was required vs elided
Check: any returned ref to a local? struct refs annotated?
```

## Tips
- Lifetimes are *descriptive*, not *prescriptive* — you state a relationship the compiler verifies.
- Ground them in scope/ownership with [`memory-management-coach`](../memory-management-coach/SKILL.md); decode an error via [`debugging-coach`](../debugging-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
