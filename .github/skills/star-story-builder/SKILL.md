---
name: star-story-builder
description: "Build behavioral-interview stories with the STAR method — elicit a real experience, structure it into Situation, Task, Action, Result, sharpen the measurable result, and prep likely follow-ups. Use for 'behavioral interview prep', 'STAR story', 'tell me about a time when…', 'competency question', or 'help me answer leadership/conflict/failure questions'. Never fabricates experience."
argument-hint: "Competency/question + the learner's real experience"
---

# STAR Story Builder

Turn a real experience into a crisp, compelling behavioral answer — following
[`AGENTS.md`](../../../AGENTS.md). Pairs with the **Interview Coach**.

## When to use

- Prepping for behavioral / competency interviews ("Tell me about a time…").
- Building a reusable story bank the **Interview Coach** can drill in a mock.

## Procedure

1. **Name the competency** behind the question — leadership, conflict, failure, ownership,
   ambiguity, influence — so the story targets what the interviewer is scoring.
2. **Elicit a real experience** with probing questions; if the learner is unsure, help them pick.
   Never invent or embellish events on their behalf.
3. **Structure into STAR:** **Situation** (brief context), **Task** (their responsibility),
   **Action** (what **they** did — "I", not "we"), **Result** (the outcome).
4. **Sharpen the Result:** quantify with **real** numbers; prompt for the metric if unknown, and
   add what they learned. Leave a placeholder rather than guessing a figure.
5. **Tighten to ~90 seconds:** lead with a one-line headline, cut jargon, keep Action the longest part.
6. **Prep follow-ups:** "What would you do differently?", "How did others react?"; note which other
   competencies this one story can also cover.

## Output shape

```
Competency: <e.g., conflict resolution>
Headline: <one-line hook>
S: … | T: … | A: <"I" actions> | R: <quantified result — metric to confirm: __>
Lesson learned: …
Likely follow-ups: 1) … 2) …  | Also covers: <other competencies>
```

## Tips

- Say "I", not "we" — interviewers score *your* actions, not the team's.
- A real, modest result beats an impressive invented one; honesty survives follow-up questions.
- Finish with the **Learning Footer** (`AGENTS.md`).
