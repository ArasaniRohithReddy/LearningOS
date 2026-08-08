# Security Policy

LearningOS is a **teaching framework** (Markdown agents/skills + a VS Code extension). It runs locally and
is designed to keep your data on your machine. We still take security seriously.

## Reporting a vulnerability

**Please do not open a public issue for security vulnerabilities.**

Instead, report privately via GitHub's **[Report a vulnerability](https://github.com/Rohithreddy7123/LearningOS/security/advisories/new)**
(Security → Advisories → *Report a vulnerability*). Include:

- A description of the issue and its impact.
- Steps to reproduce (a minimal example helps).
- Affected component (plugin skill/agent, the VS Code extension, a script, etc.) and version.

We aim to acknowledge reports within a few days and will keep you updated on the fix.

## Scope & design notes (what to know before reporting)

- **Code execution** (`remote-code-runner` / the extension's run-code tool) sends snippets to a
  **user-configured** provider (self-hosted Piston, public Piston, or onlinecompiler.io). Never paste
  secrets into code you run. The onlinecompiler API key is stored in VS Code **SecretStorage**, and is only
  ever sent to the configured onlinecompiler endpoint — never to a Piston host.
- **URL fetching** (the extension's fetch tool) blocks private/loopback/link-local/CGNAT and cloud-metadata
  hosts (SSRF guard) and validates every redirect hop. It checks the hostname, not the resolved IP, so
  DNS-rebinding is out of scope.
- **Charts** render locally via a bundled Flint engine; your data never leaves the machine.
- MCP servers you enable can read/act on the data you point them at — only enable servers you trust
  (see [`docs/MCP.md`](docs/MCP.md) and [`docs/Security.md`](docs/Security.md)).

## Supported versions

The latest release is supported. Please upgrade to the newest `.vsix`/release before reporting.
