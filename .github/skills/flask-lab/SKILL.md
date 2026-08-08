---
name: flask-lab
description: "Hands-on Flask lab: define routes with @app.route, read the request and shape the response, split features into blueprints, and render Jinja2 templates. Use for 'Flask lab', 'hands-on Flask lab', 'Flask routing', 'Flask request/response', 'Flask blueprints', 'render_template Jinja2', or learning Flask by building a small app."
argument-hint: "The app"
---

# Flask Lab

Learn Flask by building a small app — route, handle a request, modularize with blueprints, then render a
template — following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).
Pairs with [api-design-review](../api-design-review/SKILL.md) and [api-testing-coach](../api-testing-coach/SKILL.md).

## When to use

- The learner wants a runnable Flask app and to see how a request becomes a response.
- Reinforcing WSGI micro-framework basics and app structure for a **backend** role-agent.

## Procedure

1. **Frame the concept** — Flask maps a URL rule to a view function that returns a response; nothing is
   implicit, you wire each piece (Flask docs, *Quickstart*, 2024).
2. **Route:** create `app = Flask(__name__)` and add `@app.route("/hello/<name>")`; return a string or a
   `(body, status)` tuple — the return value becomes the response.
3. **Request/response:** read input via `from flask import request` (`request.args`, `request.json`) and
   return JSON with `jsonify(...)` so headers and content type are correct.
4. **Blueprints:** move related routes into a `Blueprint`, then `app.register_blueprint(bp)` — this keeps
   the app factory small and features independently mountable.
5. **Verify:** `flask run`, hit each route, and render a page with `render_template("index.html")` from the
   `templates/` folder (Jinja2 auto-escapes by default).
6. ⚠ **Pitfalls:** circular imports around a global `app`; missing `templates/` folder; forgetting to
   register a blueprint; leaving `debug=True` in production.

## Output shape

```
App: Flask(__name__) | Route: /<rule> → view → response
Input: request.args/json | Output: jsonify(...)
Blueprint: <name> registered on app
Verify: flask run → routes → render_template (templates/)
Pitfall hit → fix
```

## Tips

- Return `(body, status, headers)` tuples instead of hand-building `Response` objects.
- Design routes with [api-design-review](../api-design-review/SKILL.md); add auth via [auth-designer](../auth-designer/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`) — add one blueprint and predict its URL prefix.
