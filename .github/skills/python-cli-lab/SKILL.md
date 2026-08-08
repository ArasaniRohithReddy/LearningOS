---
name: python-cli-lab
description: "Hands-on Python lab on command-line interfaces: argparse (and click), positional arguments vs optional options/flags, type conversion and defaults, subcommands, and auto-generated --help. Use for 'teach me argparse', 'hands-on CLI lab', 'build a command-line tool', 'arguments vs options', 'add subcommands', or turning a script into a real CLI."
argument-hint: "The CLI"
---

# Python CLI Lab

Learn CLIs by turning a script into a real tool — a guided, hands-on lab following the teaching
principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner hand-parses `sys.argv` and wants a proper, self-documenting interface.
- Teaching tool ergonomics for **Coding Mentor** or a Python/backend role-agent.

## Procedure
**Concept (60s):** a parser maps `sys.argv` to values — positional **arguments** (by order) and optional
**options/flags** (by name); `argparse` is stdlib, `click` adds decorators (docs.python.org).

1. **Parser + argument:** `add_argument("name")` defines a required positional.
2. **Options & flags:** `--count` via `add_argument("--count", type=int, default=1)`; flags via `action="store_true"`.
3. **Parse:** `args = parser.parse_args()`, then read `args.name`, `args.count`.
4. **Subcommands:** `add_subparsers()` gives `git`-style verbs, each with its own arguments.
5. **Ergonomics:** `help=`/`description=` yield `--help` for free; return an exit code from `main()`.

**Reference sketch:**
```python
import argparse

p = argparse.ArgumentParser(description="Greet someone")
p.add_argument("name")                          # positional argument
p.add_argument("--count", type=int, default=1)  # option with a value
p.add_argument("--shout", action="store_true")  # boolean flag
args = p.parse_args()

text = f"Hello, {args.name}!"
print((text.upper() if args.shout else text) * args.count)
```
**Pitfalls:** forgetting `type=` (every value stays a string); no sensible `default`; hand-rolling
`sys.argv` instead of a parser; not exiting non-zero on error; positional/optional order confusion.

## Output shape
```
Concept: argv → arguments (positional) + options/flags; subparsers = verbs
Steps 1–5: <what your CLI does + why>; --help output read
Check: types set? defaults sane? subcommands own args? exit code returned?
```

## Tips
- Design for a stranger: clear `--help`, sane defaults, useful error messages.
- Test the parser with [`test-writer`](../test-writer/SKILL.md); go test-first via [`tdd-coach`](../tdd-coach/SKILL.md).
- Args not parsing? [`debugging-coach`](../debugging-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
