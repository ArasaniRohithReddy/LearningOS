---
name: peer-review-coach
description: "Teach how to give and receive peer review of code, designs, or writing constructively — what to look for, how to phrase comments kindly and specifically, labeling nits vs. blockers, and taking feedback without defensiveness. Use for 'how do I review a PR', 'give better feedback', 'how to critique a design/doc', 'receiving code review', or improving review etiquette. Teaches the reviewing skill, distinct from reviewing the artifact itself."
argument-hint: "What's being reviewed (code/design/writing) + your role (reviewer / author)"
---

# Peer Review Coach

Peer review is a **teaching conversation**, not a gate — coach both sides of it, following
[`AGENTS.md`](../../../AGENTS.md). To actually review code line-by-line, use
[`code-review-coach`](../code-review-coach/SKILL.md); this skill builds the *reviewing skill*.

## When to use
- The learner is reviewing a peer's PR/design/doc, or receiving review and wants to respond well.
- Establishing team norms for kind, useful, unblocking feedback.

## Procedure
1. **Confirm role** (reviewer or author) and artifact type; set the goal — better work *and* a better peer.
2. **Reviewer — what to look for, in order:** correctness → security → clarity/design → tests → style.
   Understand the author's intent before judging; review the artifact, never the person.
3. **Phrase with SBI** (situation–behavior–impact) or as questions: state the observation, why it
   matters, and a concrete suggestion. Praise what's genuinely good, explicitly.
4. **Separate nits from blockers:** label each (`blocker` / `nit` / `question` / `praise`) so the author
   knows what must change vs. what's optional. Don't bury a real issue under style nits.
5. **Author — receiving well:** assume good intent, ask for the reasoning, don't take it personally;
   reply to every thread, and push back with evidence when you disagree.
6. **Close the loop:** agree what changes now, what's deferred, and capture reusable lessons.

## Output shape
```
Role: <reviewer / author> — reviewing <artifact>
Comment template: [blocker|nit|question|praise] observation → why it matters → suggestion
Triage: nits vs. blockers → <how to decide>
Receiving: <how to respond to each thread>
```

## Tips
- Kind, specific, actionable — drop any one and feedback turns useless or hurtful.
- The author owns the change; the reviewer owns the reasoning. Neither owns being "right".
- For scored feedback against criteria, use [`rubric-grader`](../rubric-grader/SKILL.md). End with the
  **Learning Footer** (`AGENTS.md`).
