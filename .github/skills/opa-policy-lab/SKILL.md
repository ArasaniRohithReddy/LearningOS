---
name: opa-policy-lab
description: "Hands-on lab to run Open Policy Agent (OPA) locally as a defensive policy-as-code engine — write Rego rules, feed them JSON input, and evaluate allow/deny decisions for authorization, Kubernetes admission, and IaC/config checks, with unit tests. Free and open source. Use for 'OPA lab', 'write a Rego policy', 'policy as code', 'evaluate opa eval locally', or 'test my authorization rules'. Local, defensive policy authoring only."
argument-hint: "The decision/policy you want to enforce"
---

# OPA Policy Lab

Learn policy-as-code by writing **Rego** and evaluating it with **Open Policy Agent** locally — a
defensive, authorized lab per [`AGENTS.md`](../../../AGENTS.md). Complements
[security-hardening-checklist](../security-hardening-checklist/SKILL.md) and [threat-model](../threat-model/SKILL.md).

## When to use

- The learner wants to express authz/admission/config rules as testable code, not scattered `if`s.
- Prototyping a deny-by-default decision before wiring OPA into an app, gateway, or CI check.

## Rego mental model

- A `.rego` file declares a `package`; rules return decisions over `input` (+ `data`). Default deny,
  then allow on explicit conditions: `default allow := false` then `allow if { … }` (Rego v1).

## Procedure

1. Install OPA (single free binary); confirm `opa version`.
2. **Write a policy:** `authz.rego` with `package authz`, `default allow := false`, and an `allow if`
   rule over `input` (e.g., request method + user role).
3. **Evaluate:** `opa eval -d authz.rego -i input.json 'data.authz.allow' --format pretty` and read the
   decision (OPA docs, *CLI → opa eval*, openpolicyagent.org, 2025).
4. **Unit test:** add `authz_test.rego` with `test_*` rules; run `opa test .` to catch regressions.
5. Lint/format: `opa fmt -w .` and `opa check .`; use `--fail` in CI to block on empty/undefined results.
6. Iterate on inputs (an allow case and a deny case), confirm both, and keep tests in-repo for reuse.

## Output shape

```
Package: authz | Entrypoint: data.authz.allow | Default: deny
Input: <method/role/resource JSON> → Decision: true|false
Tests: opa test . → <n passed> | Format: opa fmt -w . | Check: opa check .
Gate: opa eval --fail (block undefined/empty) | Deny-by-default: ✓
```

## Tips

- Default deny, then allow explicitly — an empty/undefined result should never mean "permit".
- Test both allow and deny inputs; `opa test` turns policies into regression-safe code.
- End with the **Learning Footer** (`AGENTS.md`) — one rule to write + one deny-case test to add yourself.
