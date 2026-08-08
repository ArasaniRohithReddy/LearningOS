---
name: design-tokens-coach
description: "Define and use design tokens as a lesson — naming, layering, scales (color/space/type), light/dark theming, and wiring them to CSS and components. Use for 'design tokens', 'theming', 'dark mode', 'color/spacing/type scale', 'CSS variables for a design system', 'token naming', or learning design tokens."
argument-hint: "The design system + scope"
---

# Design Tokens Coach

Define design tokens — the named, themeable values behind a UI — and wire them into CSS and components,
teaching the naming and layering that keep them scalable, per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [component-designer](../component-designer/SKILL.md).

## When to use

- The learner is starting or scaling a design system and needs consistent, themeable values.
- Replacing scattered hard-coded hex/spacing with a coherent, theme-ready token set.

## Procedure

1. **Design scales, not one-offs** — build restrained scales for colour, spacing, type, radius, and shadow;
   tokens name *decisions*, not raw values (W3C Design Tokens Community Group format, 2023).
2. **Layer the tokens** — primitive/global (`--blue-500`) → semantic/alias (`--color-action`) →
   component (`--button-bg`); components consume semantic tokens, never primitives.
3. **Name by role, not appearance** — `--color-danger`, not `--color-red`; role names survive rebrands and
   theming.
4. **Theme via the semantic layer** — reassign aliases for light/dark with `:root` / `[data-theme]` /
   `prefers-color-scheme`; primitives stay fixed (MDN *CSS custom properties*, 2024).
5. **Wire to the platform** — expose as CSS custom properties (cascade, runtime theming) or generate
   build-time output with Style Dictionary for multi-platform targets.
6. **Check contrast per theme** — verify semantic colour pairs meet WCAG 1.4.3 in *every* theme, not just
   the default.

## Output shape

```
Scales: color | space | type | radius | shadow
Layers: primitive → semantic → component
Naming: role-based (--color-danger)
Theming: light/dark via <data-theme | prefers-color-scheme>
Wiring: CSS custom properties | Style Dictionary
Contrast: verified per theme ✓
```

## Tips

- A token that names a colour (`--red`) leaks intent; name the job (`--color-danger`) instead.
- Keep primitives few and semantic tokens meaningful — components should never touch raw values.
- Cite the W3C DTCG format and MDN (dated); verify themes with [accessibility-audit](../accessibility-audit/SKILL.md); end with the **Learning Footer** (`AGENTS.md`).
