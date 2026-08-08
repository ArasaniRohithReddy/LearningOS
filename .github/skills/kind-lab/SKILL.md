---
name: kind-lab
description: "Hands-on lab on kind (Kubernetes IN Docker) — build a free, local multi-node cluster with no subscription: create control-plane + worker nodes as Docker containers, load a locally-built image without a registry, deploy, and verify. Use for 'kind lab', 'the test cluster', 'multi-node Kubernetes locally', 'kind create cluster', 'kind load docker-image', or learning Kubernetes/CI clusters by doing. Includes a cluster-cleanup safety note."
argument-hint: "The test cluster"
---

# kind Lab

Learn multi-node Kubernetes by *running the nodes as Docker containers yourself* — free, local, no
subscription — per [`AGENTS.md`](../../../AGENTS.md). Pairs with [k8s-deployment-lab](../k8s-deployment-lab/SKILL.md) and [ci-pipeline-builder](../ci-pipeline-builder/SKILL.md).

## When to use

- The learner needs a throwaway multi-node cluster for practice or CI, with no cloud account.
- Testing manifests across several nodes; compare with [minikube-lab](../minikube-lab/SKILL.md) and [k3d-lab](../k3d-lab/SKILL.md).

## Mental model

- **kind** runs each Kubernetes **node as a Docker container**, so one host can hold a
  *control-plane + workers* cluster. It's ephemeral and scriptable — the standard for Kubernetes' own
  CI — but images you build locally must be *loaded in*, since the nodes can't see your host's images.

## Procedure

1. **Concept & config:** a `kind-config.yaml` lists `nodes:` with `role: control-plane` and
   `role: worker` to shape the topology.
2. **Create the cluster:** `kind create cluster --name lab --config kind-config.yaml`; verify with
   `kubectl get nodes` (kind docs, *Quick Start*, kind.sigs.k8s.io, 2024).
3. **Load an image:** build locally, then `kind load docker-image <img>:<tag> --name lab` so pods pull
   it with `imagePullPolicy: IfNotPresent` — no registry needed.
4. **Deploy & verify:** `kubectl apply -f`, then `kubectl get pods -o wide` to see pods spread across
   worker nodes; `kubectl logs` to confirm.
5. **Clean up:** `kind get clusters`, then ⚠ `kind delete cluster --name lab` removes the cluster and
   its node containers.

## Output shape

```
Cluster: kind "lab" | Nodes: control-plane + N workers (Docker containers)
Config: kind-config.yaml (roles) | Create: kind create cluster --config
Images: kind load docker-image <img> --name lab (no registry)
Deploy: kubectl apply → kubectl get pods -o wide (spread) → logs
Clean: kind delete cluster --name lab (removes nodes)
```

## Tips

- A pod stuck `ErrImagePull` on kind usually means you forgot `kind load` or an `IfNotPresent` policy.
- ⚠ `kind delete cluster` is irreversible — export anything you need (`kubectl get -o yaml`) first.
- End with the **Learning Footer** (`AGENTS.md`) — one worker node to add + one image to load yourself.
