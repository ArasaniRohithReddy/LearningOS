---
name: k8s-service-networking-lab
description: "Hands-on lab on Kubernetes Services and networking — expose a workload step by step: ClusterIP vs NodePort vs LoadBalancer, in-cluster DNS, endpoints, and Ingress basics, testing each with kubectl. Use for 'Kubernetes Service lab', 'the service exposure', 'expose my app', 'ClusterIP vs NodePort vs LoadBalancer', 'Ingress basics', or 'my Service has no endpoints'. Includes a public-exposure safety note."
argument-hint: "The service exposure"
---

# Kubernetes Service & Networking Lab

Learn Services by *exposing a workload yourself* and watching traffic flow — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [k8s-deployment-lab](../k8s-deployment-lab/SKILL.md) and [kubernetes-manifest-coach](../kubernetes-manifest-coach/SKILL.md).

## When to use

- The learner has pods running and needs stable, load-balanced access to them.
- Clarifying Service types, cluster DNS, and where Ingress fits before production networking.

## Mental model

- Pods are ephemeral with changing IPs; a **Service** gives a stable virtual IP + DNS name and
  load-balances to pods whose labels match its **selector** (the resulting IPs live in *Endpoints*).

## Procedure

1. **Prereq:** a running Deployment ([k8s-deployment-lab](../k8s-deployment-lab/SKILL.md)); create a **ClusterIP** Service via
   `kubectl expose deployment <name> --port 80 --target-port 8080` or a manifest.
2. **Verify DNS:** from a throwaway pod, `kubectl run tmp --rm -it --image=busybox -- wget -qO- <svc>`;
   the name resolves as `<svc>.<namespace>.svc.cluster.local`.
3. **Pick a type:** ClusterIP (in-cluster), **NodePort** (node IP:port for dev), **LoadBalancer**
   (cloud provisions an external IP) — Kubernetes docs, *Service*, kubernetes.io, 2024.
4. **Add Ingress:** an `Ingress` (`networking.k8s.io/v1`) plus a controller routes host/path over one
   entrypoint to Services (Kubernetes docs, *Ingress*, 2024).
5. **Debug:** `kubectl get svc,endpoints` — **empty endpoints** means the selector/labels don't match.
6. ⚠ **Expose safely:** keep internal traffic on ClusterIP; publish via Ingress, not raw NodePort,
   and lock down before using LoadBalancer on shared/prod clusters.

## Output shape

```
Expose: <workload> | Type: <ClusterIP | NodePort | LoadBalancer>
Selector: svc.selector == pod labels | Ports: port → targetPort
DNS: <svc>.<namespace>.svc.cluster.local
Ingress(networking.k8s.io/v1): host/path → service:port (needs a controller)
Debug: kubectl get endpoints (empty ⇒ selector mismatch)
Safety: internal = ClusterIP; public via Ingress, not NodePort
```

## Tips

- A Service with no matching endpoints silently blackholes traffic — check labels first.
- ⚠ NodePort/LoadBalancer widen network exposure; restrict access before shared or prod use.
- End with the **Learning Footer** (`AGENTS.md`) — one Service type to try + one endpoint bug to trace yourself.
