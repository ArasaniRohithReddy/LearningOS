---
name: rust-traits-lab
description: "Hands-on Rust lab on traits: defining and implementing traits, default methods, trait bounds, and static (generics / impl Trait) vs dynamic (dyn) dispatch. Use for 'teach me Rust traits', 'hands-on traits lab', 'trait bounds explained', 'impl Trait vs dyn', 'static vs dynamic dispatch', or practicing Rust traits by building an abstraction."
argument-hint: "The abstraction"
---

# Rust Traits Lab

Learn traits by defining shared behavior and dispatching it two ways — a guided, hands-on lab
following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants polymorphism in Rust, or is unsure whether to reach for `impl Trait` or `dyn`.
- Teaching interfaces and dispatch trade-offs for **Coding Mentor** or a systems role-agent.

## Procedure
**Concept (60s):** a trait is a set of method signatures a type can implement — Rust's interface. It can
supply default methods, and callers bind by it statically or dynamically (the Book, ch. 10.2).

1. **Define:** write `trait Area { fn area(&self) -> f64; }` with a default `fn name` method.
2. **Implement:** `impl Area for Circle` and `for Square`; override `area`, keep the default `name`.
3. **Static dispatch:** `fn describe(s: &impl Area)` — monomorphized per type, inlinable, zero-cost.
4. **Dynamic dispatch:** store `Vec<Box<dyn Area>>` of mixed shapes; calls go through a vtable at runtime.
5. **Bounds:** add `<T: Area + Clone>` (or a `where` clause) and note the orphan rule limits foreign impls.

**Reference sketch:**
```rust
trait Area {
    fn area(&self) -> f64;
    fn name(&self) -> &str { "shape" }       // default method
}
struct Circle { r: f64 }
impl Area for Circle {
    fn area(&self) -> f64 { std::f64::consts::PI * self.r * self.r }
}
fn describe(s: &impl Area) { println!("{}: {:.2}", s.name(), s.area()); } // static
let shapes: Vec<Box<dyn Area>> = vec![Box::new(Circle { r: 1.0 })];       // dynamic
```
**Pitfalls:** using `dyn` where a generic is clearer (loses inlining); non-object-safe traits can't be
`dyn`; forgetting the orphan rule — impl a trait only if the trait or the type is yours.

## Output shape
```
Concept: trait = shared behavior; static vs dynamic dispatch
Steps 1–5: <what you built + why>; impl Trait vs Box<dyn Trait> outcome
Check: object-safe for dyn? bound tight enough? orphan rule ok?
```

## Tips
- Prefer generics/`impl Trait` by default; reach for `dyn` for heterogeneous collections or smaller binaries.
- Turn a trait into a worked design with [`worked-example`](../worked-example/SKILL.md); drill more via [`practice-generator`](../practice-generator/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
