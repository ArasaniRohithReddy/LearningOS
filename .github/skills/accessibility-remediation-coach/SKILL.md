---
name: accessibility-remediation-coach
description: "Fix the accessibility issues an audit found — prioritize by user impact, apply the right semantic/ARIA/focus fix, and verify — teaching the pattern. Use for 'fix accessibility issues', 'a11y remediation', 'remediate WCAG failures', 'how do I fix this a11y bug', 'apply the right ARIA fix', 'fix keyboard/focus', or learning to remediate accessibility."
argument-hint: "The audit findings or component"
---

# Accessibility Remediation Coach

Fix the issues an audit surfaced — prioritizing by user impact and applying the right
semantic/ARIA/focus fix — teaching the pattern so the next one is obvious, per the source discipline
and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[accessibility-audit](../accessibility-audit/SKILL.md), which finds them.

## When to use

- The learner has audit findings (or a broken component) and needs to fix them correctly, not paper over them.
- Turning a list of WCAG failures into durable fixes plus a rule they can reuse.

## Procedure (WCAG 2.2)

1. **Triage by impact** — order fixes by who is blocked and how badly (screen-reader/keyboard blockers
   first), not by which is easiest to type.
2. **Prefer a semantic fix over ARIA** — swap `div`/`span` for native `button`, `a`, `label`, headings,
   landmarks; *the first rule of ARIA is don't use ARIA* (SC 1.3.1, 4.1.2; ARIA APG).
3. **Fix name/role/state** — give an accessible name (`label`/`aria-labelledby`), the correct role, and
   reflect state (`aria-expanded`, `aria-checked`) (SC 4.1.2).
4. **Restore keyboard & focus** — make it operable, manage focus on dialog/route changes, no traps, and a
   visible indicator (SC 2.1.1, 2.4.7; 2.4.11 *Focus Not Obscured*, new in 2.2).
5. **Fix perceivable defects** — contrast ≥ 4.5:1, real `alt` text, never colour alone, targets ≥ 24×24 px
   (SC 1.4.3, 1.1.1, 2.5.8).
6. **Verify each fix** — re-test with keyboard and a screen reader (NVDA/VoiceOver) plus automated tooling;
   confirm the criterion now passes.

## Output shape

```
Fix queue (by impact): [Blocker] <issue> → WCAG <SC> → fix
Semantic-first: <div→button, span→label, …>
Name/role/state: <before → after>
Keyboard/focus: <fix + focus management>
Verified: keyboard ✓ | screen reader ✓ | automated ✓
Pattern learned: <reusable rule>
```

## Tips

- The best ARIA is often no ARIA — a native element ships name, role, state, and keyboard for free.
- Fix the pattern, not the instance: one bad component usually repeats site-wide.
- Cite WCAG 2.2 (W3C Rec, Oct 2023) and the ARIA APG; re-run [accessibility-audit](../accessibility-audit/SKILL.md); end with the **Learning Footer** (`AGENTS.md`).
