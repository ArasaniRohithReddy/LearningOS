---
name: gradio-local-lab
description: "Hands-on lab building a Gradio demo UI locally: wrap a Python function with gr.Interface, choose typed components (Textbox/Slider/Image/Label), build a custom layout with gr.Blocks and a button event, then launch on localhost — no hosting or account. Use for 'gradio lab', 'hands-on gradio lab', 'gradio interface', 'gr.Blocks', 'ML demo UI', 'launch gradio locally', 'demo.launch()', or a guided local demo-UI exercise. Teaches by doing, honestly."
argument-hint: "The function + demo UI"
---

# Gradio Local Lab

A guided, hands-on lab that wraps a Python function into a web UI **on your laptop** — Interface,
components, Blocks, local launch — per the teach-by-doing principles in [`AGENTS.md`](../../../AGENTS.md).
Pairs with [`streamlit-local-lab`](../streamlit-local-lab/SKILL.md) and [`pandas-lab`](../pandas-lab/SKILL.md).

## When to use

- The learner wants a quick UI to demo a model or function locally (free, no deploy).
- To share an ML prototype's inputs and outputs without writing frontend code.

## Procedure

1. **Concept first.** Gradio wraps any function `fn(inputs) -> outputs` into a web UI: `gr.Interface` maps
   input components to the function's arguments and output components to its return values
   (gradio.app, *Quickstart*, 2024).
2. **Build an Interface.** Define `def predict(text, n): …`, then
   `demo = gr.Interface(fn=predict, inputs=[gr.Textbox(), gr.Slider(1, 10)], outputs=gr.Label())`.
3. **Match components to types.** Choose components for the signature — `gr.Textbox`, `gr.Slider`,
   `gr.Image`, `gr.Dataframe` in; `gr.Label`/`gr.Image` out — the order must match args/returns.
4. **Custom layout.** For multi-step demos use `with gr.Blocks() as demo:` and wire events explicitly,
   e.g. `btn.click(fn=predict, inputs=[tb, sl], outputs=out)`.
5. **Run locally.** `demo.launch()` serves `http://127.0.0.1:7860`; keep `share=False` — no hosting needed.
6. **Interpret honestly.** A demo UI is not a production service; validate inputs and remember a confident
   label can still be wrong — surface scores, not just the top class.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Fn: predict(text, n) -> label
Interface: gr.Interface(fn, inputs=[Textbox, Slider], outputs=Label)
Components: match order to args (in) and returns (out)
Blocks: with gr.Blocks(): … btn.click(fn, inputs, outputs)
Run: demo.launch() → 127.0.0.1:7860 (share=False)
Learning Footer
```

## Tips

- `Interface` input order maps to function args; output order maps to returns — mismatches error or mislabel.
- Reach for `gr.Blocks` when you need layout or multiple events; `Interface` is the fast path.
- Keep `share=False` for local-only work; a `share=True` link is temporary and public.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
