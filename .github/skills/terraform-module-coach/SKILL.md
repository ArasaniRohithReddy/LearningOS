---
name: terraform-module-coach
description: "Structure reusable Terraform as a lesson — modules, input variables and outputs, remote state and locking, provider and version pinning, and plan/apply discipline — with a small module sketch. Use for 'write a Terraform module', 'review my Terraform', 'structure my IaC', 'manage remote state', 'terraform plan/apply help', or learning infrastructure as code."
argument-hint: "The infra to provision or code to review"
---

# Terraform Module Coach

Structure IaC by *why each file and boundary exists* — reusable, reviewable, safe-to-apply — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [ci-pipeline-builder](../ci-pipeline-builder/SKILL.md) and [runbook-writer](../runbook-writer/SKILL.md).

## When to use

- The learner is provisioning cloud infra or wants Terraform code reviewed/refactored.
- Reinforcing IaC discipline for a **DevOps**, platform, or cloud role-agent.

## Mental model

- Terraform declares **desired state**; the **state file** maps your config to real resources. A module
  is a reusable function: inputs are `variables`, results are `outputs` — internals stay hidden.

## Procedure

1. **Module layout:** split `main.tf`, `variables.tf`, `outputs.tf`, `versions.tf`; one module = one
   purpose, composed by a thin root (Terraform docs, *Standard Module Structure*).
2. **Variables & outputs:** type every variable, add `description` and `validation`, and expose only the
   outputs callers need — not internal resource attributes.
3. **Remote state & locking:** use a shared backend with locking (e.g., S3+DynamoDB, `azurerm`); never
   commit state — it holds resource data and secrets (Terraform docs, *State*).
4. **Providers & versions:** pin `required_version` and provider constraints, and commit the
   `.terraform.lock.hcl` so plans are reproducible.
5. ⚠ **plan/apply discipline:** always `plan` and read the diff before `apply`; `apply`/`destroy` change
   real infra — separate envs via workspaces/dirs and gate prod behind review.

## Output shape

```
Module: <name> | Purpose: <one thing>
Files: main.tf | variables.tf (typed+validated) | outputs.tf | versions.tf
State: <backend> + locking (never committed)
Providers: pinned + lock file committed
Flow: fmt → validate → plan (review diff) → apply  [⚠ destroy = data loss]
Sketch: <annotated module + example usage>
```

## Tips

- Small, single-purpose modules compose better than one giant module with dozens of toggles.
- ⚠ Treat state as sensitive; back it up and never edit it by hand — always `plan` before `apply`.
- End with the **Learning Footer** (`AGENTS.md`) — one variable to validate + one output to expose.
