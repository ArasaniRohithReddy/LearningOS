---
name: terraform-import-lab
description: "Hands-on Terraform lab: bring existing (click-ops) resources under management — the import block vs terraform import CLI, finding resource IDs, generating configuration, and reconciling until plan is clean. Use for 'Terraform import lab', 'import existing resource', 'terraform import block', 'generate-config-out', 'reconcile state', 'Terraform import hands-on lab', or adopting existing infrastructure into IaC."
argument-hint: "The existing infra"
---

# Terraform Import Lab

Learn import by *adopting a resource you clicked into existence* — target it, pull it into state, then
plan to a clean diff — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [terraform-module-coach](../terraform-module-coach/SKILL.md) and [floci-aws-local-lab](../floci-aws-local-lab/SKILL.md).

## When to use

- The learner has infra created by hand/console and wants Terraform to manage it.
- Reinforcing state reconciliation and safe adoption for a **DevOps** or platform role-agent.

## Procedure

1. **Concept:** import maps an *existing* real resource to a Terraform address in **state**; it does not
   write your config for you (developer.hashicorp.com/terraform, *Import*, 2026).
2. **Find the target:** get the provider's resource **ID** (e.g., an instance or bucket id) and choose the
   address `type.name` it should occupy.
3. **Config-driven import:** add an `import { to = aws_s3_bucket.app, id = "<id>" }` block and run
   `terraform plan -generate-config-out=gen.tf` to scaffold config (Terraform docs, *Generating Configuration*, 2026).
4. **Or CLI import:** `terraform import <address> <id>` writes state only — you then hand-author matching
   config (Terraform docs, *Command: import*, 2026).
5. **Reconcile:** re-run `terraform plan` and edit config until it reports **no changes** — a clean plan
   proves config and reality now agree; confirm with `terraform state list`.
6. ⚠ **Apply & pitfalls:** import never creates/deletes, but a wrong `id` or drift can surprise you, so
   review every diff, remove the `import` block after, and rehearse free against Floci.

## Output shape

```
Existing infra: <resource> | ID: <provider id> → address type.name
Adopt: import { to = <addr>, id = "<id>" } + plan -generate-config-out=gen.tf
Or CLI: terraform import <addr> <id>  (state only; write config by hand)
Reconcile: terraform plan → edit config → "no changes"  ·  confirm state list
Safety: import mutates state, not infra; back up state first  [⚠ verify diff]
Practice: create then import a resource on Floci http://localhost:4566
```

## Tips

- Aim for a **no-op plan** after import — any diff means your config doesn't match reality yet.
- The `import` block is plan-visible and reviewable in PRs; prefer it over the older CLI command.
- End with the **Learning Footer** (`AGENTS.md`) — one resource to import + one diff to reconcile to zero yourself.
