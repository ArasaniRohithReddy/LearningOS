---
name: openapi-spec-writer
description: "Write an OpenAPI (Swagger) specification as a lesson — model paths and operations, request/response schemas, parameters, status responses, reusable components, security schemes, and examples for a described API. Use for 'write an OpenAPI spec', 'document my API in Swagger', 'define the schema', 'add examples to the spec', or learning OpenAPI."
argument-hint: "The API to specify"
---

# OpenAPI Spec Writer

Author an OpenAPI 3.1 document that doubles as the contract and the docs — reusable, example-rich,
teachable — per the teaching approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md). Sanity-check
the design with [api-design-review](../api-design-review/SKILL.md); verify it with [api-testing-coach](../api-testing-coach/SKILL.md).

## When to use

- The learner has an API (built or planned) and needs a precise, machine-readable specification.
- A contract must exist before codegen, mock servers, or consumer teams start work.

## Anatomy (what each part is for)

- `info`/`servers` (identity, base URLs), `paths` → operations with `parameters`, `requestBody`, and
  keyed `responses`; `components` holds **reusable** `schemas`/`securitySchemes` via `$ref` (DRY), plus `examples`.

## Procedure

1. **Confirm resources & operations**: nouns, their relationships, and who calls them.
2. **Define schemas in `components`** first (types, `required`, formats); reference with `$ref`, never re-inline.
3. **Write each path**: method, parameters (path/query/header), request body, and every meaningful
   response — success **and** `4xx`/`5xx` with an error schema.
4. **Add security**: declare `securitySchemes` (e.g., bearer/OAuth2) and apply per operation.
5. **Add examples** to bodies/responses; validate the document before shipping.

## Output shape

```
openapi: 3.1.0
info: { title: Orders API, version: 1.0.0 }
paths:
  /orders/{id}:
    get:
      parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
      responses:
        '200': { $ref: '#/components/responses/OrderOk' }
        '404': { $ref: '#/components/responses/NotFound' }
components: { schemas: { Order: { type: object, required: [id] } } }
```

## Tips

- Follow the OpenAPI Specification 3.1 (spec.openapis.org, 2021) and validate; never invent keywords.
- Reuse via `components` + `$ref`; document error responses, not just the happy `200`.
- End with the **Learning Footer** (`AGENTS.md`) — the `$ref` habit to keep + one endpoint to spec yourself.
