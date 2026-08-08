---
name: lesson-plan-writer
description: "Write one concrete, teachable lesson plan — a single measurable objective, a hook, gradual-release (I-do / we-do / you-do), materials, minute-by-minute timing, checks for understanding, and homework. Use for 'write a lesson plan', 'plan a class/session', 'how would I teach X in 60 minutes', or turning a curriculum module into a runnable session."
argument-hint: "Lesson topic + audience + length (e.g. 'recursion, CS1 students, 50 min')"
---

# Lesson Plan Writer

Turn one topic into a **runnable lesson** a teacher could deliver as-is — following the teaching
principles in [`AGENTS.md`](../../../AGENTS.md). This zooms into a single session; for the whole course
use [`curriculum-designer`](../curriculum-designer/SKILL.md).

## When to use
- The learner must teach or present one topic in a fixed time slot.
- Turning a curriculum module into a concrete, timed session with activities.

## Procedure
1. **Confirm** topic, audience (level, size), length, and setting (in-person/online, tools available).
2. **Write one measurable objective** with a Bloom's verb — what learners can *do* by the end.
3. **Hook (activate prior knowledge):** a question, demo, or problem that creates a need to know.
4. **Gradual release** (Pearson & Gallagher, 1983): **I do** (model it) → **we do** (guided practice
   together) → **you do** (independent practice). Give the most time to *you do*.
5. **Checks for understanding** at each stage — a quick question, poll, or "predict the output"
   (formative assessment) — with what you'll do if learners don't get it.
6. **List materials, a minute-by-minute timing budget, and homework** that extends the lesson.
7. Teach the concept itself with [`concept-explainer`](../concept-explainer/SKILL.md). End with the footer.

## Output shape
```
Lesson: <topic> — <audience>, <length>
Objective: learners can <Bloom's verb + outcome>
Hook (5 min) · I do (10) · We do (15) · You do (15) · Wrap + check (5)
Materials: … | Check for understanding: … | Homework: …
```

## Tips
- One objective per lesson — a session that "covers" five things teaches none of them well.
- Front-load *you do*: people learn by doing, not by watching you do — keep your talking short.
- Generate checks and homework with [`quiz-generator`](../quiz-generator/SKILL.md) or
  [`practice-generator`](../practice-generator/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
