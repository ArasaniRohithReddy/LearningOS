# Practice cloud locally & free — with floci

[floci](https://floci.io) is a **free, open-source (MIT) suite of local cloud emulators** for **AWS,
Azure, GCP, and Oracle Cloud (OCI)**. It runs the real cloud wire protocols on your own machine, so the
official SDKs, CLIs, and Terraform/OpenTofu work unchanged against `localhost` — **no account, no
subscription, no API key, no auth token**. It's a drop-in replacement for LocalStack Community (same AWS
port `4566`).

LearningOS uses floci so learners can *do* cloud — not just read about it — for free. Four hands-on
skills drive it:

- [`/floci-aws-local-lab`](../.github/skills/floci-aws-local-lab/SKILL.md) — AWS
- [`/floci-azure-local-lab`](../.github/skills/floci-azure-local-lab/SKILL.md) — Azure
- [`/floci-gcp-local-lab`](../.github/skills/floci-gcp-local-lab/SKILL.md) — GCP
- [`/floci-oracle-local-lab`](../.github/skills/floci-oracle-local-lab/SKILL.md) — Oracle Cloud (OCI) — floci's newest cloud (since 2026-07-28)

> **License & attribution.** floci is MIT-licensed (© 2025 Hector Ventura) and the project explicitly
> invites *"fork it, embed it, extend it."* LearningOS ships **only documentation and configuration**
> (no floci code), so no notice is required — but as good practice: *Uses [floci](https://floci.io),
> MIT-licensed local cloud emulators (© 2025 Hector Ventura). Not affiliated with LearningOS/Drona.*

## Install

```sh
brew install floci-io/floci/floci                                # macOS/Linux (Homebrew)
```
```powershell
scoop bucket add floci https://github.com/floci-io/scoop-floci    # Windows (Scoop) — add the bucket first
scoop install floci
```
Or use Docker directly (no install) — see per-cloud commands below. A web console (`floci-ui`) is
available at `http://localhost:4500`.

## Start each cloud & point your tools

Each cloud is a single-port emulator. Start it, then export the env vars (the CLI's `env` subcommand
prints them; `eval $(floci … env)` applies them):

| Cloud | Start (CLI) | Start (Docker) | Endpoint | Health |
|---|---|---|---|---|
| **AWS** | `floci start && eval $(floci env)` | `docker run --rm -p 4566:4566 -v /var/run/docker.sock:/var/run/docker.sock floci/floci:latest` | `http://localhost:4566` | `/_floci/health` |
| **Azure** | `floci az start && eval $(floci az env)` | `docker run --rm -p 4577:4577 floci/floci-az:latest` | `http://localhost:4577` | `/_floci/health` |
| **GCP** | `floci gcp start && eval $(floci gcp env)` | `docker run --rm -p 4588:4588 floci/floci-gcp:latest` | `http://localhost:4588` | `/_floci-gcp/health` |
| **OCI** | `floci oci start && floci oci setup && eval $(floci oci env)` | `docker run --rm -p 4599:4599 -v /var/run/docker.sock:/var/run/docker.sock floci/floci-oci:latest` | `http://localhost:4599` | `/_floci-oci/health` |

Endpoint-override env vars (dummy credentials always work):

```sh
# AWS
export AWS_ENDPOINT_URL=http://localhost:4566 AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test AWS_DEFAULT_REGION=us-east-1
# GCP (client libraries use emulator-host vars)
export STORAGE_EMULATOR_HOST=http://localhost:4588 PUBSUB_EMULATOR_HOST=localhost:4588 FIRESTORE_EMULATOR_HOST=localhost:4588 GOOGLE_CLOUD_PROJECT=floci-local
# OCI (after `floci oci setup` writes a throwaway ~/.oci [FLOCI] profile)
export OCI_CLI_ENDPOINT=http://localhost:4599 FLOCI_OCI_ENDPOINT=http://localhost:4599 OCI_CLI_PROFILE=FLOCI
```

## Using floci with Drona / AI ("AI-ready" — what it really means)

floci markets itself as **"AI-ready"** and *"a cloud your AI agents can't break."* That is an
**architecture** claim, **not** a protocol: floci gives coding agents a **credential-free, zero-blast-radius**
local cloud they drive through the **normal CLIs/SDKs via environment variables** — there is **no special
integration to install**.

> ⚠️ **floci does not ship a Model Context Protocol (MCP) server.** (Verified across the whole `floci-io`
> org — no MCP repo, no `mcp` CLI subcommand, no MCP mention in any README.) Don't trust any config that
> claims an "official floci MCP server" — there isn't one.

**Recommended (verified): the env-var contract.** Start floci, export the vars above, then let Drona
generate and run cloud CLI commands in your terminal — they transparently hit local floci. To make the
env persist in VS Code's integrated terminal, drop this in your workspace `.vscode/settings.json`:

```jsonc
{
  "terminal.integrated.env.linux": {
    "AWS_ENDPOINT_URL": "http://localhost:4566",
    "AWS_ACCESS_KEY_ID": "test",
    "AWS_SECRET_ACCESS_KEY": "test",
    "AWS_DEFAULT_REGION": "us-east-1",
    "STORAGE_EMULATOR_HOST": "http://localhost:4588",
    "PUBSUB_EMULATOR_HOST": "localhost:4588",
    "OCI_CLI_ENDPOINT": "http://localhost:4599"
  }
  // use terminal.integrated.env.windows / .osx on those platforms
}
```

**Optional (community, unofficial): an MCP server pointed at floci.** If you specifically want an MCP
tool surface, a *generic* AWS MCP server that honours `AWS_ENDPOINT_URL` will talk to floci — see
[`templates/floci.mcp.json`](../templates/floci.mcp.json). This is a **third-party** path we ship as a
starting point only: the referenced package is **not a floci product** (floci ships no MCP server), so
pin and review it before use. Prefer the env-var contract above unless you have a concrete reason.

## Caveats (so labs stay honest)

- Fidelity is **approximate** and **not for production** — verify anything you'll ship against the
  official cloud docs.
- **Don't quote a hard AWS service count** (floci's own sources say 69 vs 58).
- **Azure Functions status is uncertain** — `floci-az` lists it as supported, but the console notes a
  `501 NotImplemented`; test before relying on it.
- **`snapshot` save/load is AWS-only** so far (OCI/GCP/Azure "coming soon").
- OCI omits identity domains, versioning, the S3-compat API, secret rotation, and KMS backup.

---
Sources: floci.io and the `floci-io` GitHub org (verified 2026-08). floci is MIT-licensed; LearningOS is
not affiliated with floci.
