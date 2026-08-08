---
name: onboarding-plan
description: "Build a structured 30/60/90-day plan to onboard onto a new team, codebase, or technology — what to read, who to ask, what to build first, and checkpoints per phase. Use for 'onboarding plan', 'first 90 days', 'ramp up on X', 'new job/new codebase', or '30-60-90'. Pairs with code-walkthrough and learning-roadmap."
argument-hint: "The tech/codebase/team + timeframe"
---

# Onboarding Plan

Turn a daunting new codebase, team, or technology into a paced **30/60/90-day** plan — what to read,
who to ask, what to build — following the teaching principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner joined a new team/project or is ramping on a new stack and asks for a first-90-days plan.
- A big unfamiliar system needs a sequenced entry path, not a firehose.

## Procedure
1. **Frame context & goal.** Capture the role, stack, and what "productive" means; set the timeframe
   (default 30/60/90).
2. **Days 1–30 — Learn.** Read the README/architecture docs, set up the dev environment, map who owns
   what, and ship one tiny PR (typo, test, doc). Trace a core flow with
   [`code-walkthrough`](../code-walkthrough/SKILL.md).
3. **Days 31–60 — Contribute.** Own a small feature or bug area; deepen the mental model of one
   subsystem.
4. **Days 61–90 — Own.** Lead a component and propose an improvement.
5. **Checkpoints.** Define a success signal and a reviewer for each phase.

## Output shape
```
Context: <team / stack / role>   Productive by day <N> = <definition>
Days 1–30  Learn:      read <…> · setup <…> · ask <who> · first PR <small>
Days 31–60 Contribute: own <area> · ship <feature/bug>
Days 61–90 Own:        lead <component> · improve <…>
Checkpoints: 30d <signal> · 60d <signal> · 90d <signal>
```

## Tips
- Ship something tiny in week 1 — momentum and a green build beat perfect understanding.
- Map **people before code**: who owns what, where decisions live, who to ask when stuck.
- Schedule the reading with [`learning-roadmap`](../learning-roadmap/SKILL.md) and build with
  [`project-mentor`](../project-mentor/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
