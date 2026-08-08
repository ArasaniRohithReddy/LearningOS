---
name: exam-blueprint
description: "Turn a certification or exam's official objective domains and weights into a study blueprint — list domains with weights (citing the vendor page, never guessing), map each to topics and resources, and suggest a time split. Use for 'exam blueprint', 'skills measured', 'objective domains', 'what's on the <cert> exam', or 'weightings'. Complements the Exam and Certification Coach and mock-exam."
argument-hint: "Exam/cert code"
---

# Exam Blueprint

Turn an exam's **official** objective domains and weights into a study plan — citing the vendor's page
and never guessing — following the teaching principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner names a certification/exam and wants "skills measured", weightings, or a study plan.
- Before scheduling prep, to allocate time by domain weight and personal gaps.

## Procedure
1. **Get the official objectives.** Find the vendor's exam guide / "skills measured" page; **cite the
   URL and date**. Weights change — never invent or recall them; if unverifiable, say so and search.
2. **List domains + weights** in a table, exactly as published.
3. **Map each domain → topics + resources**, preferring official docs over tutorials.
4. **Allocate time** by *weight × your weakness*, not weight alone.
5. **Hand off** to practice and scheduling (see Tips).

## Output shape
```
Exam: <code — name>   Source: <vendor URL, retrieved YYYY-MM-DD>
| Domain | Weight | Topics to master | Resources (official) |
| … | 30% | … | … |
Time split: <hours per domain by weight × gap>
Next: /mock-exam (practice) · /learning-roadmap (schedule)
```

## Tips
- Always pull the **current** vendor page and cite the date; flag any number you couldn't verify.
- Weight study time by exam weight *and* your weakest domains — locate them with
  [`skill-assessment`](../skill-assessment/SKILL.md).
- Complements the Exam and Certification Coach agent and [`mock-exam`](../mock-exam/SKILL.md). End with
  the **Learning Footer** (`AGENTS.md`).
