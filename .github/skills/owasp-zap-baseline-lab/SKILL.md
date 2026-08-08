---
name: owasp-zap-baseline-lab
description: "Hands-on lab to run the OWASP ZAP baseline scan locally against your OWN authorized web app — a passive, non-intrusive DAST pass that spiders the site and reports missing security headers, insecure cookie flags, and information disclosure without attacking it. Free and open source. Use for 'ZAP baseline lab', 'passive scan my local app', 'DAST for my app', 'check security headers', or 'add ZAP to CI'. Authorized targets you own only — never third parties."
argument-hint: "Your local app URL + auth scope"
---

# OWASP ZAP Baseline Lab

Learn DAST safely by running the **OWASP ZAP** baseline (passive) scan against *your own* running
app — a defensive, authorized lab per [`AGENTS.md`](../../../AGENTS.md). Complements
[threat-model](../threat-model/SKILL.md) and [security-hardening-checklist](../security-hardening-checklist/SKILL.md).

## When to use

- The learner wants a quick, safe security pass over an app they run locally and are authorized to test.
- Catching missing headers, insecure cookies, and info leaks before hardening or a deeper review.
- Learning DAST fundamentals before graduating to authenticated or active scans of your own test env.

## Why baseline is safe

- The baseline spiders for ~1 minute then reports **passive** findings only — it performs *no attacks*,
  so it is safe even against production you own (ZAP docs, *Baseline Scan*, zaproxy.org, 2024).

## Procedure

1. Confirm you own/are authorized on the target; start your app locally (e.g., `http://localhost:8080`).
2. **Run baseline:** in ZAP Desktop (free, no Docker) use the **Automation Framework** baseline plan, or
   run the packaged script `zap-baseline.py -t http://localhost:8080 -r report.html`.
3. Read alerts: WARN by default (headers, cookie flags, CSP, info disclosure); `-J report.json` for CI.
4. Tune noise with a config file: `-g gen.conf` to generate, mark rules IGNORE/FAIL, re-run with `-c`.
5. **Gate it:** `-I` keeps a non-zero exit only on FAILs; wire it to a disposable test instance in CI.
6. Fix findings (add headers, Secure/HttpOnly cookies, tighten CSP), re-scan to confirm they clear.

## Output shape

```
Target: <http://localhost:…> | Authorized: yes | Mode: baseline (passive, no attacks)
Alerts: <name [ruleid]> — WARN/FAIL — <count> → fix (header/cookie/CSP)
Reports: report.html / report.json | Config: gen.conf (IGNORE/FAIL tuned)
Gate: -I (fail on FAIL only) | Residual risk: …
```

## Tips

- Baseline is passive by design; only run active/full scans against disposable environments you own.
- Most findings are fixable in config — set security headers and cookie flags, then re-scan to verify.
- End with the **Learning Footer** (`AGENTS.md`) — one header to add + one alert to tune yourself.
