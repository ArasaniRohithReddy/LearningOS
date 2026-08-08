---
name: property-based-testing-coach
description: "Teach property-based testing (QuickCheck/Hypothesis) — how to find properties and invariants, write generators, use shrinking to get a minimal counterexample, and know when it beats example-based tests. Use for 'property-based testing', 'QuickCheck', 'Hypothesis', 'fast-check', 'generative testing', 'invariants', 'find edge cases automatically', or learning property tests in any language."
argument-hint: "The function/behavior + language"
---

# Property-Based Testing Coach

Teach the learner to state a rule that must hold for **all** inputs and let a tool hunt for counterexamples —
finding edges you'd never enumerate by hand — per the teaching approach in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner writes many example tests yet still ships edge-case bugs (parsers, encoders, math, data structures).
- Deepening a suite built with [test-writer](../test-writer/SKILL.md) or driven by [tdd-coach](../tdd-coach/SKILL.md).

## Procedure

1. **Explain the shift.** Instead of one example → one assertion, you assert a **property** true for every
   input; the tool generates hundreds of random cases and tries to falsify it.
2. **Find properties/invariants.** Common shapes: **round-trip** (`decode(encode(x)) == x`),
   **idempotence/commutativity**, **invariants** (sort preserves length + multiset, output ordered), and
   an **oracle** (result matches a slower reference or a metamorphic relation).
3. **Write generators.** Describe the input space — ranges, sizes, structures — and constrain it to the
   *valid* domain; compose small generators to build complex types.
4. **Lean on shrinking.** On failure the tool **shrinks** to the minimal failing input — the debugging
   gift. Record the printed **seed** so the case reproduces deterministically.
5. **Know when it wins.** Best for input-heavy, edge-rich logic; it *complements*, not replaces, a few
   targeted example tests that document intent.
6. **Pick a tool.** Hypothesis (Python), QuickCheck (Haskell), fast-check (JS/TS), jqwik (Java), FsCheck (.NET), PropEr (Erlang).

## Output shape

```
Behavior/language: <function + lang/tool>
Property: for all x, <invariant/round-trip/oracle relation>
Generator: <input space + constraints>
Counterexample (shrunk): <minimal input> | seed: <n>
Verdict: property holds / bug found → fix + kept example tests
```

## Tips

- Struggling to state a property is a design signal — the behavior may be under-specified; clarify it first.
- Origin: Claessen & Hughes, *QuickCheck* (ICFP 2000); trust shrinking to expose the true minimal failure.
- Pair with `test-writer`; end with the **Learning Footer** (`AGENTS.md`).
