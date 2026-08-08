---
name: terraform-provisioners-lab
description: "Hands-on Terraform lab: use provisioners as a last resort — local-exec/remote-exec/file, connection blocks, creation vs destroy-time, on_failure — and the lifecycle meta-argument (create_before_destroy, prevent_destroy, ignore_changes). Use for 'Terraform provisioners lab', 'local-exec/remote-exec', 'terraform lifecycle', 'prevent_destroy', 'Terraform provisioners hands-on lab', or learning Terraform edge cases safely."
argument-hint: "The edge case"
---

# Terraform Provisioners Lab

Learn provisioners by *reaching for the escape hatch last* — try a `local-exec`, feel its downsides,
then master `lifecycle` — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [terraform-module-coach](../terraform-module-coach/SKILL.md) and [floci-aws-local-lab](../floci-aws-local-lab/SKILL.md).

## When to use

- The learner hit something declarative config can't express and is tempted by a script.
- Reinforcing *when not to* and safe replace/destroy control for a **DevOps** role-agent.

## Procedure

1. **Concept:** provisioners run scripts as a **last resort**; prefer provider features, `user_data`/
   cloud-init, or baked images first (developer.hashicorp.com/terraform, *Provisioners: Last Resort*, 2026).
2. **Try local-exec:** attach `provisioner "local-exec" { command = … }` (often to a `terraform_data`
   resource) and watch it run only on create — imperative and unmodeled in the plan.
3. **remote-exec/file:** these need a `connection` block (ssh/winrm); set `on_failure`, and know a failed
   provisioner marks the resource **tainted** for recreation.
4. **Destroy-time:** `when = destroy` runs on teardown — handy but fragile, so keep such steps idempotent.
5. **Prefer lifecycle:** control change safely with `create_before_destroy`, `prevent_destroy`,
   `ignore_changes`, and `replace_triggered_by` (Terraform docs, *The lifecycle Meta-Argument*, 2026).
6. ⚠ **Plan/apply & pitfalls:** provisioners break idempotency, so `plan` then `apply` carefully;
   `prevent_destroy` guards prod, and you can rehearse the loop free against Floci, then `destroy`.

## Output shape

```
Edge case: <what config can't express> | First try: provider feature / user_data
Provisioner: local-exec | remote-exec+connection | file  ·  on_failure=fail|continue
Timing: create-time (default) vs when = destroy  ·  failure → tainted
lifecycle: create_before_destroy | prevent_destroy | ignore_changes | replace_triggered_by
Flow: plan → apply (not idempotent!) → destroy  [⚠ prevent_destroy on prod]
Practice: rehearse against Floci http://localhost:4566
```

## Tips

- If a provider argument or `user_data` can do it, use that — provisioners aren't tracked like real state.
- `prevent_destroy = true` turns an accidental `destroy` into an error instead of data loss.
- End with the **Learning Footer** (`AGENTS.md`) — one provisioner to replace with a provider feature + one `lifecycle` rule to try yourself.
