---
name: rust-error-handling-lab
description: "Hands-on Rust lab on error handling: Result and the ? operator, Option, and custom error types (the thiserror concept). Use for 'teach me Rust error handling', 'hands-on Result lab', 'the ? operator explained', 'Option vs Result', 'custom errors with thiserror', or practicing fallible Rust by building it."
argument-hint: "The fallible op"
---

# Rust Error Handling Lab

Learn recoverable errors by making failure a value the compiler forces you to handle — a guided,
hands-on lab following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner is unwrapping everything, or wants a real error type instead of panicking.
- Teaching `Result`/`Option` propagation for **Coding Mentor** or a backend role-agent.

## Procedure
**Concept (60s):** recoverable errors are `Result<T, E>` (`Ok`/`Err`); absence is `Option<T>`
(`Some`/`None`). `?` returns the `Err`/`None` early or unwraps the success (the Book, ch. 9).

1. **Return a Result:** write `parse` returning `Result<i32, ParseIntError>`; match on `Ok`/`Err`.
2. **Propagate with ?:** replace the match with `s.parse()?` (the ? operator, stabilized Rust 1.13, 2016).
3. **Option too:** write a function returning `Option<char>`; use `?` on a `None`-returning call.
4. **Custom error:** define an `enum AppError`; implement `Display` + `Error` so callers get context.
5. **thiserror concept:** derive that boilerplate; `#[from]` auto-converts a source error at `?`.

**Reference sketch:**
```rust
use std::num::ParseIntError;

fn double(s: &str) -> Result<i32, ParseIntError> {
    let n: i32 = s.parse()?;      // Err returns early; Ok is unwrapped
    Ok(n * 2)
}
#[derive(thiserror::Error, Debug)]     // concept: derives Display + Error
enum AppError {
    #[error("bad number: {0}")]
    Parse(#[from] ParseIntError),      // #[from] converts at `?`
}
```
**Pitfalls:** `.unwrap()`/`.expect()` in library code (panics the caller); swallowing the source error;
using `?` in a `fn` whose return type isn't `Result`/`Option`; `panic!` for an expected condition.

## Output shape
```
Concept: Result/Option make failure explicit; ? propagates
Steps 1–5: <what you built + why>; match → ? refactor; custom error
Check: any stray unwrap? source error preserved? return type fits ?
```

## Tips
- Reserve `panic!`/`unwrap` for truly-impossible states; return `Result` for anything a caller can handle.
- Design the failure model with [`error-handling-coach`](../error-handling-coach/SKILL.md); diagnose a panic via [`debugging-coach`](../debugging-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
