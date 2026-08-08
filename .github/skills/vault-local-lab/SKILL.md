---
name: vault-local-lab
description: "Hands-on lab to run HashiCorp Vault in dev mode locally as a defensive secrets manager — store and read static KV secrets, then generate short-lived dynamic secrets with leases/TTL so credentials stop living in code or env files. Free and open source. Use for 'Vault lab', 'store secrets locally', 'dynamic secrets basics', 'get secrets out of my code', or 'learn secrets management'. Local dev-mode only — never a production pattern."
argument-hint: "The secrets/app you want to manage"
---

# Vault Local Lab

Learn secrets management by running **HashiCorp Vault** in dev mode locally — store static secrets,
then issue dynamic ones — a defensive, authorized lab per [`AGENTS.md`](../../../AGENTS.md). Complements
[secure-code-review](../secure-code-review/SKILL.md) and [security-hardening-checklist](../security-hardening-checklist/SKILL.md).

## When to use

- The learner wants to stop hardcoding secrets and practice KV + dynamic-secret workflows hands-on.
- Prototyping how an app reads secrets from Vault before wiring a real, sealed deployment.

## Dev mode mental model

- `vault server -dev` runs **in-memory, unsealed, over HTTP** with a printed root token — great for
  learning, ⚠ never for production (no persistence, single unseal key, TLS off).

## Procedure

1. Start it: `vault server -dev`, then in a new shell `export VAULT_ADDR=http://127.0.0.1:8200` and set
   `VAULT_TOKEN` to the printed root token; `vault status` to confirm it is unsealed.
2. **Static KV:** `vault kv put secret/myapp db_pass=s3cret`, then `vault kv get secret/myapp` (KV v2 is
   mounted at `secret/` in dev — Vault docs, *Dev server*, developer.hashicorp.com, 2025).
3. **Dynamic secrets:** `vault secrets enable database`, configure a connection + role, then
   `vault read database/creds/<role>` to mint short-lived, auto-expiring credentials.
4. Inspect the **lease**: note its TTL; `vault lease revoke <id>` to kill credentials on demand.
5. Read from an app via env/API, never committing tokens; keep secrets out of code and git.
6. Stop the dev server (data is discarded); note what a real deploy would seal and persist.

## Output shape

```
Server: dev (in-memory, unsealed, HTTP) | Addr: 127.0.0.1:8200 | ⚠ not for prod
Static: secret/myapp → {db_pass} via kv put/get (KV v2)
Dynamic: database/creds/<role> → short-lived cred (lease TTL: <dur>)
Lease: revoke <id> | Secrets in code: none | Teardown: data discarded
```

## Tips

- Dev mode's root token and plain HTTP are for learning only; real Vault is sealed, TLS-only, least-privilege.
- Dynamic secrets beat static ones — short TTLs shrink the blast radius of a leak.
- End with the **Learning Footer** (`AGENTS.md`) — one secret to store + one lease to revoke yourself.
