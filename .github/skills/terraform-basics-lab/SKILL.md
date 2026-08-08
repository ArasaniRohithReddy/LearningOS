---
name: terraform-basics-lab
description: "Hands-on Terraform lab: write your first configuration end to end — a provider, one resource, typed input variables and outputs, then terraform init/fmt/validate/plan/apply. Use for 'Terraform basics lab', 'my first Terraform', 'learn terraform plan/apply', 'add a variable and output', 'Terraform hands-on lab', or learning infrastructure as code by doing."
argument-hint: "The infra"
---

# Terraform Basics Lab

Learn Terraform by *building one resource* — declare a provider, plan the diff, apply, then read the
state — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [terraform-module-coach](../terraform-module-coach/SKILL.md) and [floci-aws-local-lab](../floci-aws-local-lab/SKILL.md).

## When to use

- The learner wants a first runnable Terraform config, not just theory.
- Reinforcing declarative IaC and the plan/apply loop for a **DevOps** or cloud role-agent.

## Procedure

1. **Concept:** Terraform is *declarative* — you describe desired state in HCL and it computes the
   changes; **providers** are plugins that call an API (developer.hashicorp.com/terraform, *Providers*, 2026).
2. **Scaffold:** create `versions.tf` (a `terraform { required_providers { … } }` block), `main.tf`
   (the `provider` + one `resource "type" "name" { … }`), `variables.tf`, and `outputs.tf`.
3. **Parameterize:** add `variable "name" { type = string }`, reference it as `var.name`, and expose a
   result with `output "id" { value = … }` (Terraform docs, *Input Variables* / *Output Values*, 2026).
4. **Init & check:** `terraform init` downloads the provider and writes `.terraform.lock.hcl`; then run
   `terraform fmt` and `terraform validate`.
5. **Plan/apply:** `terraform plan` shows the diff — read it, then `terraform apply` provisions and records
   real resources in state (Terraform docs, *Command: plan*, 2026).
6. ⚠ **Pitfalls & cleanup:** never commit secrets or `terraform.tfstate`; `apply`/`destroy` change real
   infra, so practice free against Floci at `http://localhost:4566`, then `terraform destroy`.

## Output shape

```
Goal: <infra> | Provider: <aws|azurerm|…> pinned in versions.tf
Files: main.tf | variables.tf (typed) | outputs.tf | versions.tf
Flow: init → fmt → validate → plan (read diff) → apply → destroy
Var: var.<name>  ·  Output: <exposed id>  ·  State: terraform.tfstate (never commit)
Practice: point the provider at Floci http://localhost:4566  [⚠ apply/destroy = real change]
```

## Tips

- Re-run `plan` until it says "no changes" — a clean plan means your config and state agree.
- Pin `required_version` and provider versions so teammates get an identical plan.
- End with the **Learning Footer** (`AGENTS.md`) — one variable to add + one output to expose yourself.
