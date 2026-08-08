---
name: drone-ci-local-lab
description: "Hands-on lab to run a Drone CI pipeline locally from a .drone.yml with the open-source drone CLI (drone exec) — no server, no OAuth, no subscription — execute container steps on your machine, run named pipelines, and emulate secrets. Use for 'run Drone locally', 'drone exec', 'test .drone.yml', 'local container pipeline', or learning pipeline-as-code by doing."
argument-hint: "The .drone.yml pipeline to run"
---

# Drone CI Local Lab

Learn pipeline-as-code by executing one on your laptop — the open-source `drone` CLI runs a
`.drone.yml` in Docker with no server, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [ci-pipeline-builder](../ci-pipeline-builder/SKILL.md) and [dockerfile-coach](../dockerfile-coach/SKILL.md).

## When to use

- You want to author and debug a container pipeline locally before wiring Drone to a Git host.
- Learning how steps, images, and commands compose — "it works on my machine", for real.

## Mental model

- `drone exec` reads `.drone.yml`, mounts your working directory as the **workspace**, and runs each
  **step** in its declared **image** with your local Docker daemon. It skips the clone and never talks
  to a Drone server — so no OAuth or subscription is involved.

## Procedure

1. **Install the CLI:** `scoop install drone` (or `brew install drone-cli`) (Drone docs, *Local
   pipelines / drone exec*).
2. **Write the pipeline:** create `.drone.yml` with `kind: pipeline`, `type: docker`, `name: default`,
   and `steps:` each having `name`, `image`, and `commands`.
3. **Run it:** from the repo root, `drone exec` streams step logs and returns a non-zero exit code if any step fails.
4. **Scope the run:** `drone exec --pipeline=<name>` for a named/multi-pipeline file, and
   `--include`/`--exclude` to run or skip specific steps.
5. **Emulate context:** supply secrets via `--secret-file secrets.txt` and set metadata like
   `--branch` / `--event`, since there's no server to provide them.

## Output shape

```
Tool: Drone CLI (OSS) | File: .drone.yml (kind: pipeline, type: docker)
Steps: name + image + commands  (run in Docker)
Run: drone exec   (mounts CWD; clone skipped; no server)
Scope: --pipeline=<name> | --include/--exclude=<step>
Secrets/meta: --secret-file secrets.txt | --branch | --event
Docs: docs.drone.io (2025)
```

## Tips

- `drone exec` needs a working Docker daemon; local runs skip clone and server metadata by design.
- Keep steps small and image-pinned so the same `.drone.yml` behaves the same on the server later ([ci-pipeline-builder](../ci-pipeline-builder/SKILL.md)).
- End with the **Learning Footer** (`AGENTS.md`) — one pipeline you ran + one step to add yourself.
