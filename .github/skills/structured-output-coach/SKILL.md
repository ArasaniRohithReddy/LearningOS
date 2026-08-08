---
name: structured-output-coach
description: "Get reliable structured output (JSON/objects) from an LLM: define a schema, use function/tool calling or JSON/structured-output modes, validate and repair, and use constrained/guided decoding for hard guarantees. Use for 'force JSON output', 'function/tool calling', 'JSON schema', 'model returns invalid JSON', 'parse LLM output', 'Pydantic validation', or 'structured extraction'. Teaches guarantees vs. best-effort."
argument-hint: "The output schema/use case"
---

# Structured Output Coach

Turn free text into **schema-valid data you can trust** — and know which methods *guarantee* structure vs.
merely nudge it — per the teaching principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner needs machine-parseable output (JSON, function args, extraction) feeding code, a DB, or a tool.
- Pairs with `agent-designer` (tool calling), `llm-guardrails-designer` (output validation), and `eval-designer`.

## Procedure

1. **Design the schema.** Define fields, types, enums, and required vs. optional as JSON Schema
   (json-schema.org); flatter, simpler schemas are far more reliable than deeply nested ones.
2. **Pick the mechanism** by strength: prompt-and-parse (best-effort) < JSON mode < **function/tool calling** <
   schema-guaranteed structured outputs (OpenAI Structured Outputs, openai.com, 2024-08-06) — later options
   constrain the model more.
3. **Constrain decoding** when you need hard guarantees: grammar/regex/finite-state-guided generation forces
   only valid tokens (Willard & Louf, *Efficient Guided Generation*, arXiv:2307.09702, 2023-07-19) — useful for
   local/open models without a native structured mode.
4. **Validate** every response against the schema (e.g., Pydantic / a JSON Schema validator) before use; never
   trust raw model text as valid.
5. **Repair on failure.** Re-ask with the validation error or auto-fix minor issues — but bound retries (each
   costs tokens and latency) and log every failure.
6. **Handle refusals & uncertainty.** Allow explicit null / "unknown" fields so the model isn't forced to invent
   values (ties to `hallucination-mitigation-coach`).
7. **Evaluate** schema-valid rate *and* field accuracy on a sample set; valid JSON can still be wrong (`eval-designer`).
8. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Schema: fields, types, required/optional (JSON Schema)
Mechanism: prompt / JSON mode / tool call / guaranteed
Decoding: constrained? (grammar/regex) and why
Validation: library + where it runs
Repair: retry policy, bounded, logged
Eval: schema-valid rate + field accuracy
Learning Footer
```

## Tips

- Schema-valid ≠ correct — constrained decoding guarantees shape, not truth; still validate values and eval accuracy.
- Prefer the strongest guarantee your provider offers over a prompt-only "please return JSON", which fails under load.
- Keep schemas small and flat; every extra nested or optional field is another place to go wrong.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
