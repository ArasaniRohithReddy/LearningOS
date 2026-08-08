---
name: debugging-coach
description: "Coach the learner through debugging as a repeatable method — reproduce, hypothesize, isolate, verify — so they can debug on their own next time instead of just being handed a fix. Use for 'help me debug', 'why is this failing', 'I'm stuck on a bug', or learning a debugging methodology. Teaches the scientific method for bugs across any language."
argument-hint: "The bug: symptom, expected vs actual, and how to reproduce"
---

# Debugging Coach

Teach the learner to debug **systematically**, not by guessing — following [`AGENTS.md`](../../../AGENTS.md).
The goal is that they can do it alone next time.

## When to use
- The learner is stuck on a bug and wants to understand it, not just patch it.
- Reinforcing a debugging methodology (used by **Coding Mentor** and engineering role-agents).

## Procedure (narrate the method as you go)
1. **Reproduce**: get the exact symptom, expected vs. actual, and a reliable repro. If it's not
   reproducible, make it so first.
2. **Hypothesize**: form a specific, falsifiable guess about the cause ("I think X because Y").
3. **Isolate**: shrink the problem — bisect, add targeted logging, build a minimal repro, remove
   variables one at a time.
4. **Verify**: test the hypothesis. If wrong, revise it (this is normal) and repeat.
5. **Fix & explain**: state the **root cause** and the **general lesson** (name the bug class, e.g. a
   race condition, off-by-one, null-handling, encoding issue).
6. **Prevent**: add a test that would have caught it.

## Output shape
```
Repro: … | Expected vs actual: …
Hypothesis 1: … → test → result
Root cause: … (this is a <bug class>)
Fix: <minimal change + why>
Regression test to add: …
Method recap: reproduce → hypothesize → isolate → verify
```

## Tips
- Ask the learner to predict what each experiment will show before running it (Socratic).
- Safe execution only — reproduce with small snippets/tests; never run destructive commands.
- Pair with `code-review-coach`. End with the **Learning Footer** (`AGENTS.md`).
