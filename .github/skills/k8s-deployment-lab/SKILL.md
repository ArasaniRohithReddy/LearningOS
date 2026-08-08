---
name: k8s-deployment-lab
description: "Hands-on lab on a Kubernetes Deployment — build one step by step: pods, replicas, label selectors, a rolling update, and a rollback, applying and observing each change with kubectl. Use for 'Kubernetes Deployment lab', 'the app to deploy', 'roll out a new image', 'rolling update', 'roll back a bad deploy', or learning Deployments by doing. Includes a prod-apply safety note."
argument-hint: "The app to deploy"
---

# Kubernetes Deployment Lab

Learn Deployments by *rolling one out and back yourself* — declarative, observable — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [kubernetes-manifest-coach](../kubernetes-manifest-coach/SKILL.md) and [k8s-service-networking-lab](../k8s-service-networking-lab/SKILL.md).

## When to use

- The learner is deploying a stateless app and wants safe rollouts and rollbacks.
- Reinforcing controllers and revision history for a **DevOps** or backend role-agent.

## Mental model

- A **Deployment** (`apps/v1`) manages a **ReplicaSet**, which keeps N **Pods** running. Changing the
  pod template creates a *new* ReplicaSet and records a **revision** you can roll back to.

## Procedure

1. **Author & apply:** minimal Deployment with `replicas`, a `selector` matching pod-template labels,
   and a **pinned** image; `kubectl apply -f deploy.yaml`.
2. **Verify:** `kubectl get deploy,rs,pods` and `kubectl rollout status deployment/<name>` until ready.
3. **Scale:** `kubectl scale deployment/<name> --replicas=4` (or edit + apply); watch pods appear.
4. **Rolling update:** bump the image tag and apply — `RollingUpdate` (`maxSurge`/`maxUnavailable`)
   keeps the app available while pods swap (Kubernetes docs, *Deployments*, kubernetes.io, 2024).
5. **Rollback:** `kubectl rollout history deployment/<name>`, then `kubectl rollout undo
   deployment/<name> [--to-revision=N]`; re-check `rollout status`.
6. ⚠ **Practice safely:** run this in a scratch namespace; `kubectl diff` before any prod apply and
   avoid ad-hoc `kubectl delete deploy` on shared clusters.

## Output shape

```
Workload: <name> | Image: <repo:tag pinned> | Replicas: N
Deployment(apps/v1): selector == pod labels | strategy RollingUpdate(maxSurge/maxUnavailable)
Apply: kubectl apply -f → rollout status
Update: bump image → apply → watch rollout | Scale: kubectl scale --replicas
Rollback: rollout history → rollout undo [--to-revision]
Safety: kubectl diff → scratch namespace (no blind delete)
```

## Tips

- Selector labels must match the pod-template labels, or the Deployment adopts and manages nothing.
- ⚠ Rehearse rollouts *and* rollbacks in a non-prod namespace; review a `kubectl diff` before prod.
- End with the **Learning Footer** (`AGENTS.md`) — one rollout to try + one rollback to rehearse yourself.
