---
name: swagger-ui-local-lab
description: "Hands-on lab: render and try an OpenAPI spec locally with Swagger UI or Redoc — free, open-source, no subscription. Mount an openapi.yaml, browse interactive docs, and use 'Try it out' to call your API from the browser; Redoc gives a clean read-only reference. Use for 'Swagger UI lab', 'render OpenAPI locally', 'Redoc lab', 'try it out from the browser', 'view API docs offline', or learning OpenAPI tooling by doing."
argument-hint: "The OpenAPI spec to render"
---

# Swagger UI / Redoc Local Lab

Learn OpenAPI tooling by *rendering your own spec* — browse it in Swagger UI, call endpoints with
"Try it out", and compare Redoc's reference view — all local and free, per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [openapi-spec-writer](../openapi-spec-writer/SKILL.md) and [api-design-review](../api-design-review/SKILL.md).

## When to use

- The learner has an OpenAPI/Swagger spec and wants interactive docs without any hosted service.
- Reviewing or teaching an API design from its contract before writing client or server code.

## Procedure

1. **Concept:** an **OpenAPI** document (`openapi.yaml`) describes your API; **Swagger UI** renders it
   interactively and **Redoc** renders a clean three-panel reference (Swagger docs, swagger.io, 2025).
2. **Serve it:** run the official OSS image `swaggerapi/swagger-ui`, mount your spec, and set
   `SWAGGER_JSON=/spec/openapi.yaml`; open `http://localhost:8080`.
3. **Try it out:** expand an operation, click **Try it out** → **Execute** to send a real request; this
   needs your API running and CORS allowing the docs origin.
4. **Compare Redoc:** run `redocly/redoc` (env `SPEC_URL`) for a read-only reference; use Swagger UI to
   *call* endpoints, Redoc to *read* the contract.
5. **Verify & clean up:** the rendered docs match your spec's paths and schemas; stop the container —
   the spec stays in your mounted file.

## Output shape

```yaml
# compose.yaml — render a local OpenAPI spec (no account, offline)
services:
  swagger-ui:
    image: swaggerapi/swagger-ui         # official OSS image; interactive + Try it out
    ports: ["8080:8080"]
    environment: { SWAGGER_JSON: /spec/openapi.yaml }
    volumes: ["./openapi.yaml:/spec/openapi.yaml:ro"]
  redoc:
    image: redocly/redoc                 # clean read-only reference
    ports: ["8081:80"]
    environment: { SPEC_URL: spec/openapi.yaml }
    volumes: ["./openapi.yaml:/usr/share/nginx/html/spec/openapi.yaml:ro"]
```

## Tips

- "Try it out" makes real browser calls — run the API and allow CORS for the docs origin, or requests fail silently.
- Keep the spec as the source of truth: edit `openapi.yaml`, refresh the page, and the docs update — no rebuild.
- End with the **Learning Footer** (`AGENTS.md`) — one endpoint to document richer + one response example to add yourself.
