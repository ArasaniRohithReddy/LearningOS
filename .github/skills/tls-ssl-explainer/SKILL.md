---
name: tls-ssl-explainer
description: "Explain TLS/HTTPS defensively: the handshake, certificates & chains of trust, cipher suites, SNI, and common errors (expired, self-signed, hostname mismatch) — without ever bypassing validation. Use for 'how does HTTPS work', 'explain the TLS handshake', 'what is a certificate chain', 'SSL/cert error', 'ERR_CERT...', or understanding a TLS failure."
argument-hint: "The TLS topic or an error to understand"
---

# TLS/SSL Explainer

Teach how TLS builds a private, authenticated channel — and how to read its errors — per the
teaching approach and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants to understand HTTPS/TLS or diagnose a certificate error.
- Grounding secure transport before networking, load balancing, or DNS (SNI) topics.

## Mental model

TLS gives three guarantees: **confidentiality**, **integrity**, and server **authentication**. A
certificate binds a hostname to a public key, vouched for by a Certificate Authority the client trusts.

## Procedure

1. **State the goal.** Name what TLS provides, so each step maps to a guarantee.
2. **Handshake.** ClientHello → ServerHello + certificate → key exchange (ECDHE) → Finished; TLS 1.3 is 1-RTT (RFC 8446, 2018).
3. **Chain of trust.** Leaf → intermediate → root; the client verifies signatures to a trusted root and checks **hostname + validity + revocation** (RFC 5280).
4. **Cipher suites.** Read the parts: key exchange · authentication · AEAD cipher · hash; prefer modern defaults.
5. **Read the error.** Map the message to a cause: expired, self-signed, hostname mismatch, untrusted issuer, incomplete chain.
6. **Fix defensively.** Renew/rotate certs, install the **full** chain — never disable verification. End with the **Learning Footer**.

## Output shape

```
Guarantees: confidentiality + integrity + authentication
Handshake: ClientHello → cert → ECDHE → Finished (TLS1.3 = 1-RTT)
Chain: leaf → intermediate → root (must be trusted)
Error: <message> → cause: <expired / self-signed / hostname / chain>
Fix: <renew / install chain> — never bypass validation
```

## Tips

- ⚠ Never present `curl -k`, `verify=False`, or `NODE_TLS_REJECT_UNAUTHORIZED=0` as a fix — it deletes the protection.
- Primary sources: RFC 8446 (TLS 1.3), RFC 5280 (X.509), MDN "Transport Layer Security".
- Pair with `networking-fundamentals-coach`; end with the **Learning Footer** (`AGENTS.md`).
