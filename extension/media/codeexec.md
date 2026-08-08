# Run code without installing a language

Drona can execute your code **remotely** in **90+ languages** and teach from the real
stdout/stderr/exit code — no local toolchain needed. It talks to a
[Piston](https://github.com/engineer-man/piston)-compatible runner.

> **Heads-up:** the free **public** Piston `/execute` endpoint is now **whitelist-only** and
> usually returns **HTTP 401**, so keyless public execution is no longer reliable. Pick one of the
> options below. Run **`Drona: Set up code execution`** from the Command Palette to configure it
> with a guided prompt.

## Option 1 — Self-host Piston (recommended: free, offline, no key)

Run Piston locally with Docker. It's private, unlimited, works offline, and supports 90+ languages.

```bash
# 1) Start the Piston API on http://localhost:2000
docker run -d --name piston -p 2000:2000 ghcr.io/engineer-man/piston

# 2) Install the language packages you want (each is a one-time download).
#    List everything available:
curl -s http://localhost:2000/api/v2/packages

#    Install a couple of runtimes (repeat for any language you need):
curl -s -X POST http://localhost:2000/api/v2/packages \
  -H "Content-Type: application/json" \
  -d '{"language":"python","version":"3.12.0"}'

curl -s -X POST http://localhost:2000/api/v2/packages \
  -H "Content-Type: application/json" \
  -d '{"language":"node","version":"20.11.1"}'

# 3) Confirm the runtimes are ready:
curl -s http://localhost:2000/api/v2/runtimes
```

Then point Drona at your local runner:

- Run **`Drona: Set up code execution`** → **Self-host Piston** → **Use `http://localhost:2000/api/v2`**, or
- set **`learningos.codeRunner.baseUrl`** to `http://localhost:2000/api/v2` in Settings (leave the API key empty).

Now ask `@drona` to run something, e.g. *"run this Python and show the output."*

## Option 2 — Use a keyed provider (onlinecompiler.io)

If you'd rather not run Docker, use a hosted Piston-compatible provider that issues an API key:

1. Sign up at **<https://onlinecompiler.io/>** and create an **API key**.
2. Run **`Drona: Set up code execution`** → **Use onlinecompiler.io** → paste your key.
3. Confirm/adjust the **base URL** if your dashboard shows a different endpoint.

The key is saved to **`learningos.codeRunner.apiKey`** and sent as `Authorization: Bearer <key>` and
`X-API-Key: <key>`. Any Piston-compatible provider works via the same generic base-URL + key settings.

## Option 3 — Public Piston (may be blocked)

You can keep the default public runner (`https://emkc.org/api/v2/piston`), but keyless
`/execute` is often whitelist-only and returns **HTTP 401**. If runs fail, switch to Option 1 or 2.

---

**Settings used:** `learningos.codeRunner.baseUrl`, `learningos.codeRunner.apiKey`,
`learningos.codeRunner.timeoutMs`.
