---
name: dependency-audit
description: "Audit a project's dependencies for known vulnerabilities and supply-chain risk — SCA scanning, lockfiles, SBOM, pinning, and provenance — then remediate safely without breaking builds. Use for 'audit my dependencies', 'check for vulnerable packages', 'SCA / npm audit / pip-audit', 'generate an SBOM', or 'supply-chain security review'. Defensive and authorized."
argument-hint: "The project/manifest + ecosystem"
---

# Dependency Audit

Find and fix **risky dependencies** before they ship — defensive, authorized review per
[`AGENTS.md`](../../../AGENTS.md). Addresses OWASP Top 10 A06; complements
[secure-code-review](../secure-code-review/SKILL.md) and [security-hardening-checklist](../security-hardening-checklist/SKILL.md).

## When to use

- The learner wants to check a manifest/lockfile for vulnerable or untrustworthy packages.
- Setting up supply-chain hygiene (SBOM, pinning, provenance) or triaging a scanner's findings.

## What to check (concern → how)

| Concern | Check | Tool / standard |
| --- | --- | --- |
| Known vulns | Scan direct + transitive deps | OSV-Scanner, npm/pip/cargo audit |
| Reproducibility | Commit and honor a lockfile | native lockfiles |
| Inventory | Generate an SBOM | CycloneDX / SPDX |
| Pinning | Pin versions/hashes, avoid ranges | ecosystem pinning |
| Provenance | Verify source/signatures | SLSA, Sigstore |
| Maintenance | Check age, activity, typosquats | manual review |

## Procedure

1. Identify the ecosystem and manifests; confirm the audit is authorized.
2. Run an **SCA** scan of direct **and** transitive dependencies; capture a severity list.
3. Verify each advisory against an official source (OSV/GHSA/NVD) — never act on a fabricated CVE.
4. Remediate by risk: upgrade to a fixed version, or apply a documented mitigation; **test** after.
5. Harden going forward: lockfile, SBOM, pinning, and automated alerts (e.g., Dependabot).
6. Record what was fixed, what's deferred (with reason), and residual risk.

## Output shape

```
Project: <name> | Ecosystem: <npm/pip/…> | Authorized: yes
Findings: <pkg@ver> — <advisory id/severity> → fix: <version/mitigation>
Supply-chain: lockfile ✓ | SBOM ✓ | pinning ✓ | provenance …
Deferred (with reason): … | Residual risk: …
```

## Tips

- Don't blind-bump — read the advisory, upgrade to the fixed version, then run tests.
- Transitive dependencies cause most surprises; scan the full tree, not just direct deps.
- Verify every advisory against official data; end with the **Learning Footer** (`AGENTS.md`).
