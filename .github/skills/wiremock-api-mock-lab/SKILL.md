---
name: wiremock-api-mock-lab
description: "Hands-on lab: run WireMock locally with Docker — mock and stub HTTP APIs with request matching, canned responses, and record/playback. Local, free, open-source, no subscription. Use for 'WireMock lab', 'the API to mock', 'stub an HTTP API locally', 'mock a dependency', 'record and playback', or learning API mocking by doing."
argument-hint: "The API to mock"
---

# WireMock API Mock Lab

Learn API mocking by *running WireMock yourself* — stub endpoints, match requests, and record real
traffic to replay — all local and free with no subscription, per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [auth-designer](../auth-designer/SKILL.md).

## When to use

- The learner needs a fake HTTP dependency (third-party API, token endpoint) that's fast and offline.
- Writing tests that must be deterministic without calling a real, rate-limited, or paid service.

## Procedure

1. **Concept:** WireMock is a programmable HTTP mock server; a **stub mapping** pairs a request
   *match* (method, URL, headers, body) with a canned **response** (WireMock docs, wiremock.org, 2024).
2. **Docker Compose:** run `wiremock/wiremock`, mount `./mappings` and `./__files`, and publish
   `8080`; then `docker compose up -d` and check `docker compose ps`.
3. **Configure:** add JSON stubs under `mappings/` (or `POST /__admin/mappings` at runtime); for
   record/playback, start WireMock in proxy mode against the real API to capture stubs.
4. **Verify:** call a stubbed route, e.g. `curl localhost:8080/api/hello`, confirm the canned
   response, then browse `GET /__admin/requests` to see what your client actually sent.
5. **Clean up:** `docker compose down` — stubs live in your mounted files, so they persist for reuse.

## Output shape

```yaml
services:
  wiremock:
    image: wiremock/wiremock:3.10.0      # official OSS image
    volumes:
      - ./mappings:/home/wiremock/mappings   # stub definitions (JSON)
      - ./__files:/home/wiremock/__files     # response body files
    ports: ["8080:8080"]
# admin API → POST /__admin/mappings (add stubs) ; GET /__admin/requests (inspect calls)
# stub → { "request": { "url": "/api/hello" }, "response": { "status": 200, "body": "hi" } }
```

## Tips

- Match precisely (method + URL + key headers) so one stub can't accidentally answer another request.
- Use record/playback to bootstrap stubs from a real API, then trim them to just what your tests need.
- End with the **Learning Footer** (`AGENTS.md`) — one stub to write + one edge case (404/timeout) to mock.
