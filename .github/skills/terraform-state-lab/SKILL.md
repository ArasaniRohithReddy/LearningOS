---
name: terraform-state-lab
description: "Hands-on Terraform lab: understand state end to end — local vs remote backends (S3+DynamoDB, azurerm, gcs), state locking, and detecting/reconciling drift with plan -refresh-only. Use for 'Terraform state lab', 'remote backend', 'state locking', 'terraform drift', 'migrate state', 'Terraform state hands-on lab', or learning how Terraform tracks infrastructure."
argument-hint: "The state need"
---

# Terraform State Lab

Learn state by *inspecting and moving it* — see what Terraform records, put it in a locked remote
backend, then detect drift — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [terraform-module-coach](../terraform-module-coach/SKILL.md) and [ci-pipeline-builder](../ci-pipeline-builder/SKILL.md).

## When to use

- The learner needs safe shared team state, or a plan shows surprising changes (drift).
- Reinforcing backends, locking, and reconciliation for a **DevOps** or platform role-agent.

## Procedure

1. **Concept:** the **state file** maps your config to real resources and caches attributes (including
   secrets), so it is sensitive and authoritative (developer.hashicorp.com/terraform, *State*, 2026).
2. **Inspect local state:** after an apply, run `terraform state list` and `terraform state show <addr>`
   to see tracked resources — never hand-edit `terraform.tfstate`.
3. **Go remote + lock:** configure a `backend` (S3+DynamoDB, `azurerm`, or `gcs`) so state is shared and
   **locked** during writes; `terraform init -migrate-state` moves it (Terraform docs, *Backends* / *State Locking*, 2026).
4. **Simulate drift:** change a resource outside Terraform, then `terraform plan -refresh-only` shows the
   gap between state and reality (Terraform docs, *Manage resource drift*, 2026).
5. **Reconcile:** `apply` to converge, or `terraform state mv`/`rm` to refactor addresses deliberately.
6. ⚠ **Pitfalls & cleanup:** locking prevents corrupt concurrent applies; back up state before surgery,
   keep it out of git, and practice a full S3 backend free against Floci, then `terraform destroy`.

## Output shape

```
Concern: <state need> | Backend: <local|s3+dynamodb|azurerm|gcs>
Inspect: terraform state list / show <addr>   ·   never hand-edit tfstate
Remote: backend + locking  ·  migrate: terraform init -migrate-state
Drift: terraform plan -refresh-only → review gap → apply to converge
Safety: state is sensitive (secrets); back up before state mv/rm  [⚠]
Practice: run the S3 backend on Floci http://localhost:4566
```

## Tips

- Turn on locking before anyone else applies — one unlocked concurrent apply can corrupt state.
- Prefer `-refresh-only` to *see* drift before you let `apply` change anything.
- End with the **Learning Footer** (`AGENTS.md`) — one backend to configure + one drift to reconcile yourself.
