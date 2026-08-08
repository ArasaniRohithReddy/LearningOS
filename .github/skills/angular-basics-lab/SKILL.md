---
name: angular-basics-lab
description: "Hands-on Angular lab — standalone components, templates and the four binding types, services with dependency injection, and signals — by building one small app. Use for 'Angular basics', 'components and templates', 'property/event/two-way binding', 'services and DI', 'inject()', 'signals', or practicing Angular hands-on."
argument-hint: "The app"
---

# Angular Basics Lab

Learn Angular by building one small app and watching components, bindings, and injected services wire it
together — teaching the *why* and the trade-offs, per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [component-designer](../component-designer/SKILL.md).

## When to use

- The learner wants hands-on practice with templates, the binding types, and DI.
- Debugging a view that won't update, or a service that's re-created instead of shared.

## Procedure

1. **Frame the concept** — a component is a `@Component` class plus a template; Angular renders it and keeps
   the two in sync through binding (angular.dev, *Components*, 2025).
2. **Exercise — build it**: generate a standalone `AppComponent`; show state with interpolation
   `{{ title }}`; bind an attribute with `[disabled]` and a click with `(click)`.
3. **Add two-way binding** — import `FormsModule`, add `[(ngModel)]="name"` to an input and echo it; note
   `[( )]` is property + event sugar (angular.dev, *Binding*, 2025).
4. **Extract a service** — put shared data in an `@Injectable({ providedIn: 'root' })` class; obtain it with
   `inject(DataService)` so one instance is shared (angular.dev, *Dependency Injection*, 2025).
5. **Make it reactive** — hold state in a `signal()`, read it as `count()` in the template, and update with
   `.set`/`.update`; verify the view re-renders (angular.dev, *Signals*, 2025).
6. **Name the pitfalls** — forgetting to import a needed module, mutating instead of setting a new signal
   value, and providing a service at the wrong level (duplicate instances).

## Output shape

```
Component: @Component{ selector, template }
Bindings: {{ x }} · [prop] · (event) · [(ngModel)]
Service: @Injectable(providedIn:'root') ← inject(<Svc>)
State: signal(<x>) → x() in template
Fix: <pitfall> → <correction>
```

## Tips

- Pick the binding by direction: `[ ]` data in, `( )` events out, `[( )]` both.
- `providedIn: 'root'` gives one shared instance — scope narrower only when you want isolation.
- Prefer signals for local state (pair [state-management-coach](../state-management-coach/SKILL.md)); end with the **Learning Footer** (`AGENTS.md`).
