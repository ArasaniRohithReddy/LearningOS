---
name: fastapi-lab
description: "Hands-on FastAPI lab: declare path and query parameters, validate request bodies with Pydantic models, write async endpoints, and explore the auto-generated OpenAPI docs. Use for 'FastAPI lab', 'hands-on FastAPI lab', 'path vs query params', 'Pydantic request model', 'async endpoints', 'FastAPI /docs Swagger', or learning FastAPI by building an API."
argument-hint: "The API"
---

# FastAPI Lab

Learn FastAPI by building a typed API — path and query params, a Pydantic body, an async route, then the
free docs — following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).
Pairs with [api-design-review](../api-design-review/SKILL.md) and [api-testing-coach](../api-testing-coach/SKILL.md).

## When to use

- The learner wants a runnable, type-driven API and to see validation and docs generated from hints.
- Reinforcing async I/O and schema-first request handling for a **backend** role-agent.

## Procedure

1. **Frame the concept** — type hints *are* the contract: FastAPI parses, validates, and documents from
   them, powered by Pydantic and Starlette (FastAPI docs, *Path Parameters*, 2024).
2. **Path + query:** `@app.get("/items/{item_id}")` with `item_id: int` (path) and `q: str | None = None`
   (query); the default marks it optional and the type enforces coercion.
3. **Body with Pydantic:** define a `BaseModel` and take it as a parameter for POST — invalid JSON returns a
   `422` with field-level errors, no manual checks.
4. **Async endpoint:** use `async def` and `await` real async I/O; never call blocking code there or you
   stall the event loop — use a plain `def` route for blocking work instead.
5. **Verify:** run `uvicorn main:app --reload`, then open `/docs` (Swagger UI) and `/redoc` — try requests
   straight from the generated OpenAPI schema.
6. ⚠ **Pitfalls:** blocking calls inside `async def`; confusing path vs query; missing type hints (no
   validation); returning ORM objects instead of a `response_model`.

## Output shape

```
Route: GET /items/{item_id}?q= | path:int  query:optional
Body: Pydantic BaseModel → 422 on invalid
Async: async def + await (no blocking I/O)
Verify: uvicorn --reload → /docs + /redoc
Pitfall hit → fix
```

## Tips

- Let types do the validating; add `response_model` to shape and document the output.
- Design the contract with [api-design-review](../api-design-review/SKILL.md); test it via [api-testing-coach](../api-testing-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — add one query filter and read its entry in `/docs`.
