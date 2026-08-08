---
name: terraform-workspaces-lab
description: "Hands-on Terraform lab: use CLI workspaces for multiple environments — workspace new/select/list, per-workspace state, the terraform.workspace variable, and when to prefer separate backends/directories instead. Use for 'Terraform workspaces lab', 'terraform workspace', 'multiple environments', 'dev vs prod state', 'Terraform workspaces hands-on lab', or learning to separate Terraform environments."
argument-hint: "The environments"
---

# Terraform Workspaces Lab

Learn workspaces by *splitting one config into two states* — create, select, key names off the
workspace, then judge when to stop — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [terraform-module-coach](../terraform-module-coach/SKILL.md) and [ci-pipeline-builder](../ci-pipeline-builder/SKILL.md).

## When to use

- The learner wants dev/staging variants of one config without copying it.
- Reinforcing environment separation and its limits for a **DevOps** or platform role-agent.

## Procedure

1. **Concept:** a **workspace** is a named *state* within one backend and config; you start in `default`
   and each workspace tracks its own resources (developer.hashicorp.com/terraform, *Workspaces*, 2026).
2. **Create & switch:** `terraform workspace new dev`, `terraform workspace list`, then
   `terraform workspace select dev` (Terraform docs, *Command: workspace*, 2026).
3. **Vary by workspace:** read `terraform.workspace` to name/size resources per env (e.g.,
   `"myapp-${terraform.workspace}"`) or pick a per-environment `.tfvars` file.
4. **Plan/apply per workspace:** `plan` then `apply` affects *only* the selected workspace's state — switch
   deliberately and confirm the name before applying.
5. **Know the limit:** the docs advise workspaces for lightweight alternative states, **not** strong
   dev↔prod isolation; use separate backends/directories/credentials for that (Terraform docs, *Workspaces*, 2026).
6. ⚠ **Pitfalls & cleanup:** applying in the wrong workspace hits the wrong env, so verify with
   `terraform workspace show`, practice free against Floci, then `destroy` each workspace.

## Output shape

```
Envs: <dev/staging/prod> from one config | Current: terraform workspace show
Create: terraform workspace new <env> | Switch: select <env> | List: list
Vary: "${terraform.workspace}"-named resources or per-env .tfvars
Apply: plan → apply hits only the selected workspace's state ⚠
Limit: not for strong prod isolation → separate backend/dir/creds
Practice: run against Floci http://localhost:4566
```

## Tips

- Print `terraform workspace show` before every apply — the biggest workspace bug is a wrong-env apply.
- CLI workspaces are not HCP Terraform workspaces, and prod usually deserves its own backend and creds.
- End with the **Learning Footer** (`AGENTS.md`) — one env to create + one resource to key off the workspace yourself.
