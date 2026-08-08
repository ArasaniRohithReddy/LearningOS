---
name: tech-debt-coach
description: "Manage technical debt like a portfolio — make it visible, classify it (Fowler's quadrant), quantify its impact in time/risk/dollars, and negotiate paydown against features. Use for 'manage tech debt', 'make the case for refactoring', 'tech debt register', 'how much time on debt', 'prioritize refactors', or 'debt vs features tradeoff'. Pairs with okr-coach and engineering-culture-coach."
argument-hint: "The codebase/roadmap"
---

# Tech Debt Coach

Turn "the code is messy" into a visible, quantified, negotiable backlog — decisions, not vibes —
following [`AGENTS.md`](../../../AGENTS.md). Pairs with [`okr-coach`](../okr-coach/SKILL.md) and [`engineering-culture-coach`](../engineering-culture-coach/SKILL.md).

## When to use

- Debt is slowing delivery and you need to make it visible and win time to pay it down.
- Deciding which refactors are worth it and how to balance them against feature work.

## Procedure

1. **Make it visible:** a debt register — item, where it hurts, and a rough size — so invisible drag
   becomes a list you can prioritize.
2. **Classify with Fowler's quadrant:** deliberate vs. inadvertent × prudent vs. reckless — reckless
   debt gets urgency; prudent-deliberate is a valid, tracked bet.
3. **Quantify the impact,** not the ugliness: hours lost per change, incident/risk, onboarding drag, or
   $ — tie each item to a business cost, not aesthetics.
4. **Prioritize by leverage:** interest rate (how often it bites) × blast radius — pay down what sits on
   the hot path, not what merely annoys.
5. **Negotiate a sustainable budget** (e.g., a fixed % per cycle or a paydown [`OKR`](../okr-coach/SKILL.md)) and frame it as
   *velocity insurance* to stakeholders — outcomes, not "let us refactor".
6. **Prevent new debt:** boy-scout rule, a clear definition of done, and the [`culture`](../engineering-culture-coach/SKILL.md) to log debt
   when it is taken on — track paid vs. added over time.

## Output shape

```
Debt item: <what> — hurts: <hot path / incident / onboarding>
Quadrant: deliberate|inadvertent × prudent|reckless
Cost: <hrs/change · risk · $>   Interest: how often it bites
Plan: pay down / contain / accept — budget: <% or OKR>
Prevent: boy-scout rule · DoD · log-on-take
```

## Tips

- Sell paydown as faster, safer delivery (velocity insurance), not "clean code" for its own sake.
- Not all debt is bad — prudent, deliberate, tracked debt can be the right call; reckless is not.
- Finish with the **Learning Footer** (`AGENTS.md`).
