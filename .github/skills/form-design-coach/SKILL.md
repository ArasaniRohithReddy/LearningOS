---
name: form-design-coach
description: "Design robust web forms as a lesson — labels, the right input types, accessible inline validation, clear error messages, and forgiving submission UX. Use for 'form design', 'form validation', 'accessible forms', 'inline validation', 'error messages', 'which input type', 'form UX', or learning to build forms."
argument-hint: "The form + fields"
---

# Form Design Coach

Design a form that's easy to complete and hard to get wrong — labels, the right input types, accessible
inline validation, and forgiving submission — teaching why each choice cuts errors, per the teach-first
approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[accessibility-audit](../accessibility-audit/SKILL.md).

## When to use

- The learner is building a form and wants low friction, accurate input, and accessible validation.
- Fixing a form with high abandonment, confusing errors, or lost input on failure.

## Procedure

1. **One thing per field, labelled** — a visible `<label for>` (never placeholder-as-label); group related
   fields with `<fieldset>`/`<legend>` (MDN *Forms*, 2024; SC 3.3.2).
2. **Pick the right input type** — `type=email/tel/number/date`, plus `inputmode` and `autocomplete` tokens
   for faster, less error-prone entry (WHATWG HTML autofill; SC 1.3.5).
3. **Validate accessibly, in-line** — native constraints first (`required`, `pattern`, `type`); tie errors
   to the field with `aria-describedby` + `aria-invalid`, announced politely (SC 3.3.1, 4.1.3).
4. **Write helpful errors** — say what's wrong *and* how to fix it, in text, never colour alone, and keep
   the user's input (SC 3.3.3, 1.4.1).
5. **Validate at the right time** — on blur/submit, not every keystroke; re-validate live only once a field
   is already invalid (Nielsen Norman Group, *inline validation*).
6. **Harden submission** — prevent double submit, show progress, confirm success, recover from errors
   without data loss, and validate on the server too.

## Output shape

```
Fields: <name> → type + autocomplete + visible label
Validation: native constraints + inline strategy
Errors: aria-describedby/aria-invalid; message = problem + fix
Timing: <blur | submit | live-after-invalid>
Submit UX: progress | success | error recovery
A11y: labels ✓ | announced ✓
```

## Tips

- Placeholders are not labels — they vanish on input and fail contrast and memory.
- Prefer native constraint validation; add JS only for rules HTML can't express (and mirror on the server).
- Cite MDN/WCAG (dated); verify with [accessibility-audit](../accessibility-audit/SKILL.md); end with the **Learning Footer** (`AGENTS.md`).
