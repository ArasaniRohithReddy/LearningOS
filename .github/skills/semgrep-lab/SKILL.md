---
name: semgrep-lab
description: "Hands-on lab to run Semgrep OSS locally as a defensive static-analysis (SAST) scanner — find security bug patterns, injection, hardcoded secrets, and dangerous API use in your OWN source code, and author custom pattern rules in YAML. Free and open source, no login required. Use for 'Semgrep lab', 'static analysis of my code', 'write a Semgrep rule', 'find insecure patterns locally', or 'add SAST to CI'. Scans code you own only."
argument-hint: "The code/repo to scan + language"
---

# Semgrep Lab

Learn static analysis by scanning *your own* code with **Semgrep OSS** locally and authoring your
first rule — a defensive, authorized lab per [`AGENTS.md`](../../../AGENTS.md). Complements
[secure-code-review](../secure-code-review/SKILL.md) and [threat-model](../threat-model/SKILL.md).

## When to use

- The learner wants to catch injection, secrets, or unsafe-API patterns in code they own.
- Learning to encode a team rule as a reusable Semgrep pattern and gate it locally or in CI.
- Adding a fast, deterministic security check that runs before code review or merge.

## Rule mental model

- A rule matches source *structurally*: `pattern:` with metavariables (`$X`) and `...` ellipsis, refined
  by `pattern-not`, `pattern-inside`, `pattern-either`; each has `id`, `message`, `severity`, `languages`.

## Procedure

1. Install Semgrep OSS (pipx/uv, free) and confirm the code is yours; `semgrep --version` to verify.
2. **Baseline scan:** `semgrep scan --config auto` (or curated packs like `--config p/owasp-top-ten`,
   `p/security-audit`) — the OSS engine runs locally, no account (Semgrep docs, *Quickstart*, docs.semgrep.dev, 2025).
3. Triage findings by severity; confirm each is a real, reachable risk, not a false positive.
4. **Write a rule:** author `rule.yaml` for a pattern you care about, test with `--config ./rule.yaml`.
5. **Gate it:** `--error` exits non-zero on findings; emit `--sarif`/`--json` for reports and review.
6. Fix the code, re-scan to confirm zero, and save custom rules in-repo for reuse.

## Output shape

```
Target: <repo/dir> | Owned: yes | Config: auto / p/owasp-top-ten / ./rule.yaml
Findings: <rule-id — severity — file:line> → why → fix
Custom rule: <id> matches <pattern> (metavars: $X) except <pattern-not>
Gate: --error | Report: sarif/json | False positives triaged: …
```

## Tips

- Start with curated packs, then add a few high-signal custom rules — noisy rules get ignored.
- Semgrep matches syntax, not runtime; pair it with [secure-code-review](../secure-code-review/SKILL.md) for logic/authz flaws.
- End with the **Learning Footer** (`AGENTS.md`) — one pack to run + one rule to write yourself.
