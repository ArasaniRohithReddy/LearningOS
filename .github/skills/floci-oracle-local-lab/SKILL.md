---
name: floci-oracle-local-lab
description: "Hands-on Oracle Cloud (OCI) lab: practice OCI locally and fully offline with the free, open-source Floci OCI emulator — no cloud account, no subscription, no auth token. Run floci/floci-oci on http://localhost:4599, generate a throwaway OCI profile with 'floci oci setup', then point the OCI CLI/SDK/Terraform at it and exercise Object Storage and more. Use for 'learn Oracle Cloud without an account', 'local OCI emulator', 'offline OCI lab', 'Floci Oracle', 'OCI localhost:4599', or practicing Oracle Cloud by doing."
argument-hint: "The OCI service to practice (Object Storage/Streaming/Functions/…)"
---

# Floci Oracle (OCI) Local Lab

Learn **Oracle Cloud Infrastructure** by *running it on your laptop* — boot the emulator, generate a
throwaway profile, aim the OCI CLI/SDK at it, build and verify — no account or bill, per
[`AGENTS.md`](../../../AGENTS.md). Pairs with the sibling
[floci-aws-local-lab](../floci-aws-local-lab/SKILL.md),
[floci-azure-local-lab](../floci-azure-local-lab/SKILL.md), and
[floci-gcp-local-lab](../floci-gcp-local-lab/SKILL.md). Oracle is floci's newest cloud (floci-oci, since
2026-07-28) — *"Oracle Cloud has no official local emulator,"* so this fills a real gap.

## When to use

- The learner wants runnable **Oracle Cloud (OCI)** practice with no account, subscription, or budget.
- Reinforcing hands-on cloud skills offline for an **Oracle/OCI** or **cloud** role-agent.

## Procedure

1. **Concept:** Floci OCI is a free, MIT-licensed (© 2025 Hector Ventura) *local* OCI emulator on a
   single port `4599` — for **learning/dev/testing, not production** (github.com/floci-io/floci-oci, 2026).
2. **Start it** (either the unified CLI or Docker):
   - CLI: `floci oci start && floci oci setup && eval $(floci oci env)`
   - Docker: `docker run --rm -p 4599:4599 -v /var/run/docker.sock:/var/run/docker.sock floci/floci-oci:latest`
     (the Docker socket is only needed for Functions / the Fn Project).
3. **One-time setup (OCI's extra step):** `floci oci setup` generates a throwaway RSA-2048 key and a
   `[FLOCI]` profile in `~/.oci/config` pointing at the local `ocid1.tenancy.oc1..flocilocaltenancy…`
   tenancy and the `floci-local` Object Storage namespace — so the real OCI CLI/SDK authenticates with
   *fake* credentials that never touch Oracle.
4. **Point your tools:** `export OCI_CLI_ENDPOINT=http://localhost:4599` (and `OCI_CLI_PROFILE=FLOCI`,
   `FLOCI_OCI_ENDPOINT=http://localhost:4599`); Terraform's `oci` provider uses the same endpoint override.
5. **Do a small exercise:** create an Object Storage bucket and upload an object with the OCI CLI, then
   list it back — the same command shapes as real OCI.
6. **Verify:** `curl http://localhost:4599/_floci-oci/health` is healthy and your `oci os object list`
   shows the object; fidelity is *approximate*, so cross-check anything surprising in the OCI docs.
7. ⚠ **Clean up:** `floci oci stop` (or `docker rm -f floci-oci`) stops the emulator; the throwaway
   `~/.oci` profile is safe to delete. Nothing costs money.

> Reality check (don't build labs on these): `floci-oci` does **not** implement identity domains, API
> keys/auth tokens, dynamic groups, object versioning, the S3-compatibility API, secret rotation, or
> KMS backup/replication; cross-cloud `snapshot` is AWS-only so far. Stick to core flows.

## Output shape

```
Start:  floci oci start && floci oci setup && eval $(floci oci env)   →  http://localhost:4599 (Floci OCI, MIT)
Point:  OCI CLI/SDK/Terraform  →  OCI_CLI_ENDPOINT=http://localhost:4599 · OCI_CLI_PROFILE=FLOCI
Try:    oci os ns get ; oci os bucket create --name my-bucket ; oci os object put …
Verify: curl :4599/_floci-oci/health · oci os object list --bucket-name my-bucket
Clean:  floci oci stop ⚠
# Docker alternative
docker run --rm -p 4599:4599 -v /var/run/docker.sock:/var/run/docker.sock floci/floci-oci:latest
# env
OCI_CLI_ENDPOINT=http://localhost:4599
FLOCI_OCI_ENDPOINT=http://localhost:4599
OCI_CLI_PROFILE=FLOCI
```

## Tips

- **Let Drona drive it:** once floci is running and the env vars are exported, Drona can generate and
  run OCI CLI commands against your local emulator — floci is "AI-ready" via env vars, **not** an MCP
  server (there is no official floci MCP). See [`docs/Floci.md`](../../../docs/Floci.md) for the full
  setup and an optional community MCP path.
- Fidelity is *approximate* and not production — verify anything real against the official OCI docs
  (floci.io/floci-oci). Uses [floci](https://floci.io), MIT-licensed (© 2025 Hector Ventura); not
  affiliated with LearningOS.
- End with the **Learning Footer** (`AGENTS.md`) — one OCI service to emulate next + one behavior to
  verify against real Oracle Cloud yourself.
