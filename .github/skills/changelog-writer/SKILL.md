---
name: changelog-writer
description: "Turn a set of changes or commits into clear release notes or a Keep a Changelog-style changelog — grouped by Added, Changed, Deprecated, Removed, Fixed, and Security, with user-facing entries and clearly flagged breaking changes. Use for 'write release notes', 'generate a changelog', 'summarize these commits for a release', or 'what changed in vX'. Follows Keep a Changelog and SemVer; writes for humans, not commit noise."
argument-hint: "The changes/commits + version"
---

# Changelog Writer

Turn raw changes into release notes a *user* can act on — following [`AGENTS.md`](../../../AGENTS.md).
Pairs with [`adr-writer`](../adr-writer/SKILL.md) and [`readme-generator`](../readme-generator/SKILL.md).

## When to use

- Cutting a release and needing human-readable notes from commits, PRs, or tickets.
- Maintaining a running `CHANGELOG.md` that users and integrators actually read.

## Procedure

1. **Gather the changes:** commits/PRs/tickets since the last release, plus the target version.
2. **Translate to user impact:** rewrite each change from the *reader's* perspective — what they can
   now do or what behavior changed — not the raw commit message. Drop internal-only churn.
3. **Group by Keep a Changelog categories:** **Added, Changed, Deprecated, Removed, Fixed,
   Security** — omit any that are empty.
4. **Flag breaking changes prominently** and map to **SemVer** (a breaking change forces a MAJOR
   bump); include concrete migration notes.
5. **Format the release:** a `## [version] — YYYY-MM-DD` heading, entries **newest-first**, and an
   `Unreleased` section for ongoing work; link compare/diff URLs when available.
6. Cite **Keep a Changelog / SemVer**; keep entries concise, parallel, and consistent.

## Output shape

```
## [<version>] — YYYY-MM-DD
### Added
  - <user-facing capability> (#PR)
### Changed / Deprecated / Removed / Fixed / Security
  - …
⚠ Breaking: <what breaks> → migration: <steps>
[Unreleased]: <ongoing work>
```

## Tips

- Write for humans — impact and intent, not "fix typo" commit noise.
- Breaking changes drive a MAJOR version (SemVer); always give migration steps.
- Finish with the **Learning Footer** (`AGENTS.md`).
