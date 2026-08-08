---
name: dotnet-webapi-lab
description: "Hands-on ASP.NET Core Web API lab: expose endpoints with minimal APIs or controllers, register services with dependency injection, and bind request data with model binding. Use for 'ASP.NET Core Web API lab', 'hands-on .NET Web API lab', 'minimal API vs controller', '.NET dependency injection', 'model binding', 'service lifetimes', or learning ASP.NET Core by building an API."
argument-hint: "The API"
---

# .NET Web API Lab

Learn ASP.NET Core by building a Web API — map endpoints, register services, then bind request data —
following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).
Pairs with [api-design-review](../api-design-review/SKILL.md) and [test-writer](../test-writer/SKILL.md).

## When to use

- The learner wants a runnable .NET API and to see DI and model binding built in.
- Reinforcing the request pipeline and service lifetimes for a **backend/.NET** role-agent.

## Procedure

1. **Frame the concept** — the host builds a DI container and a middleware pipeline; endpoints resolve
   services from it (Microsoft Learn, *Tutorial: Create a minimal API*, 2024).
2. **Map an endpoint:** in minimal APIs use `app.MapGet("/items/{id}", handler)`; or add an `[ApiController]`
   controller with `[HttpGet]` — pick one style and stay consistent.
3. **Register services:** add to `builder.Services` with a lifetime — `AddSingleton` (one), `AddScoped`
   (per request), or `AddTransient` (per resolve); inject via constructor or handler parameter.
4. **Model binding:** bind from route/query automatically; use `[FromBody]` for JSON and let `[ApiController]`
   auto-return `400` on validation failures.
5. **Verify:** `dotnet run`, call the endpoint, and open Swagger/OpenAPI to exercise it and read the schema.
6. ⚠ **Pitfalls:** captive dependency (a singleton holding a scoped service); ambiguous binding source;
   forgetting `app.MapControllers()`; mismatched route and parameter names.

## Output shape

```
Endpoint: MapGet("/items/{id}") or [ApiController] + [HttpGet]
DI: AddSingleton/AddScoped/AddTransient → ctor inject
Binding: route/query auto + [FromBody] json → 400 on invalid
Verify: dotnet run → call → Swagger
Pitfall hit → fix
```

## Tips

- Match service lifetime to state: stateless → transient/singleton, per-request → scoped.
- Design the contract with [api-design-review](../api-design-review/SKILL.md); cover it via [test-writer](../test-writer/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — register one service and trace its lifetime per request.
