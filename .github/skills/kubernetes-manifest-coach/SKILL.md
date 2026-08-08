---
name: kubernetes-manifest-coach
description: "Write and critique Kubernetes manifests as a lesson — Deployment, Service, ConfigMap, liveness/readiness/startup probes, resource requests and limits, securityContext, and common misconfigurations. Use for 'write a k8s Deployment', 'review my manifest', 'add probes', 'set resource limits', 'why is my pod CrashLooping', or learning Kubernetes. Includes a prod-apply safety note."
argument-hint: "The workload to deploy or a manifest to review"
---

# Kubernetes Manifest Coach

Write and review manifests by *why each field matters* — resilient, least-privilege workloads — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [dockerfile-coach](../dockerfile-coach/SKILL.md) and [ci-pipeline-builder](../ci-pipeline-builder/SKILL.md).

## When to use

- The learner is deploying a workload to Kubernetes, or wants a manifest reviewed.
- Reinforcing resilience and security defaults for a **DevOps** or backend role-agent.

## Common misconfigurations

| Smell | Risk | Fix |
| --- | --- | --- |
| `image: latest` | unrepeatable rollouts | pin a tag/digest |
| no probes | dead pods still get traffic | add readiness + liveness |
| no requests/limits | eviction, OOMKill, noisy neighbors | set both |
| runs as root | larger blast radius | `runAsNonRoot`, drop caps |

## Procedure

1. **Deployment:** set replicas, matching label selectors, and a pinned image; let the Deployment
   manage rollouts and history.
2. **Probes:** readiness gates traffic, liveness restarts a hung container, startup covers slow boots
   (Kubernetes docs, *Configure Liveness, Readiness and Startup Probes*).
3. **Resources:** requests drive scheduling, limits cap usage — over-limit CPU throttles, over-limit
   memory is OOMKilled.
4. **securityContext:** `runAsNonRoot`, `readOnlyRootFilesystem`, drop Linux capabilities; keep
   secrets in a `Secret`, never a `ConfigMap`.
5. **Service & config:** expose pods via a `Service`; inject config from `ConfigMap`/`Secret`, decoupled from the image.
6. ⚠ **Apply safely:** never `kubectl apply` straight to prod — `kubectl diff` first, roll out to a
   namespace/canary, prefer GitOps/PR review, and avoid ad-hoc `kubectl delete`.

## Output shape

```
Workload: <name> | Image: <repo@digest>
Deployment: replicas, selector==labels, probes, resources, securityContext
Service: <ClusterIP|LB> → targetPort | Config: ConfigMap + Secret
Manifest: <annotated YAML>
Safety: kubectl diff → canary/namespace → GitOps (no blind delete)
```

## Tips

- Probes plus requests/limits are what make a workload resilient — don't ship without them.
- ⚠ Rehearse in a non-prod namespace and review a `kubectl diff` before any prod apply.
- End with the **Learning Footer** (`AGENTS.md`) — one probe to add + one limit to right-size.
