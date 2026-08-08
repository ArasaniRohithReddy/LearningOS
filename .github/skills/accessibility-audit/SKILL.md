---
name: accessibility-audit
description: "Audit a UI against WCAG 2.2 — check semantic HTML, keyboard operability, colour contrast, ARIA use, and visible focus, then report issues by severity with the success criterion and a concrete fix. Use for 'accessibility audit', 'is this accessible', 'WCAG', 'a11y review', 'screen reader / keyboard support', or learning accessible UI."
argument-hint: "UI/component/markup to audit"
---

# Accessibility Audit

Audit an interface so it's usable by **everyone**, mapping each issue to a WCAG 2.2 success criterion
and a fix — following [`AGENTS.md`](../../../AGENTS.md). Teach the principle, not just the patch.

## When to use

- The learner has UI or markup and wants a structured accessibility review with reasons.
- Complementing a general [code-review-coach](../code-review-coach/SKILL.md) pass over front-end code.

## Procedure (WCAG 2.2 — Perceivable, Operable, Understandable, Robust)

1. **Semantics first.** Prefer native elements (`button`, `a`, `label`, headings, landmarks); correct
   structure gives assistive tech meaning for free (SC 1.3.1, 4.1.2).
2. **Keyboard.** Every action works without a mouse, in a logical order, with no traps (SC 2.1.1, 2.1.2).
3. **Visible focus.** The focus indicator is clearly visible and not hidden behind sticky UI
   (SC 2.4.7; 2.4.11 *Focus Not Obscured*, new in 2.2).
4. **Contrast & text.** Text ≥ 4.5:1 (3:1 for large text), never colour alone to convey meaning, and
   targets ≥ 24×24 px (SC 1.4.3, 1.4.1, 2.5.8).
5. **ARIA last.** Use ARIA only to fill gaps native HTML can't — *first rule of ARIA: don't use ARIA* —
   then verify name/role/state and image `alt` text (SC 4.1.2, 1.1.1).
6. **Report by severity** (blocker → minor), each with its criterion, the user impact, and the fix.

## Output shape

```
[Blocker] <issue> — WCAG <SC no.> — affects <who> → fix
[Major]   <issue> — WCAG <SC no.> → fix
[Minor]   <issue> → fix
Keyboard: pass/fail | Focus visible: … | Contrast fails: <ratios>
Already accessible: …
```

## Tips

- Native HTML is the most reliable accessibility "framework" — reach for ARIA only when it isn't enough.
- Source: WCAG 2.2 (W3C Recommendation, Oct 2023) and the ARIA Authoring Practices Guide (APG).
- Combine automated checks with manual keyboard/screen-reader testing; end with the **Learning Footer** (`AGENTS.md`).
