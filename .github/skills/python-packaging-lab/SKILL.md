---
name: python-packaging-lab
description: "Hands-on Python lab on packaging: the pyproject.toml [build-system] and [project] tables, choosing a build backend, building a wheel and sdist with python -m build, entry-point scripts, and publishing to TestPyPI/PyPI with twine. Use for 'teach me Python packaging', 'hands-on packaging lab', 'pyproject.toml explained', 'build a wheel', 'publish to PyPI', or making a pip-installable package."
argument-hint: "The package"
---

# Python Packaging Lab

Learn packaging by shipping a tiny installable project — a guided, hands-on lab following the teaching
principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants a `pip install`-able package, not a loose folder of scripts.
- Teaching distribution for **Coding Mentor** or a Python/backend role-agent.

## Procedure
**Concept (60s):** `pyproject.toml` is the standard project file: `[project]` holds metadata (PEP 621,
2020) and `[build-system]` names the backend that builds it (PEP 517/518, 2016–17).

1. **Layout:** use a `src/` layout — `src/mypkg/__init__.py` with `pyproject.toml` at the repo root.
2. **Metadata:** fill `[project]` — `name`, `version`, `requires-python`, `dependencies` (PEP 621).
3. **Backend:** set `[build-system]` `requires`/`build-backend` (hatchling, setuptools, flit…).
4. **Build:** `python -m build` produces `dist/*.whl` (wheel) plus `*.tar.gz` (sdist).
5. **Publish:** `twine upload` to **TestPyPI** first, verify `pip install`, then real PyPI.

**Reference sketch:**
```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"        # the tool that builds your package

[project]
name = "mypkg"
version = "0.1.0"
dependencies = ["requests>=2"]

[project.scripts]
mypkg = "mypkg.cli:main"                 # creates a `mypkg` command
```
**Pitfalls:** re-uploading a version PyPI already has (bump it first); missing `requires-python`;
a flat layout importing the local dir instead of the installed package; committing API tokens.

## Output shape
```
Concept: pyproject.toml = metadata + build backend → wheel + sdist → upload
Steps 1–5: <what you configured + why>; dist/ contents named
Check: src/ layout? version bumped? tested on TestPyPI first?
```

## Tips
- Read your config like a reviewer with [`code-review-coach`](../code-review-coach/SKILL.md).
- Isolate the build via [`python-venv-lab`](../python-venv-lab/SKILL.md); expose commands with [`python-cli-lab`](../python-cli-lab/SKILL.md).
- Build failing? [`debugging-coach`](../debugging-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
