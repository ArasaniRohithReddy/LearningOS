---
name: spring-boot-lab
description: "Hands-on Spring Boot lab: build a REST controller, wire beans with dependency injection, and externalize configuration. Use for 'Spring Boot lab', 'hands-on Spring Boot lab', '@RestController', 'constructor injection', 'Spring dependency injection', 'application.properties config', or learning Spring Boot by building a service."
argument-hint: "The service"
---

# Spring Boot Lab

Learn Spring Boot by building a service — a REST controller, injected beans, then externalized config —
following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).
Pairs with [api-design-review](../api-design-review/SKILL.md) and [auth-designer](../auth-designer/SKILL.md).

## When to use

- The learner wants a runnable Spring service and to see the IoC container wire it together.
- Reinforcing dependency injection and layered design for a **backend/Java** role-agent.

## Procedure

1. **Frame the concept** — Spring's container creates and injects beans so classes depend on interfaces,
   not `new` (Spring Boot Reference / spring.io, *Building a RESTful Web Service*, 2024).
2. **Scaffold:** generate from start.spring.io with the *Spring Web* starter; the `@SpringBootApplication`
   class boots an embedded server and component-scans its package.
3. **REST controller:** annotate a class `@RestController` and map handlers with `@GetMapping("/api/x")`;
   returned objects are serialized to JSON automatically.
4. **Inject a dependency:** put logic in a `@Service`, then take it via **constructor injection** — preferred
   over field `@Autowired` because it is testable and can be `final`.
5. **Configure:** move values to `application.properties` and read them with `@Value("${...}")` or a typed
   `@ConfigurationProperties` bean; verify by hitting the endpoint.
6. ⚠ **Pitfalls:** component outside the main package (not scanned); field injection hiding dependencies;
   `@Controller` vs `@RestController`; missing starter dependency.

## Output shape

```
Boot: @SpringBootApplication (component scan)
Controller: @RestController + @GetMapping → JSON
DI: @Service via constructor injection
Config: application.properties → @Value / @ConfigurationProperties
Verify: run → GET /api/x | Pitfall hit → fix
```

## Tips

- Prefer constructor injection so dependencies are explicit, final, and easy to mock in tests.
- Design the API with [api-design-review](../api-design-review/SKILL.md); secure it via [auth-designer](../auth-designer/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — add one `@Service` method and trace where it's injected.
