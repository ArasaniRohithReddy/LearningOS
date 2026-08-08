---
name: trivy-scan-lab
description: "Hands-on lab to run Trivy locally as a defensive scanner — find known vulnerabilities (CVEs), misconfigurations, exposed secrets, and license issues in your OWN container images, filesystems, Git repos, and IaC (Terraform/Dockerfile/Kubernetes). Free and open source. Use for 'Trivy lab', 'scan my image for vulnerabilities', 'scan IaC for misconfig', 'local container scanning', or 'add a vuln gate to CI'. Scans assets you own only."
argument-hint: "The image/repo/IaC dir to scan + ecosystem"
---

# Trivy Scan Lab

Learn container and IaC scanning by running **Trivy** against *your own* artifacts locally — a
defensive, authorized lab per [`AGENTS.md`](../../../AGENTS.md). Complements
[dependency-audit](../dependency-audit/SKILL.md) and [security-hardening-checklist](../security-hardening-checklist/SKILL.md).

## When to use

- The learner wants to find CVEs, misconfigs, or leaked secrets in an image, repo, or IaC they own.
- Adding an automated vulnerability/misconfig gate to a local build or CI pipeline.

## What Trivy scans (target → command)

| Target | Command | Finds |
| --- | --- | --- |
| Container image | `trivy image <ref>` | OS + app package CVEs |
| Project files | `trivy fs <dir>` | Lockfile CVEs, secrets |
| Git repo | `trivy repo <url\|dir>` | Deps + secrets across tree |
| IaC / config | `trivy config <dir>` | Terraform/Dockerfile/K8s misconfig |

## Procedure

1. Install Trivy (free/OSS) and confirm you own the target; `trivy --version` to verify the build.
2. **Scan an image:** `trivy image --severity HIGH,CRITICAL <ref>` — start with the highest severities.
3. **Scan source/IaC:** `trivy fs .` for deps+secrets, then `trivy config .` for misconfig (Trivy docs,
   *Scanning → Target* pages, trivy.dev, 2025).
4. Triage: add `--ignore-unfixed` to hide unactionable CVEs; verify each ID against its advisory link.
5. **Gate it:** `--exit-code 1` fails the build on findings; emit `--format sarif`/`--format json` for reports.
6. Remediate (bump base image/dep, fix the config), re-scan, and record deferred items with a reason.

## Output shape

```
Target: <image/dir/repo> | Owned: yes | Scanners: vuln,misconfig,secret
Findings: <CVE/ID — severity — pkg@ver> → fix: <fixed version / config change>
Misconfig: <check id — resource> → remediation
Gate: --exit-code 1 | Report: sarif/json | Deferred (reason): …
```

## Tips

- Pin and refresh the vuln DB in CI; a stale DB misses new CVEs — update before you gate.
- `--ignore-unfixed` cuts noise, but review it: an unfixed CRITICAL may still need a mitigation.
- End with the **Learning Footer** (`AGENTS.md`) — one image to scan + one misconfig to fix yourself.
