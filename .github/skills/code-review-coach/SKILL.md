---
name: code-review-coach
description: "Review code as a teaching exercise, not just a critique. Walks through Correctness → Security (OWASP) → Performance → Design → Style, and explains the principle behind every finding plus a concrete fix, so the learner improves. Use for 'review my code', 'what's wrong with this', 'how do I make this better', or learning best practices from real code."
argument-hint: "Paste code (or point to a file) + language/context + what you want to learn"
---

# Code Review Coach

Review code so the learner becomes a **better engineer** — following the coding standards and Learning
Footer in [`AGENTS.md`](../../../AGENTS.md). Every comment teaches the underlying principle.

## When to use

- The learner shares code and wants feedback that explains the *why*.
- **Coding Mentor** needs a structured review pass.

## Review order (teach the principle behind each finding)

1. **Correctness** — bugs, edge cases, off-by-one, error handling, concurrency, resource leaks.
2. **Security (OWASP)** — injection, authn/authz, secrets in code, unsafe deserialization, SSRF,
   input validation at boundaries. Flag anything exploitable first.
3. **Performance** — complexity, N+1 queries, needless allocations, blocking I/O, caching.
4. **Design** — SOLID, cohesion/coupling, naming, abstractions, testability; composition over
   inheritance.
5. **Style & idioms** — language conventions, readability, dead code, consistent formatting.

## Procedure

1. Read the whole snippet/file **before** commenting. Confirm language, runtime, and intent.
2. Report findings grouped by the order above. For each: **what**, **why it matters (the principle,
   named)**, and **a concrete fix** (show the improved code).
3. Lead with the highest-severity issues (security/correctness) and say what's already good.
4. Suggest **tests** that would have caught the bugs.
5. End with the **Learning Footer** (`AGENTS.md`) — the top pattern to internalize + one exercise.

## Output shape

```
Summary: <1–2 lines: overall + biggest risk>
[Critical] Correctness/Security — <finding> → why → fix (code)
[Major]   Performance/Design — …
[Minor]   Style — …
What's good: …
Tests to add: …
Learning Footer
```

## Tips

- Name each issue (e.g., "this is a TOCTOU race", "N+1 query") so the learner can look it up.
- Don't rewrite everything silently — teach the change so they can do it next time.
- Verify API/behavior claims; never invent library semantics.
