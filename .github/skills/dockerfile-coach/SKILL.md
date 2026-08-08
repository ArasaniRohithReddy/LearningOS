---
name: dockerfile-coach
description: "Write or improve a Dockerfile as a lesson — choose the right base image, order layers for build-cache reuse, use multi-stage builds, shrink image size and attack surface, and add a .dockerignore, explaining each best practice. Use for 'write a Dockerfile', 'my image is huge', 'speed up my docker build', 'review my Dockerfile', or learning containers."
argument-hint: "The app/stack to containerize or a Dockerfile to review"
---

# Dockerfile Coach

Teach container images by *why each line exists* — smaller, faster, safer builds, per the coding
standards and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner is containerizing an app or has a slow, bloated, or insecure image.
- Reinforcing image best practices for a **DevOps** or backend role-agent.

## Mental model

- An image is **stacked read-only layers**; each instruction makes one. The builder **caches** a layer
  and reuses it until its inputs change — so **order matters**: copy dependency manifests and install
  *before* copying source, so code edits don't bust the dependency cache.

## Procedure

1. **Pick a base**: smallest that fits (`-slim`, `alpine`, or distroless); pin a version tag, not
   `latest`, for reproducibility. Note the trade-off (alpine's musl libc can break some binaries).
2. **Order for cache**: manifest → install deps → copy source → build. Group related `RUN` steps.
3. **Multi-stage**: build in a fat stage, then `COPY --from=build` only the artifacts into a lean
   runtime — no compilers or dev deps in the final image (Docker docs, *Multi-stage builds*).
4. **Shrink attack surface**: run as non-root (`USER`), drop build tools, add a `HEALTHCHECK`, and
   keep secrets out (BuildKit `--secret`, not `ENV`).
5. **Add `.dockerignore`**: exclude `.git`, `node_modules`, and build output — smaller, faster context.

## Output shape

```
Base: <image:tag + why> | Final size goal: …
Layer order: manifest → deps → source → build (why: cache)
Multi-stage: build stage → runtime stage (copies: …)
Security: non-root USER, no secrets, pinned versions
.dockerignore: <key excludes>
Dockerfile: <annotated>
```

## Tips

- Pin versions and prefer minimal bases; never copy secrets into a layer — they persist in history.
- Rebuild to confirm cache hits and final size; don't claim a size win you haven't measured.
- End with the **Learning Footer** (`AGENTS.md`) — the caching rule to keep + an image to slim yourself.
