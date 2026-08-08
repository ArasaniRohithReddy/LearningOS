---
name: helm-chart-lab
description: "Hands-on lab on Helm — package a Kubernetes app step by step: chart structure, values, templates, then install, upgrade, and rollback a release. Use for 'Helm lab', 'the app to package', 'create a Helm chart', 'templatize my manifests', 'helm upgrade/rollback', or learning Helm by doing. Includes a prod-upgrade safety note."
argument-hint: "The app to package"
---

# Helm Chart Lab

Learn Helm by *packaging a chart and managing a release yourself* — templated, versioned — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [kubernetes-manifest-coach](../kubernetes-manifest-coach/SKILL.md) and [ci-pipeline-builder](../ci-pipeline-builder/SKILL.md).

## When to use

- The learner has raw manifests and wants a reusable, parameterized, versioned package.
- Reinforcing release lifecycle (install/upgrade/rollback) for a **DevOps** role-agent.

## Mental model

- A **chart** is a templated bundle of manifests; **values.yaml** parameterizes the templates; an
  installed instance is a **release** with revision history you can upgrade and roll back.

## Procedure

1. **Scaffold:** `helm create <chart>`; tour `Chart.yaml` (metadata), `values.yaml` (defaults),
   `templates/` (manifests + `_helpers.tpl`), `charts/` (dependencies).
2. **Templatize:** reference `{{ .Values.image.tag }}` and `{{ .Release.Name }}`, factor repeats into
   named helpers via `{{ include }}` (Helm docs, *Chart Template Guide*, helm.sh, 2024).
3. **Render & lint offline:** `helm lint` and `helm template .` to inspect output **before** touching
   a cluster — verify first.
4. **Install:** `helm install <rel> . -f values.yaml [--set key=val]`, then `helm list` / `helm status`.
5. **Upgrade & rollback:** edit values/templates, `helm upgrade <rel> .`; check `helm history <rel>`
   and `helm rollback <rel> <revision>` (Helm docs, *helm upgrade* / *helm rollback*, 2024).
6. ⚠ **Ship safely:** `--dry-run` and diff before prod upgrades; note `helm uninstall` deletes the
   release's resources.

## Output shape

```
Chart: <name> | Structure: Chart.yaml, values.yaml, templates/, charts/
Templating: {{ .Values.* }}, {{ .Release.Name }}, include helpers
Render: helm lint + helm template (verify offline)
Install: helm install <rel> . -f values [--set] | helm list/status
Upgrade: helm upgrade → helm history | Rollback: helm rollback <rel> <rev>
Safety: --dry-run/diff before prod; uninstall removes resources
```

## Tips

- Parameterize only what varies (image, replicas, env); keep sane defaults in `values.yaml`.
- ⚠ Always `--dry-run` and review a diff before upgrading a prod release.
- End with the **Learning Footer** (`AGENTS.md`) — one value to extract + one upgrade to rehearse yourself.
