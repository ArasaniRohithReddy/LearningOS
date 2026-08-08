---
name: mailpit-email-local-lab
description: "Hands-on lab: run Mailpit locally with Docker — a fake SMTP server plus web UI that captures test emails so no real mail is sent. Local, free, open-source, no subscription. Use for 'Mailpit lab', 'the email testing', 'local SMTP catcher', 'capture test emails', 'preview outgoing mail', or learning email testing by doing."
argument-hint: "The email testing"
---

# Mailpit Email Local Lab

Learn safe email testing by *running your own SMTP sink* — capture and preview the mail your app
sends, with nothing delivered — all local and free with no subscription, per
[`AGENTS.md`](../../../AGENTS.md). Pairs with [alerting-strategy-coach](../alerting-strategy-coach/SKILL.md).

## When to use

- The learner's app sends email and they need to inspect it without spamming real inboxes.
- Testing notification/alert emails, signup flows, or password resets in local dev or CI.

## Procedure

1. **Concept:** Mailpit is a single-binary **SMTP sink** — it accepts mail on a fake SMTP port,
   stores it, and shows it in a web UI, so nothing leaves your machine (Mailpit README,
   github.com/axllent/mailpit, 2024).
2. **Docker Compose:** run `axllent/mailpit`, publishing `1025` (SMTP) and `8025` (web UI); then
   `docker compose up -d` and confirm with `docker compose ps`.
3. **Configure:** point your app's SMTP settings at host `mailpit` port `1025` (or `localhost:1025`
   from the host) — no auth or TLS needed for the default dev setup.
4. **Verify:** trigger an email from your app, then open the UI (`:8025`) to read the message with its
   headers, HTML/plain parts, and any attachments.
5. **Clean up:** `docker compose down` (messages are in-memory by default and clear on stop).

## Output shape

```yaml
services:
  mailpit:
    image: axllent/mailpit:v1.21.0        # official OSS image
    environment: ["MP_MAX_MESSAGES=500"]  # ring-buffer size (0 = unlimited)
    ports:
      - "8025:8025"   # web UI — read captured mail
      - "1025:1025"   # SMTP endpoint your app sends to
# app SMTP → host: mailpit, port: 1025, no auth/TLS
```

## Tips

- Point *all* non-prod environments at Mailpit so a test never emails a real customer by accident.
- Add persistence (`MP_DATA_FILE`) only if captured mail must survive a container restart.
- End with the **Learning Footer** (`AGENTS.md`) — one email flow to test + one template to preview.
