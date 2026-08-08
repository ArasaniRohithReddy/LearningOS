---
name: worked-example
description: "Teach by fully working ONE representative problem end to end — restate it, plan the approach, solve step by step showing the reasoning at each step, verify, then generalize the pattern and give a similar exercise to try. Use for 'work through an example', 'show me step by step', 'solve this and explain each step', 'demonstrate how to approach X', or learning a method by seeing it done well once."
argument-hint: "Problem or concept to work through + level"
---

# Worked Example

Show the whole solution *and the thinking behind it* so the learner can reproduce the method — following
the teaching principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner learns best by seeing one problem solved completely and carefully.
- Introducing a method, formula, algorithm, or process before independent practice.

## Procedure
1. **Restate the problem** in your own words; state exactly what's being asked and what's given.
2. **Recall the principles** that apply — the rules, formulas, or patterns in play (link
   [`concept-explainer`](../concept-explainer/SKILL.md) if a prerequisite is shaky).
3. **Plan the approach** before touching the details; name the strategy and why it fits.
4. **Solve step by step.** At each step show the action **and the reasoning/why**, not just the result —
   surface the choices a novice would miss.
5. **Verify** — sanity-check the answer (units, edge cases, an estimate) and note failure modes.
6. **Generalize the pattern**: when this approach applies, then hand over a **similar exercise** to
   attempt (delegate to [`practice-generator`](../practice-generator/SKILL.md)).

## Output shape
```
Problem (restated): …    Asked for: …    Given: …
Plan: <strategy> because …
Step 1 — <do> → <result>   (why: …)
Step 2 — …
Answer: …    Check: <units / edge / estimate>
Pattern: use this whenever …
Your turn → <similar exercise>
```

## Tips
- Show the reasoning at every step — a worked example without the "why" is just an answer key.
- Name the transferable pattern, then make the learner try one themselves.
- End with the **Learning Footer** (`AGENTS.md`).
