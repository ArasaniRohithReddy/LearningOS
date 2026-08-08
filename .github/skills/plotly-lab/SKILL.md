---
name: plotly-lab
description: "Hands-on lab on Plotly: build interactive charts with Plotly Express (hover, zoom, legend toggle), export to standalone HTML, then wire a minimal local Dash app with a dropdown and a callback — learning by running real code. Use for 'plotly lab', 'hands-on plotly lab', 'interactive charts', 'plotly express', 'write_html', 'basic Dash app', 'dcc.Graph callback', or a guided interactive-visualization exercise. Teaches by doing, honestly."
argument-hint: "The data + interaction"
---

# Plotly Lab

A guided, hands-on lab that builds Plotly fluency — interactive Express charts, then a minimal local Dash
app — per the teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md). Pairs with
[`dashboard-designer`](../dashboard-designer/SKILL.md) and [`streamlit-local-lab`](../streamlit-local-lab/SKILL.md).

## When to use

- The learner wants *interactive* charts (hover/zoom) or a small local dashboard, not static images.
- Before building a data app, to learn the figure-then-callback model behind Dash.

## Procedure

1. **Concept first.** Plotly Express turns a tidy DataFrame into an interactive figure (a JSON spec) in one
   call; `graph_objects` gives fine control. Dash renders those figures and rebuilds them via callbacks
   (plotly.com/python, *Plotly Express*, 2024; dash.plotly.com, *Dash in 20 Minutes*, 2024).
2. **Build a chart.** `import plotly.express as px; fig = px.scatter(df, x="x", y="y", color="grp",
   hover_data=["z"])`.
3. **Interact & export.** Explore hover/zoom/legend-toggle in `fig.show()`; share with
   `fig.write_html("chart.html")` — a standalone file, no server needed.
4. **Minimal Dash.** `from dash import Dash, dcc, html, Input, Output, callback`; lay out a `dcc.Dropdown`
   and a `dcc.Graph`, then a `@callback(Output("g","figure"), Input("dd","value"))` returning a new `fig`.
5. **Run locally.** `app.run(debug=True)` and open `http://127.0.0.1:8050` on your laptop.
6. **Interpret honestly.** Interactivity hides defaults — set the visible axis range and avoid dual y-axes.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Chart: px.scatter(df, x, y, color=, hover_data=[…]) → interactive fig
Export: fig.write_html("chart.html")
Dash layout: dcc.Dropdown(id="dd") + dcc.Graph(id="g")
Callback: @callback(Output("g","figure"), Input("dd","value"))
Run: app.run(debug=True) → 127.0.0.1:8050
Learning Footer
```

## Tips

- Start with Plotly Express; drop to `graph_objects` only when you need control it can't express.
- Interactivity is not honesty: a zoomed-in default range can exaggerate a trend — label the axes.
- Design the view first ([`dashboard-designer`](../dashboard-designer/SKILL.md)) before wiring callbacks.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
