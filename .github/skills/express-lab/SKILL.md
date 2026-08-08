---
name: express-lab
description: "Hands-on Express.js lab: define routes, chain middleware, handle errors with the four-arg handler, and serve a JSON API. Use for 'Express lab', 'hands-on Express.js lab', 'Express routing', 'Express middleware', 'Express error handling', 'express.json body parser', or learning Express by building a small API."
argument-hint: "The API"
---

# Express Lab

Learn Express by building a JSON API — route, add middleware, centralize errors, then return JSON —
following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).
Pairs with [api-design-review](../api-design-review/SKILL.md) and [api-testing-coach](../api-testing-coach/SKILL.md).

## When to use

- The learner wants a runnable Node API and to understand the middleware chain.
- Reinforcing request pipelines and error propagation for a **backend** role-agent.

## Procedure

1. **Frame the concept** — Express is a chain of middleware; each `(req, res, next)` either responds or
   calls `next()` to pass control down the stack (Express docs, *Using middleware*, 2024).
2. **Route:** `app.get("/users/:id", handler)` — read `req.params`, query via `req.query`, and respond with
   `res.json(...)`, which sets the content type for you.
3. **Middleware:** mount `app.use(express.json())` *before* routes so `req.body` is parsed; add a logger
   `app.use((req, res, next) => { …; next() })` and note that order matters.
4. **Error handling:** pass errors with `next(err)` and define an error handler *last* with four args
   `(err, req, res, next)` — Express only treats it as such when it has four parameters.
5. **Verify:** start the server, POST JSON to a route, and confirm success and error paths return the right
   status codes and bodies.
6. ⚠ **Pitfalls:** forgetting `next()` (request hangs); error middleware with only three args; async
   rejections not caught (wrap or try/catch in Express 4); wrong middleware order.

## Output shape

```
Route: GET /users/:id | req.params / req.query → res.json
Middleware: express.json() + logger (order matters)
Errors: next(err) → 4-arg handler last
Verify: POST json → success + error status codes
Pitfall hit → fix
```

## Tips

- Register the JSON parser and shared middleware before any route that depends on them.
- Design the endpoints with [api-design-review](../api-design-review/SKILL.md); test them via [api-testing-coach](../api-testing-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — add one middleware and predict where it runs.
