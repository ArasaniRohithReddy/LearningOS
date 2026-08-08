---
name: django-lab
description: "Hands-on Django lab: scaffold a project and app, define models with migrations, wire views and the URLconf, and get the admin CRUD UI for free. Use for 'Django lab', 'hands-on Django lab', 'startproject vs startapp', 'makemigrations and migrate', 'Django views and URLconf', 'register a model in the Django admin', or learning Django's MTV flow by building it."
argument-hint: "The app"
---

# Django Lab

Learn Django by building one app end to end — scaffold, model, migrate, route, then drive it from the
admin — following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).
Pairs with [api-design-review](../api-design-review/SKILL.md) and [auth-designer](../auth-designer/SKILL.md).

## When to use

- The learner wants a runnable Django app from scratch, not just a tour of the framework.
- Reinforcing the MTV (Model–Template–View) flow and the ORM for a **backend** role-agent.

## Procedure

1. **Frame the concept** — a *project* holds settings; an *app* is a reusable feature. Requests flow
   URLconf → view → model/template (Django docs, *Writing your first Django app*, 2024).
2. **Scaffold:** `django-admin startproject site .` then `python manage.py startapp blog`; add `"blog"` to
   `INSTALLED_APPS` so Django discovers its models and migrations.
3. **Model the data:** declare fields on a `models.Model` subclass; run `makemigrations` (generates the
   schema change) then `migrate` (applies it) — never hand-edit applied migration history.
4. **Route + view:** write a view returning `HttpResponse`, map it in the app's `urls.py` with `path()`,
   and `include()` that from the project URLconf.
5. **Verify:** `runserver`, hit the URL, then `createsuperuser` and register the model with
   `admin.site.register(Post)` to get list/add/edit/delete at `/admin`.
6. ⚠ **Pitfalls:** app missing from `INSTALLED_APPS`; forgetting `makemigrations`/`migrate`; model not
   registered in admin; putting business logic in views instead of models/services.

## Output shape

```
Project: <name> | App: <name> (in INSTALLED_APPS)
Model: <fields> → makemigrations → migrate
URL: path('<route>/', view) include()-d from project urls
Verify: runserver → /<route> → /admin (superuser + register)
Pitfall hit → fix
```

## Tips

- Keep views thin; put data rules on the model so they stay reusable and testable.
- Design the endpoints with [api-design-review](../api-design-review/SKILL.md); test them via [api-testing-coach](../api-testing-coach/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — name one field you'd add and the migration it creates.
