---
name: mock-exam
description: "Run a full, timed mock exam for a certification or subject with a realistic item mix, then score by objective domain, explain every answer, and produce a targeted study plan for the gaps. Use for 'full mock exam', 'timed practice test', 'exam simulation', or a final readiness check. Complements the Exam and Certification Coach."
argument-hint: "Exam/cert code or subject + number of questions + time limit"
---

# Mock Exam

Simulate the real exam so the learner walks in confident — following [`AGENTS.md`](../../../AGENTS.md).

## When to use
- Final readiness check before a certification or test.
- The **Exam and Certification Coach** needs a full timed simulation (vs. topic drills).

## Procedure
1. Confirm the **exact exam/subject**, question count, time limit, and (for certs) the official
   objective domains and weights — verify from the vendor page; never rely on memory for exam specifics.
2. Generate a realistic **mixed item set** weighted by objective (delegate item creation to
   `quiz-generator`), matching the real style (MCQ, multi-select, case study).
3. Present the exam **timed, questions only** — no answers until the learner submits.
4. **Score by objective domain** so weaknesses are visible, not just a total.
5. Explain **every** question (why right / why each distractor is wrong).
6. Produce a **targeted plan** for weak domains (hand off to `learning-roadmap`); offer a re-test.

## Output shape
```
Mock Exam — <exam> (<n> items · <time>)
[timed items]
--- Results ---
Score: X% (pass ≈ Y%)   By domain: <domain>: a/b …
Per-question review: 1. <why> …
Focus next: <weak domains → plan>
```

## Tips
- Exam facts (objectives, passing score, format) must come from official, dated sources.
- Respect exam integrity: never provide real or leaked exam questions — generate original items.
- End with the **Learning Footer** (`AGENTS.md`).
