---
name: seaborn-lab
description: "Hands-on lab on Seaborn: set a theme, plot distributions (histplot/kdeplot/ecdfplot) and statistical views (boxplot/violinplot/regplot), and map categories with hue and facets on tidy DataFrames — learning by running real code. Use for 'seaborn lab', 'hands-on seaborn lab', 'statistical plots', 'distribution plot', 'kdeplot bandwidth', 'boxplot by group', 'hue/col facets', or a guided statistical-plotting exercise. Teaches by doing, honestly."
argument-hint: "The DataFrame + question"
---

# Seaborn Lab

A guided, hands-on lab that builds Seaborn fluency on tidy DataFrames — theme, distributions, statistical
plots, and faceting — per the teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`matplotlib-lab`](../matplotlib-lab/SKILL.md) and [`dataset-explorer`](../dataset-explorer/SKILL.md).

## When to use

- The learner wants *statistical* plots from a DataFrame with minimal code, not manual Matplotlib.
- During EDA, to see distributions, group differences, and relationships quickly.

## Procedure

1. **Concept first.** Seaborn is a statistical layer over Matplotlib that maps **tidy** (long-form) DataFrame
   columns to visual roles. Figure-level `displot/relplot/catplot` return a `FacetGrid`; axes-level
   `histplot/boxplot/regplot` draw on one Axes (seaborn.pydata.org, *An introduction to seaborn*, 2021).
2. **Theme & data.** `import seaborn as sns; sns.set_theme(style="whitegrid")`; load a long-form DataFrame.
3. **Exercise — distributions.** Compare `sns.histplot`, `sns.kdeplot`, and `sns.ecdfplot` on one column;
   watch how `bins` and KDE `bw_adjust` change the story.
4. **Exercise — statistical.** Show group differences with `sns.boxplot`/`sns.violinplot(x=cat, y=val)` and
   a trend with `sns.regplot`/`sns.lmplot` (confidence band included).
5. **Exercise — semantics.** Split by category with `hue=`, `col=`, or `row=` to facet small multiples.
6. **Interpret honestly.** A KDE can invent smooth density in empty regions; report `bw_adjust` and prefer
   `ecdfplot`/histogram when the sample is small.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Data: tidy/long DataFrame (one row per observation)
Theme: sns.set_theme(style="whitegrid")
Distribution: histplot | kdeplot(bw_adjust=…) | ecdfplot
Statistical: boxplot/violinplot(x=cat, y=val) | regplot(x, y)
Facet: hue= / col= / row=  → small multiples
Learning Footer
```

## Tips

- Reshape to long form (`pd.melt`) first — seaborn expects tidy data, one observation per row.
- A KDE's shape depends on bandwidth; a smooth curve is a choice, not a fact about the data.
- Seaborn returns Matplotlib objects — fine-tune them with [`matplotlib-lab`](../matplotlib-lab/SKILL.md) skills.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
