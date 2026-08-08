---
name: k8s-autoscaling-lab
description: "Hands-on lab on Kubernetes autoscaling — build it step by step: set resource requests/limits, install metrics-server, create a Horizontal Pod Autoscaler, then generate load and watch replicas scale. Use for 'HPA lab', 'the scaling need', 'autoscale my Deployment', 'requests vs limits', 'CPU-based scaling', or learning the Horizontal Pod Autoscaler by doing. Includes a max-replicas safety note."
argument-hint: "The scaling need"
---

# Kubernetes Autoscaling Lab

Learn autoscaling by *sizing pods and watching an HPA react to load yourself* — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [kubernetes-manifest-coach](../kubernetes-manifest-coach/SKILL.md) and [observability-plan](../observability-plan/SKILL.md).

## When to use

- The learner's workload has variable load and needs replicas to track demand.
- Reinforcing requests/limits and metrics-driven scaling for a **DevOps** or SRE role-agent.

## Mental model

- **requests** size scheduling and set the HPA baseline; **limits** cap usage. The **HPA** compares a
  metric (e.g. CPU) to a target *percentage of requests* and adjusts replicas between min and max.

## Procedure

1. **Set resources:** add container `requests` (baseline + scheduling) and `limits` (cap) — HPA CPU %
   is measured against **requests**, so get them right first.
2. **Enable metrics:** install **metrics-server**; confirm `kubectl top pods` returns numbers.
3. **Create the HPA:** `kubectl autoscale deployment <name> --cpu-percent=50 --min=2 --max=10`, or an
   `autoscaling/v2` manifest (stable since Kubernetes 1.23, Dec 2021 — Kubernetes docs, *Horizontal
   Pod Autoscaling*, kubernetes.io, 2024).
4. **Observe:** `kubectl get hpa -w`, generate load, and watch replicas scale **up**, then **down**
   after the stabilization window.
5. **Tune:** right-size requests (bad requests ⇒ bad scaling) and set sane min/max targets.
6. ⚠ **Scale safely:** bound `maxReplicas` to protect cluster capacity and budget; run load tests in
   a non-prod namespace, never against prod.

## Output shape

```
Need: <scale on CPU/mem/custom> | Requires: metrics-server
Resources: requests (baseline + schedule) + limits (cap)
HPA(autoscaling/v2): min/max, target = <CPU %> of requests
Create: kubectl autoscale ... --min --max | Observe: kubectl get hpa -w
Behavior: load ↑ → replicas ↑ → stabilize → replicas ↓
Safety: cap maxReplicas (cost/blast radius); load-test in non-prod
```

## Tips

- HPA targets are relative to **requests** — wrong requests make autoscaling over- or under-react.
- ⚠ Always bound `maxReplicas`; a runaway HPA can exhaust cluster capacity and budget.
- End with the **Learning Footer** (`AGENTS.md`) — one request to right-size + one HPA to load-test yourself.
