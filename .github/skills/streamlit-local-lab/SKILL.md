---
name: streamlit-local-lab
description: "Hands-on lab building a Streamlit data app locally: understand the top-to-bottom rerun model, add widgets (slider/selectbox) that filter a DataFrame, render a reactive chart, and cache data with @st.cache_data — runs on your laptop, no hosting or account. Use for 'streamlit lab', 'hands-on streamlit lab', 'streamlit run locally', 'streamlit widgets', 'cache_data', 'session_state', 'data app', or a guided local data-app exercise. Teaches by doing, honestly."
argument-hint: "The data app + widgets"
---

# Streamlit Local Lab

A guided, hands-on lab that builds a Streamlit data app **on your laptop** — rerun model, widgets, a
reactive chart, caching — per the teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`plotly-lab`](../plotly-lab/SKILL.md) and [`dashboard-designer`](../dashboard-designer/SKILL.md).

## When to use

- The learner wants an interactive data app locally (free, no deploy) to explore a dataset with widgets.
- To learn the script-rerun mental model before building bigger tools.

## Procedure

1. **Concept first.** Streamlit reruns the **whole script top-to-bottom** on every widget change; each widget
   call returns its current value, and the newest values drive the rendered output
   (docs.streamlit.io, *Basic concepts of Streamlit*, 2024).
2. **Scaffold.** `import streamlit as st`; add `st.title(...)` and load data in a function decorated with
   `@st.cache_data` so it isn't reloaded on every rerun.
3. **Add widgets.** `n = st.slider("rows", 10, 100, 30)` and `cat = st.selectbox("group", options)` return
   Python values; use them to filter the DataFrame.
4. **Render reactively.** Show the filtered data with `st.dataframe(df)` and a chart via `st.line_chart(df)`
   or `st.plotly_chart(fig)` — it updates as the widgets change.
5. **Run locally.** `streamlit run app.py` → open `http://localhost:8501`; edits hot-reload on save.
6. **State honestly.** Persist values across reruns with `st.session_state`; a chart on unvalidated data
   still misleads, so verify the numbers first.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Model: script reruns top-to-bottom on each interaction
Cache: @st.cache_data def load(): …   # avoid reloading
Widgets: st.slider(...) / st.selectbox(...) → Python values
Filter → render: st.dataframe(df) + st.line_chart(df) / st.plotly_chart(fig)
Run: streamlit run app.py → localhost:8501
Learning Footer
```

## Tips

- Cache expensive loads/compute with `@st.cache_data`, or every widget click recomputes everything.
- Reruns reset locals — keep values that must survive in `st.session_state`.
- Design the layout and chart choice first with [`dashboard-designer`](../dashboard-designer/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
