---
name: k8s-configmap-secret-lab
description: "Hands-on lab on Kubernetes ConfigMaps and Secrets — inject config step by step: as env vars vs mounted files, refresh behavior, and the key safety truth that Secret data is base64-encoded, not encrypted. Use for 'ConfigMap Secret lab', 'the config/secret need', 'inject env config', 'mount a config file', 'base64 is not encryption', or learning config injection by doing. Includes a secret-handling safety note."
argument-hint: "The config/secret need"
---

# Kubernetes ConfigMap & Secret Lab

Learn config injection by *wiring a ConfigMap and Secret into a pod yourself* — per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [kubernetes-manifest-coach](../kubernetes-manifest-coach/SKILL.md) and [k8s-deployment-lab](../k8s-deployment-lab/SKILL.md).

## When to use

- The learner must decouple config and credentials from the container image.
- Clearing up the base64-vs-encryption misconception before handling real secrets.

## Mental model

- **ConfigMaps** hold non-sensitive config; **Secrets** hold sensitive values — both keep config out
  of the image. Crucially, Secret data is base64-**encoded**, *not* encrypted.

## Procedure

1. **Create:** `kubectl create configmap app-config --from-literal=k=v` (or `--from-file`) and
   `kubectl create secret generic app-secret --from-literal=k=v`.
2. **Inject as env:** `envFrom:` for a whole map, or `valueFrom.configMapKeyRef`/`secretKeyRef` for
   single keys.
3. **Mount as files:** attach a ConfigMap/Secret **volume** at a path; mounted ConfigMaps update in
   place (with delay), but **env vars need a pod restart** (Kubernetes docs, *ConfigMaps* / *Secrets*,
   kubernetes.io, 2024).
4. **Verify:** `kubectl exec` and print the var/file; `kubectl get secret -o jsonpath` then
   `base64 -d` reveals plaintext — proof it is *not* encryption.
5. ⚠ **Protect:** enable **encryption at rest** (or an external secret store), scope with RBAC, and
   never commit real Secrets to git or place them in a ConfigMap.

## Output shape

```
Need: <config vs secret> | Objects: ConfigMap(v1) + Secret(v1)
Create: kubectl create configmap/secret --from-literal|--from-file
Inject: envFrom / valueFrom.*KeyRef (env) or volumeMount (files)
Refresh: mounted files reload; env vars need pod restart
Verify: kubectl exec → echo $VAR | get secret -o jsonpath | base64 -d ⇒ plaintext
Safety: base64 ≠ encryption; RBAC + encryption-at-rest; never commit secrets
```

## Tips

- base64 is encoding, not security — treat Secret YAML as sensitively as the plaintext itself.
- ⚠ Keep secrets out of git and ConfigMaps; use RBAC and encryption at rest for real credentials.
- End with the **Learning Footer** (`AGENTS.md`) — one value to inject + one secret to protect yourself.
