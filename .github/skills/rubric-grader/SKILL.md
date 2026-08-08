---
name: rubric-grader
description: "Grade a learner's answer, essay, code, or artifact against an explicit rubric — confirm criteria and weights, score each with quoted evidence, give actionable feedback, and return a weighted total with next steps. Use for 'grade my essay', 'score this against a rubric', 'evaluate my code/answer', 'how many marks would this get', or assessing any artifact with defined criteria."
argument-hint: "Artifact to grade + rubric or grading criteria"
---

# Rubric Grader

Grade fairly and **teach through the feedback** so the next attempt is better — following
[`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants an artifact scored transparently against criteria.
- Marking essays, short answers, code, designs, or project deliverables.

## Procedure
1. **Confirm the rubric.** Use the learner's criteria and weights; if none are given, propose a short,
   explicit rubric (criteria, weights, and what each score level looks like) and confirm before grading.
2. **Read the whole artifact** before scoring, so context and intent aren't missed.
3. **Score each criterion** on the defined scale, citing **specific evidence** (quote the line, code, or
   passage) that justifies the score.
4. **Give actionable feedback** per criterion — what earned the score and the one change that raises it.
5. **Compute the weighted total** and a band (e.g. pass / merit / distinction), then list **next steps**.
6. For code, pair with [`code-review-coach`](../code-review-coach/SKILL.md) for line-level depth.

## Output shape
```
Grade: X/100 (<band>)   Rubric: <n> criteria
Criterion (weight)   Score   Evidence            Feedback / fix
<name> (30%)         4/5     "…quote…"           <one change>
…
Strengths: …  |  Priority fixes: 1) … 2) …
Next steps: …
```

## Tips
- Grade against the criteria only — no moving goalposts, no unstated expectations.
- Every score needs evidence; feedback should teach, not just judge. Be specific and encouraging.
- End with the **Learning Footer** (`AGENTS.md`).
