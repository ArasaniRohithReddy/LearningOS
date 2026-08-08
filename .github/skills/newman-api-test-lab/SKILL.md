---
name: newman-api-test-lab
description: "Hands-on lab: run a Postman collection of API tests locally with Newman, Postman's free CLI. Learn to export a collection + environment, assert status codes, headers, and JSON schema with pm.test, run data-driven iterations, emit JUnit/HTML reports, and wire it into CI. Use for 'Newman', 'Postman CLI', 'run my collection locally', 'API test lab', or learning command-line API testing hands-on."
argument-hint: "The collection/endpoints to run"
---

# Newman API Test Lab

A **hands-on lab** to run an API test collection **locally** with Newman — Postman's free CLI runner —
so tests live in git and CI, not just a GUI, per the teaching approach in [`AGENTS.md`](../../../AGENTS.md).
Design the cases first with [api-testing-coach](../api-testing-coach/SKILL.md); add provider safety with [contract-testing-coach](../contract-testing-coach/SKILL.md).

## When to use

- The learner has (or will build) a Postman collection and wants it repeatable from the command line.
- Turning manual REST-client clicks into an automated, assertable suite that runs on every PR.
- Learning to keep assertions in version control so a broken contract is caught in review, not in production.

## Procedure

1. **Set up locally.** Install Node.js, then `npm install -g newman` (or `npx newman`). Export the collection
   and any environment from Postman as JSON, or keep them versioned in the repo.
2. **Write assertions in the collection.** In each request's *Tests* tab use `pm.test(...)` with
   `pm.response.to.have.status(200)`, header checks, and `pm.response.to.have.jsonSchema(schema)` — assert shape, not one field.
3. **Run it.** `newman run collection.json -e env.json` — read the end-of-run summary of requests, assertions,
   and failures; a non-zero exit code (add `--bail` to stop early) fails the build the moment an assertion breaks.
4. **Go data-driven.** Feed cases with `-d data.csv` (one iteration per row) and reference `{{vars}}` in the
   request so one collection covers the happy path, boundary edges, and error inputs.
5. **Report for CI.** Add reporters with `-r cli,junit` for machine-readable output (install the community
   `newman-reporter-htmlextra` for a rich HTML report) so results attach to the pipeline run.
6. **Automate.** Run headless in CI on every PR; seed/teardown data so runs are independent and idempotent,
   and inject secrets with `--env-var "token=$API_TOKEN"` instead of committing them to the collection.

## Output shape

```
Collection: orders.postman_collection.json (+ env.json)
Run: newman run orders.postman_collection.json -e env.json -r cli,junit
Assertions: 200 + jsonSchema | 401 no token | 404 unknown id | 400 bad body
Data-driven: -d users.csv  (N iterations)
Result: N requests · M assertions · 0 failures  →  JUnit XML for CI
```

## Tips

- Reference the Postman Learning Center "Newman" and "Test scripts" docs; validate a schema, don't eyeball JSON.
- Newman is free/OSS; keep collections + environments in git; never commit real tokens — inject secrets via env at run time.
- Pair with `api-testing-coach`; end with the **Learning Footer** (`AGENTS.md`) — the CLI habit to keep + one endpoint to add yourself.
