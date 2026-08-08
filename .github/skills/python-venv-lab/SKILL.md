---
name: python-venv-lab
description: "Hands-on Python lab on virtual environments: creating an isolated env with venv, installing with pip, pinning dependencies via requirements.txt, and reproducing the environment on another machine. Use for 'teach me venv', 'hands-on virtual environment lab', 'pip and requirements.txt', 'reproducible Python setup', 'activate a venv', or isolating a project's dependencies."
argument-hint: "The project setup"
---

# Python Environments Lab

Learn environments by making a project reproducible — a guided, hands-on lab following the teaching
principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner installs packages globally and hits version conflicts between projects.
- Teaching reproducible setups for **Coding Mentor** or any Python role-agent.

## Procedure
**Concept (60s):** a virtual environment is an isolated Python with its own `site-packages`, so each
project pins its own dependencies without touching the system interpreter (PEP 405, 2011).

1. **Create:** `python -m venv .venv` builds an isolated environment in `.venv/`.
2. **Activate:** `.venv\Scripts\Activate.ps1` (Windows) or `source .venv/bin/activate` (Unix).
3. **Install:** `python -m pip install requests`; inspect with `pip list`.
4. **Freeze:** `pip freeze > requirements.txt` captures exact versions.
5. **Reproduce:** on a clean env, `pip install -r requirements.txt`; `deactivate` when done.

**Reference sketch:**
```powershell
python -m venv .venv                       # create an isolated environment
.venv\Scripts\Activate.ps1                 # Windows (Unix: source .venv/bin/activate)
python -m pip install requests             # installs into .venv only
python -m pip freeze > requirements.txt    # pin exact versions
# on a clean machine, reproduce it:
python -m pip install -r requirements.txt
deactivate                                 # leave the environment
```
**Pitfalls:** installing before activating (pollutes system Python); committing `.venv/` (gitignore it);
unpinned deps drifting over time; using a `pip` from a different interpreter; forgetting `deactivate`.

## Output shape
```
Concept: venv = isolated site-packages; requirements.txt = reproducible pin
Steps 1–5: <what you set up + why>; activated prompt + pinned versions
Check: activated before install? .venv gitignored? requirements pinned?
```

## Tips
- Reproducibility is the goal: the same requirements.txt yields the same environment anywhere.
- Package the project via [`python-packaging-lab`](../python-packaging-lab/SKILL.md); drill setups with [`practice-generator`](../practice-generator/SKILL.md).
- Import errors after install? [`debugging-coach`](../debugging-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
