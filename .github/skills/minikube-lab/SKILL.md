---
name: minikube-lab
description: "Hands-on lab on minikube — spin up a free, local single-node Kubernetes cluster with no subscription: start the cluster, deploy an app, expose it as a Service, and open it in a browser. Use for 'minikube lab', 'the local cluster', 'run Kubernetes locally', 'minikube start', 'expose a service', or learning Kubernetes locally by doing. Includes a resource-cleanup safety note."
argument-hint: "The local cluster"
---

# minikube Lab

Learn Kubernetes by *starting your own free, local cluster* and deploying to it — no cloud, no
subscription — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [kubernetes-manifest-coach](../kubernetes-manifest-coach/SKILL.md) and [k8s-deployment-lab](../k8s-deployment-lab/SKILL.md).

## When to use

- The learner wants a real Kubernetes cluster on one laptop to practice `kubectl`, free of charge.
- Reinforcing core objects before cloud clusters; compare with [kind-lab](../kind-lab/SKILL.md) and [k3d-lab](../k3d-lab/SKILL.md).

## Mental model

- **minikube** runs a *single-node* Kubernetes cluster inside a local VM or container (a **driver**
  such as Docker) — control plane and your workloads share that one node. It sets your `kubectl`
  context, ships add-ons (dashboard, ingress), and tunnels to reach Services.

## Procedure

1. **Concept & prereqs:** pick a **driver** (Docker/Hyper-V/VirtualBox); minikube provisions the node
   and wires your `kubectl` context automatically.
2. **Create the cluster:** `minikube start --driver=docker`; confirm with `minikube status` and
   `kubectl get nodes` (one `Ready` node) (minikube docs, *Get Started!*, minikube.sigs.k8s.io, 2024).
3. **Deploy:** `kubectl create deployment web --image=<pinned>`, then watch `kubectl get pods -w`.
4. **Expose & verify:** `kubectl expose deployment web --type=NodePort --port=8080`, then
   `minikube service web --url` and open the URL (or `kubectl port-forward`).
5. **Clean up:** `kubectl delete deployment,svc web`; `minikube stop` to pause, or ⚠ `minikube delete`
   to remove the cluster and its data.

## Output shape

```
Cluster: minikube (1 node) | Driver: docker | Context: minikube
Create: minikube start → minikube status → kubectl get nodes (Ready)
Deploy: kubectl create deployment → kubectl get pods -w
Expose: kubectl expose (NodePort) → minikube service --url → open
Clean: kubectl delete → minikube stop | minikube delete (removes cluster)
```

## Tips

- One node means no real HA — use it to learn objects, not to model production topology.
- ⚠ `minikube delete` wipes the cluster and its volumes; `stop` only pauses it — prefer `stop` to keep work.
- End with the **Learning Footer** (`AGENTS.md`) — one Service to expose + one add-on to enable yourself.
