---
name: k3d-lab
description: "Hands-on lab on k3d — run Rancher's lightweight k3s Kubernetes in Docker, free and local with no subscription: create a fast cluster, add a built-in local registry, deploy through the load balancer, and verify. Use for 'k3d lab', 'the lightweight cluster', 'k3s in Docker', 'k3d cluster create', 'local registry', or learning lightweight Kubernetes by doing. Includes a cluster-cleanup safety note."
argument-hint: "The lightweight cluster"
---

# k3d Lab

Learn Kubernetes on a *tiny, fast cluster you create yourself* — free, local, no subscription — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [helm-chart-lab](../helm-chart-lab/SKILL.md) and [kubernetes-manifest-coach](../kubernetes-manifest-coach/SKILL.md).

## When to use

- The learner wants the *fastest* local cluster with a built-in registry, on a modest laptop.
- Iterating quickly on manifests/Helm; compare with [minikube-lab](../minikube-lab/SKILL.md) and [kind-lab](../kind-lab/SKILL.md).

## Mental model

- **k3d** wraps **k3s** — a CNCF-certified, lightweight Kubernetes — and runs it in **Docker**
  containers. It starts in seconds, ships a load balancer (Klipper) and Traefik ingress, and can
  create a **local registry** container so you push once and every node pulls from it.

## Procedure

1. **Concept & topology:** choose servers (control plane) plus `--agents N` (workers); k3s bundles
   networking, storage, and ingress for you.
2. **Create the cluster:** `k3d cluster create lab --agents 1 --registry-create lab-registry -p
   "8080:80@loadbalancer"`; verify with `kubectl get nodes` (k3d docs, *Quick Start*, k3d.io, 2024).
3. **Push an image:** tag to the created registry (e.g. `localhost:<port>/app:1`), `docker push`, then
   reference that image in your manifest.
4. **Deploy & verify:** `kubectl apply -f`, then hit `http://localhost:8080` through the load balancer;
   `kubectl get pods` to confirm Ready.
5. **Clean up:** `k3d cluster list`, then ⚠ `k3d cluster delete lab` (also removes the paired registry
   container).

## Output shape

```
Cluster: k3d "lab" (k3s in Docker) | Servers + --agents N
Extras: --registry-create lab-registry | -p 8080:80@loadbalancer
Push: docker tag localhost:<port>/app:1 → docker push
Deploy: kubectl apply → curl localhost:8080 → kubectl get pods
Clean: k3d cluster delete lab (removes cluster + registry)
```

## Tips

- k3s swaps some defaults (Traefik ingress, local-path storage) — expect minor differences from upstream.
- ⚠ `k3d cluster delete` tears down nodes *and* the local registry — re-push images after recreating.
- End with the **Learning Footer** (`AGENTS.md`) — one agent node to add + one image to push yourself.
