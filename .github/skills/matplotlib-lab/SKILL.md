---
name: matplotlib-lab
description: "Hands-on lab on Matplotlib: create a Figure and Axes with the object-oriented API, draw line/bar/scatter/histogram plots, then customize labels, legends, ticks, and limits — learning by running real code. Use for 'matplotlib lab', 'hands-on matplotlib lab', 'figure vs axes', 'plt.subplots', 'object-oriented matplotlib', 'customize a plot', 'save a figure', or a guided plotting exercise. Teaches by doing, honestly."
argument-hint: "The data + chart to build"
---

# Matplotlib Lab

A guided, hands-on lab that builds Matplotlib fluency by writing real plotting code — Figure/Axes,
plot types, then customization — per the teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md).
Pairs with [`seaborn-lab`](../seaborn-lab/SKILL.md) and [`dashboard-designer`](../dashboard-designer/SKILL.md).

## When to use

- The learner wants to *practice* building and customizing plots, not just copy snippets.
- Before styling libraries, to learn the Figure/Axes engine every Python chart sits on.

## Procedure

1. **Concept first.** A **Figure** is the whole canvas; an **Axes** is one plot with its own x/y, ticks,
   and labels. Prefer the object-oriented `fig, ax = plt.subplots()` over the pyplot global state machine
   (matplotlib.org, *Quick start guide*, 2024; Hunter, *Matplotlib: A 2D Graphics Environment*, CiSE, 2007).
2. **Create the surface.** `import matplotlib.pyplot as plt; fig, ax = plt.subplots(figsize=(6, 4))`.
3. **Exercise — plot types.** Draw with `ax.plot` (trend), `ax.bar` (compare), `ax.scatter` (relationship),
   and `ax.hist(bins=…)` (distribution) — one method per question.
4. **Exercise — customize.** Set `ax.set_xlabel/ax.set_ylabel/ax.set_title`, add `ax.legend()`, fix scale
   with `ax.set_ylim(0, …)`, and try a theme via `plt.style.use(...)`.
5. **Render & save.** `fig.tight_layout(); fig.savefig("chart.png", dpi=150)` then `plt.show()`.
6. **Interpret honestly.** Read what the axes actually say; keep bar baselines at 0 and label units.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Task: … | Data: x, y (units)
Surface: fig, ax = plt.subplots(figsize=(6,4))
Plot: ax.plot | ax.bar | ax.scatter | ax.hist(bins=…)
Customize: set_xlabel/ylabel/title, legend(), set_ylim(0,…)
Save: fig.savefig("chart.png", dpi=150) → plt.show()
Learning Footer
```

## Tips

- Learn the OO API (`ax.…`), not the `plt.…` globals — it scales to subplots and reuse.
- Truncating the y-axis exaggerates change; start bar charts at 0 and state the range.
- Pick the chart from the question ([`dashboard-designer`](../dashboard-designer/SKILL.md)), not from habit.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
