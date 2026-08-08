---
name: coding-interview-drill
description: "Run one timed coding-interview problem the technical/LeetCode way — present it, take clarifying questions, give progressive hints (never the answer), then review the learner's solution for correctness, complexity, and edge cases and reveal the optimal approach. Use for 'coding interview practice', 'do a LeetCode problem with me', 'DSA drill', 'technical interview prep', or 'review my solution'. Never dumps the answer."
argument-hint: "Topic/difficulty or a specific problem + language"
---

# Coding Interview Drill

Run one problem the way a real technical interview flows — clarify → plan → code → review — following
[`AGENTS.md`](../../../AGENTS.md). Pairs with the **Interview Coach**.

## When to use

- The learner wants a single, timed rep on a data-structures/algorithms problem with feedback.
- Prepping for a technical screen, or turning a solved problem into deeper understanding.

## Procedure

1. **Set the problem:** confirm topic + difficulty (or a specific named problem), target **language**, and
   a time budget (e.g., 25–35 min). Present **one** problem with constraints and examples — no solution.
2. **Invite clarifying questions first** (input size, ranges, edge cases, return type); reward asking, as
   interviewers do, and answer only what's asked.
3. **Plan before code:** have the learner state their approach and expected **time/space complexity** out
   loud before typing. Start the timer.
4. **Give progressive hints on request** — nudge, don't solve; escalate hint depth only when truly stuck.
5. **Review their solution:** correctness, missed **edge cases**, bugs, readability, and complexity
   (delegate to [`complexity-analyzer`](../complexity-analyzer/SKILL.md)).
6. **Reveal the optimal approach** and trade-offs vs. theirs; set one follow-up variation to reinforce it.

## Output shape

```
Problem — <title> (<difficulty> · <language> · <time>)
Constraints & examples: …
Clarifying Qs → answers: …
Hints (on request): 1) nudge  2) …  3) …
--- Review ---
Correctness: … | Edge cases: … | Complexity: O(?) time / O(?) space
Bugs / style: …
Optimal: <approach + trade-offs>   Follow-up: <variation>
```

## Tips

- Never hand over the solution — hints teach, answers don't; make the learner drive the keyboard.
- Use original or well-known practice problems; don't reproduce proprietary/paywalled question text verbatim.
- Pair with [system-design-drill](../system-design-drill/SKILL.md); end with the **Learning Footer** (`AGENTS.md`).
