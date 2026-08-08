---
name: readme-generator
description: "Produce a high-quality project README from the learner's real project details — title, one-line pitch, badges placeholder, features, install, usage/quickstart, configuration, contributing, and license. Use for 'write a README', 'generate a README for my repo', 'document my project', or 'my README is weak'. Asks for missing details; never invents features or commands."
argument-hint: "Project details / repo"
---

# README Generator

Write the front door to a project so a newcomer can grasp and run it in minutes — following
[`AGENTS.md`](../../../AGENTS.md). Pairs with [`documentation-planner`](../documentation-planner/SKILL.md)
and [`technical-writing-coach`](../technical-writing-coach/SKILL.md).

## When to use

- The learner has a real project (or repo) that needs a clear, professional README.
- An existing README is thin, disorganized, or missing a working quickstart.

## Procedure

1. **Gather real details:** name, what it does, who it's for, language/stack, install and run steps,
   and license. **Ask for anything missing** — never invent features, commands, or badges.
2. **Lead with the essentials:** title, a one-line pitch, then a short paragraph on the problem it
   solves. This "above the fold" content is what readers judge first.
3. **Prove it runs:** an **Install** section and a copy-pasteable **quickstart/usage** example that
   actually works — the most-read part of any README.
4. **Fill standard sections:** Features, Configuration (env vars/flags), Contributing, License, plus a
   **badges placeholder** (build, version, license) for the maintainer to wire up.
5. **Make it scannable:** headings, short bullets, fenced code blocks with language tags, and a table
   of contents once it grows long.
6. **Verify** commands and links; hand prose polishing to [`technical-writing-coach`](../technical-writing-coach/SKILL.md).

## Output shape

```
# <Project> — <one-line pitch>
[badges: build ▢ version ▢ license ▢]
## Features        — bullets
## Install         — steps
## Usage           — runnable quickstart (fenced, language-tagged)
## Configuration   — env vars / flags (table)
## Contributing    — how to help
## License         — SPDX id
```

## Tips

- Above the fold = **what + why + quickstart**; push the detail below.
- A copy-pasteable example beats paragraphs of prose. End with the **Learning Footer** (`AGENTS.md`).
