---
name: adr-writer
description: "Write an Architecture Decision Record for a specific decision — context, decision, status, consequences, and the alternatives considered — while teaching what makes an ADR useful. Use for 'write an ADR', 'document this architecture/technical decision', 'record why we chose X', or 'capture this trade-off'. Follows the Nygard/MADR format; captures the why, never just the what."
argument-hint: "The decision + options considered"
---

# ADR Writer

Capture *why* a technical decision was made so future maintainers aren't left guessing — following
[`AGENTS.md`](../../../AGENTS.md). Pairs with [`case-study`](../case-study/SKILL.md) for the trade-off analysis.

## When to use

- The team made (or is about to make) a consequential architecture or technology choice.
- A future reader will ask "why did we do it this way?" and deserve a real answer.

## Procedure

1. **State the decision in one sentence** and give it a number and title (`ADR-000N`). One decision
   per record — split compound choices.
2. **Write the context:** the forces — requirements, constraints, and assumptions — that make this
   decision necessary *and* hard. Keep it neutral and factual.
3. **Record the decision and status** (Proposed / Accepted / Deprecated / Superseded-by). Status makes
   ADRs a living log; **supersede with a new record, never delete or rewrite**.
4. **Spell out consequences** — results good *and* bad, plus the new trade-offs and follow-ups the team
   now lives with. Honesty here is what makes an ADR trustworthy.
5. **List alternatives considered** and why each was rejected — this reasoning is the value future
   readers came for.
6. Keep it short; cite the **Nygard (2011) / MADR** format and save as `adr/000N-title.md`.

## Output shape

```
# ADR-000N: <decision title>
Status: Proposed | Accepted | Superseded by ADR-XXXX (date)
Context: forces, constraints, assumptions …
Decision: we will <choice> because …
Consequences: + <upside> / − <cost> / follow-ups …
Alternatives considered:
  • <option> — rejected because …
```

## Tips

- Capture the **why**; the code already shows the *what*.
- ADRs are immutable history — supersede, don't edit, when a decision changes.
- Finish with the **Learning Footer** (`AGENTS.md`).
