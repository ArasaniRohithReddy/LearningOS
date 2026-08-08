---
name: demo-script
description: "Script a live technical demo end to end — define the win, script a step-by-step happy path with what to say and show, add checkpoints and timing, and prepare fallbacks for when things break. Use for 'demo script', 'plan my live demo', 'walkthrough for my product demo', 'rehearse my demo', or 'what if my demo fails'. Pairs with the Meeting and Presentation Coach."
argument-hint: "What to demo + audience + time"
---

# Demo Script

Plan a live demo that survives contact with reality — following [`AGENTS.md`](../../../AGENTS.md).
Pairs with the **Meeting and Presentation Coach** and [`slide-outline`](../slide-outline/SKILL.md).

## When to use

- The learner is demoing a product, feature, or project live and wants it to go smoothly.
- De-risking a high-stakes walkthrough where a failure would be costly.

## Procedure

1. **Define the win:** the single "wow" moment the audience should remember, tied to their pain.
2. **Set the stage:** prerequisites, seed data, environment, and a clean **reset** procedure; record
   a backup video and capture screenshots in case the live path fails.
3. **Script the happy path** step by step — for each step: what to **say**, what to **show**, and the
   **expected result**. Keep steps small and observable.
4. **Add checkpoints:** verify state before each risky step, and mark known-good save points you can
   jump to if something goes sideways.
5. **Time it:** rehearse on the real machine, note per-step timing, and flag steps you can **skip**
   if you run short.
6. **Plan fallbacks:** for every likely failure point, a plan B (cut to recording, show a
   screenshot, or narrate). Never demo a path you haven't tested end to end.

## Output shape

```
Demo: <what> — <audience>, <time> | The win: …
Setup / reset: … | Backup: recording ▢ screenshots ▢
Steps:
  1. SAY: … | SHOW: … | EXPECT: … | (checkpoint ▢, ~Xs)
Fallbacks: <failure point → plan B>
Cut-if-short: <skippable steps>
```

## Tips

- Rehearse on the exact machine and network you'll use; disable notifications and hide secrets.
- A calm fallback beats a frozen screen — always have the recording one click away.
- Finish with the **Learning Footer** (`AGENTS.md`).
