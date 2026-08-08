---
name: llm-guardrails-designer
description: "Design defensive safety guardrails for an LLM app: validate inputs and outputs, defend against prompt injection and jailbreaks, handle PII, ground answers to reduce hallucination, and refuse out-of-scope or unsafe requests. Use for 'secure my LLM app', 'prompt injection defense', 'guardrails / content filtering', 'stop the model leaking PII', 'jailbreak protection', or 'safe refusals'. Teaches layered, defensive design."
argument-hint: "The LLM app + risks"
---

# LLM Guardrails Designer

Wrap an LLM app in **layered, defensive controls** — assume inputs are hostile and outputs are fallible —
following the security and honesty principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner is exposing an LLM to untrusted input and needs safety, privacy, and abuse defenses.
- Pairs with `rag-designer` (grounding), `agent-designer` (tool safety), and `eval-designer` (red-team tests).

## Procedure

1. **Threat-model first.** List assets, untrusted inputs, and tools the model can reach; map them to the
   OWASP Top 10 for LLM Applications (2025) — prompt injection (LLM01) leads the list.
2. **Validate inputs.** Constrain length/format, flag injection patterns, and treat *retrieved* and
   tool-returned text as untrusted too (indirect injection — Greshake et al., arXiv:2302.12173, 2023-02-23).
3. **Least privilege for actions.** Gate tools behind allowlists, scoped permissions, and human confirmation
   for irreversible steps; never let model text alone authorize a side effect.
4. **Handle PII.** Detect and redact sensitive data on the way in and out; minimize what is sent and logged.
5. **Ground & cite** answers on approved context and require "I don't know" over fabrication (grounding via
   `rag-designer`), so a refusal is a valid, designed output — not a failure.
6. **Validate outputs.** Schema/type checks, content/safety filters, and citation checks *before* the response
   reaches the user or a downstream tool; log for audit (framing: NIST AI RMF 1.0, 2023-01).
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
App & trust boundary: inputs, tools, data the model touches
Threats: mapped to OWASP LLM Top 10 (2025)
Input controls: length/format, injection filtering, untrusted context
Action controls: tool allowlist, scopes, human-in-the-loop
PII: detect/redact in + out, logging policy
Output controls: schema, safety filter, grounding/citation, refusal
Learning Footer
```

## Tips

- Guardrails are defense-in-depth, not a silver bullet — no single filter stops every jailbreak; layer them.
- The model's output is untrusted input to whatever consumes it; validate before it hits a tool, DB, or browser.
- Test with an adversarial (red-team) eval set, and treat every bypass as a regression to add back.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
