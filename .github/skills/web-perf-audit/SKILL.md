---
name: web-perf-audit
description: "Audit web performance against Core Web Vitals as a lesson — measure LCP/INP/CLS, find the real bottleneck (JS, images, fonts, network, third parties), and prioritize fixes by impact. Use for 'web performance', 'Core Web Vitals', 'LCP/INP/CLS', 'my site is slow', 'improve page speed', 'Lighthouse', or learning performance."
argument-hint: "The page/app + symptoms"
---

# Web Performance Audit

Audit a page against Core Web Vitals, find the real bottleneck, and prioritize fixes by impact —
teaching the metric behind each finding, per the source discipline and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner has a slow page and wants a structured, measured diagnosis — not guesswork.
- Regression hunting after a release, or pre-launch performance hardening.

## Procedure

1. **Measure first** — capture field data (CrUX) and a lab trace (Lighthouse / DevTools / WebPageTest);
   never optimize on a hunch (web.dev *Core Web Vitals*, 2024).
2. **LCP** — identify the LCP element; fix slow TTFB, render-blocking CSS/JS, unoptimized hero images,
   and late discovery (`preload`, `fetchpriority`). Target ≤ 2.5 s.
3. **INP** — cut long tasks: split/defer JS, minimize main-thread work, lighten event handlers (INP
   replaced FID as a Core Web Vital, Mar 2024). Target ≤ 200 ms.
4. **CLS** — reserve space: set image/video dimensions, avoid injecting content above the fold, tune
   `font-display`. Target ≤ 0.1.
5. **Trace the cost** — attribute bytes/time to JS, images, fonts, third parties, and network; find the
   single top offender.
6. **Prioritize** by impact × effort and **verify** each fix by re-measuring against the targets.

## Output shape

```
Metrics now: LCP <s> | INP <ms> | CLS <n>  (targets 2.5s / 200ms / 0.1)
Bottleneck: <JS | images | fonts | network | third-party>
[High] <finding> — metric → fix → expected gain
[Med]  …
Verify: re-measured LCP/INP/CLS = …
```

## Tips

- Field data reflects real users; lab data is reproducible — use both, they answer different questions.
- Ship the biggest win first; one bloated script often dominates INP.
- Performance also aids SEO (see [seo-optimizer](../seo-optimizer/SKILL.md)); end with the **Learning Footer** (`AGENTS.md`).
