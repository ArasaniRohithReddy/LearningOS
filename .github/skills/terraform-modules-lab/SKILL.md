---
name: terraform-modules-lab
description: "Hands-on Terraform lab: author and call a reusable module — child vs root modules, typed inputs and outputs, source paths, version pinning, and reuse across environments. Use for 'Terraform module lab', 'write a module', 'call a module', 'module inputs/outputs', 'reuse Terraform', 'Terraform module hands-on lab', or learning to factor IaC into modules."
argument-hint: "The module"
---

# Terraform Modules Lab

Learn modules by *extracting one* — pull resources into a child module, wire inputs and outputs, then
call it twice — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [terraform-module-coach](../terraform-module-coach/SKILL.md) and [floci-aws-local-lab](../floci-aws-local-lab/SKILL.md).

## When to use

- The learner has copy-pasted resources and wants to factor them into a reusable unit.
- Reinforcing DRY, composable IaC for a **DevOps**, platform, or cloud role-agent.

## Procedure

1. **Concept:** every config has a **root module**; a **child module** is a folder of resources used
   together and called via a `module` block (developer.hashicorp.com/terraform, *Modules*, 2026).
2. **Author it:** in `modules/<name>/` add `main.tf`, `variables.tf`, `outputs.tf`, `versions.tf` — one
   module, one purpose (Terraform docs, *Standard Module Structure*, 2026).
3. **Define the interface:** type and `description` each input `variable`, and expose only the `output`
   values callers need — keep internals hidden.
4. **Call it:** `module "app" { source = "./modules/<name>" … }`, reference `module.app.<output>`, then
   `terraform init` to install it (Terraform docs, *Module Blocks*, 2026).
5. **Reuse:** call the same `source` again with different inputs (e.g., dev vs prod sizing), and pin a
   `version` for registry/git sources so plans stay reproducible.
6. ⚠ **Plan/apply & pitfalls:** `plan` to see the composed diff before `apply`; avoid giant "kitchen-sink"
   modules, and rehearse the whole loop free against Floci, then `terraform destroy`.

## Output shape

```
Module: <name> | Purpose: <one thing> | Source: ./modules/<name>
Interface: inputs (typed vars) → outputs (only what callers need)
Call: module "app" { source … } → module.app.<output>
Reuse: same source, different inputs (dev/prod) | version pinned
Flow: init (installs module) → plan (composed diff) → apply → destroy ⚠
Practice: apply against Floci http://localhost:4566
```

## Tips

- A good module hides *how* and exposes *what* — few, well-named inputs and outputs.
- Version-pin registry/git modules; an unpinned `source` can change your plan without warning.
- End with the **Learning Footer** (`AGENTS.md`) — one input to type + one output to expose yourself.
