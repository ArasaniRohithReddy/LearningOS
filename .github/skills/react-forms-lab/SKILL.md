---
name: react-forms-lab
description: "Hands-on React lab on forms — controlled vs uncontrolled inputs, validation, submission with form actions, and accessible error handling — by building a validated, submittable form. Use for 'React forms lab', 'controlled vs uncontrolled', 'form validation', 'useActionState', 'accessible form errors', 'aria-invalid', or practicing forms hands-on."
argument-hint: "The form"
---

# React Forms Lab

Build a form that validates, submits, and reports errors accessibly — teaching the controlled / uncontrolled
trade-off and inclusive error patterns, per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [form-design-coach](../form-design-coach/SKILL.md).

## When to use

- The learner is wiring inputs, validation, and submit logic and wants a clean, accessible baseline.
- Deciding between React-controlled state and letting the DOM own input values.

## Procedure

1. **Frame the concept** — a *controlled* input's value comes from state; an *uncontrolled* one lives in the
   DOM and is read on submit (react.dev, *`<input>`* / *`<form>`*, 2024).
2. **Exercise — start uncontrolled**: build a `<form>` with named fields and read values from `FormData` on
   submit; add a controlled field only where you need live feedback (e.g., a character counter).
3. **Validate** — check on submit (and optionally on blur), build an error map, and gate submit while invalid.
4. **Wire submission** — pass a `<form action>` / `useActionState` for pending and result state instead of
   hand-rolled `isSubmitting` flags (react.dev, *useActionState*, 2024).
5. **Make errors accessible** — associate `<label htmlFor>`, set `aria-invalid`, link the message with
   `aria-describedby`, and move focus to the first error (see [accessibility-audit](../accessibility-audit/SKILL.md)).
6. **Name the pitfalls** — controlling every field by reflex, validating only in state (never on submit),
   color-only error cues, and no focus management.

## Output shape

```
Form: <name> — fields: <a, b, c>
Control: <field> controlled | uncontrolled — because …
Validation: <rule> → error map → submit gated
Submit: action / useActionState → pending / result
A11y: label + aria-invalid + aria-describedby + focus
```

## Tips

- Prefer uncontrolled + `FormData`; reach for controlled only when the UI must react as you type.
- Never signal errors with color alone — pair text and ARIA so assistive tech announces them.
- Keep client state minimal; server data isn't form state ([state-management-coach](../state-management-coach/SKILL.md)); end with the **Learning Footer** (`AGENTS.md`).
