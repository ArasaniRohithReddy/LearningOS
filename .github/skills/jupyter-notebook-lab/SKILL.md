---
name: jupyter-notebook-lab
description: "Hands-on lab on running Jupyter locally: notebooks, kernels, and reproducible analysis in JupyterLab with no subscription. Use for 'Jupyter lab', 'run notebooks locally', 'kernel vs notebook', 'Restart and Run All', 'reproducible notebook', 'ipynb', or learning notebook-based analysis by doing — free and offline."
argument-hint: "The notebook/analysis"
---

# Jupyter Notebook Lab

A hands-on lab that teaches notebooks by *running one locally* — kernels, cells, and reproducible
top-to-bottom execution — following the teach-by-doing principles in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [`pandas-lab`](../pandas-lab/SKILL.md),
[`dataset-explorer`](../dataset-explorer/SKILL.md), and [`python-venv-lab`](../python-venv-lab/SKILL.md).

## When to use

- The learner wants to run notebooks locally for exploratory, reproducible analysis with inline output.
- Understanding how kernels, cell execution order, and the `.ipynb` document actually work.

## Mental model

- A notebook (`.ipynb`, JSON) is a sequence of **cells** (code/markdown) executed by a **kernel** — a
  language process (IPython for Python) that holds state *independent of cell order on screen*.

## Procedure

1. **Concept first.** Separate the *document* (`.ipynb`) from the *kernel* (the live process running your code).
2. **Install & run locally (free/OSS).** `pip install jupyterlab`; run `jupyter lab`, which opens
   `http://localhost:8888` in your browser (JupyterLab docs, jupyterlab.readthedocs.io, 2024).
3. **Exercise — cells & kernels.** Add code + markdown cells, run with Shift+Enter, list runtimes via `jupyter kernelspec list`.
4. **Exercise — reproducibility.** Register an isolated env kernel with
   `python -m ipykernel install --user --name myenv`, then **Kernel → Restart Kernel and Run All Cells**
   to prove the notebook runs clean top-to-bottom (out-of-order runs hide bugs).
5. **Export & verify.** `jupyter nbconvert --to script nb.ipynb` (or `--execute`) for a diff-friendly,
   re-runnable artifact.
6. **Verify.** A fresh Restart-and-Run-All finishes with no `NameError`; the committed notebook re-executes.
7. **Pitfalls & Learning Footer.** Name the traps, then close with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Notebook: nb.ipynb | Server: jupyter lab @ localhost:8888 (local, no subscription)
Kernel: <env> (kernelspec) | Cells: code + markdown
Reproduce: Restart Kernel & Run All → no NameError
Export: nbconvert --to script / --execute
Verify: clean top-to-bottom run
Learning Footer
```

## Tips

- Hidden state bites: a passing notebook can still fail on Restart-and-Run-All — re-run clean before sharing.
- One kernel per project env (venv/conda) via `ipykernel`; don't install packages into the base kernel.
- Clear bulky outputs before committing; `.ipynb` JSON diffs are noisy — nbconvert/jupytext help.
- End with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
