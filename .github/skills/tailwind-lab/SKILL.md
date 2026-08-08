---
name: tailwind-lab
description: "Hands-on Tailwind CSS lab — utility-first classes, responsive breakpoint prefixes, state variants, and theme customization — by styling one small UI. Use for 'Tailwind basics', 'utility classes', 'responsive design', 'sm/md/lg breakpoints', 'hover/focus variants', '@theme customization', or practicing Tailwind hands-on."
argument-hint: "The UI"
---

# Tailwind CSS Lab

Learn Tailwind by styling one small UI with utilities and watching responsive and state variants shape it —
teaching the *why* and the trade-offs, per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [css-layout-coach](../css-layout-coach/SKILL.md).

## When to use

- The learner wants hands-on practice composing utilities instead of writing custom CSS.
- Building a responsive component or wiring brand tokens into the theme.

## Procedure

1. **Frame the concept** — Tailwind is utility-first: compose single-purpose classes (`p-4 flex text-center`)
   in markup, and unused ones are stripped at build (tailwindcss.com, *Styling with utility classes*, 2025).
2. **Exercise — build a card**: stack `flex flex-col gap-4 p-6 rounded-lg bg-white shadow`; size text with
   `text-lg font-semibold`; confirm each class maps to one CSS property.
3. **Go responsive** — Tailwind is mobile-first, so add breakpoint prefixes and `w-full md:w-1/2 lg:w-1/3`
   overrides upward (`md`=768px, `lg`=1024px) (tailwindcss.com, *Responsive design*, 2025).
4. **Add state variants** — express interaction inline with `hover:bg-blue-600 focus:ring dark:bg-slate-800`;
   verify each variant only applies in its own state.
5. **Customize the theme** — define tokens with `@theme { --color-brand: #1da1f2 }`, which generates
   `bg-brand`/`text-brand` utilities (tailwindcss.com, *Theme*, 2025); verify the new class renders.
6. **Name the pitfalls** — dynamic class strings the compiler can't see, duplicating a pattern instead of
   extracting a component, and arbitrary values where a token belongs.

## Output shape

```
Base: <flex/grid + spacing + color utilities>
Responsive: <base> md:<...> lg:<...>   (mobile-first)
Variants: hover:<...> focus:<...> dark:<...>
Theme: @theme { --color-brand: <hex> } → bg-brand
Fix: <pitfall> → <correction>
```

## Tips

- Write class names literally — the compiler can't see `bg-${color}`; map states to variants.
- Repeating a long class list? Extract a component (pair [component-designer](../component-designer/SKILL.md)).
- Reach for the theme before arbitrary values; end with the **Learning Footer** (`AGENTS.md`).
