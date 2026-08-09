---
name: prompt-injection-defense
description: "Defend LLM applications against prompt injection — DEFENSIVE ONLY. Teaches why injection is structurally unsolved (instructions and data share one channel), the difference between direct and indirect/data-borne injection via RAG corpora, tool output, web pages and files, and a defense-in-depth playbook: treat all external content as untrusted, separate instructions from data with delimiters and spotlighting, least-privilege tools with allowlists, human-in-the-loop for high-impact actions, output validation and filtering, secrets out of the prompt, sandboxed side effects, and monitoring. Maps to OWASP LLM Top 10 (LLM01). Use for 'prompt injection', 'secure my LLM app', 'indirect injection via RAG', 'jailbreak defense', 'untrusted content in prompts', 'my agent followed instructions from a web page'."
argument-hint: "The LLM app/agent, its untrusted inputs, and the tools it can call"
---

# Prompt Injection Defense

Harden an LLM application against instructions smuggled in through its own data — **defensive only**,
following the security stance in [`AGENTS.md`](../../../AGENTS.md).

> **Scope guardrail.** This skill teaches **detection, mitigation, and secure design**. It will not write
> injection payloads, jailbreaks, filter bypasses, or exfiltration techniques, and will not "test" a
> system the learner does not own. If asked for an attack, refuse and redirect to the defenses below and
> to responsible disclosure. Adversarial testing belongs to an authorized red team with written scope.

## When to use

- The app puts **any** content the user did not author into the prompt: RAG chunks, emails, PDFs, web
  pages, code, issue trackers, tool results, other models' output.
- The agent can **act** — send mail, call APIs, write files, run code, spend money.
- The learner asks "is my system prompt safe?" or "how do I stop users overriding my instructions?"
- After an incident: the assistant did something nobody asked for and the source is unclear.
- Related: [llm-guardrails-designer](../llm-guardrails-designer/SKILL.md) (policy/output guardrails),
  [threat-model](../threat-model/SKILL.md) (STRIDE on the whole system),
  [secure-code-review](../secure-code-review/SKILL.md) (the code around it).

## Why it is unsolved (first principles)

A transformer sees **one flat token stream**. There is no hardware-enforced boundary between "your
developer instructions" and "the document you were asked to summarize" — the separation is a *convention*
the model is trained to respect, not a control the runtime enforces. SQL injection has a real fix
(parameterized queries put data on a separate channel); prompts have no equivalent today. Therefore:
**assume some injections will succeed, and design so that success is not catastrophic.**

This is **LLM01: Prompt Injection** in the **OWASP Top 10 for LLM Applications**; excessive tool
permissions (OWASP "excessive agency") is what turns an injection into an incident.

## Direct vs. indirect

```mermaid
flowchart LR
    U[User input] -->|direct injection| P[Prompt assembly]
    W[Web page / PDF / email] --> R[Retriever / crawler]
    D[(Vector store)] --> R
    T[Tool + API output] --> P
    R -->|indirect, data-borne| P
    P --> M[LLM]
    M -->|proposed action| G{Policy gate<br/>allowlist + approval}
    G -->|allowed| A[Tool executes]
    G -->|blocked| L[Log + alert + deny]
    M --> O[Output validation] --> UI[Render to user]
```

| | **Direct** | **Indirect / data-borne** |
| --- | --- | --- |
| Who supplies it | The person chatting | A document, page, file, ticket, or tool result |
| Typical goal | Override the persona, extract the system prompt | Make the agent act — exfiltrate data, call a tool, poison an answer |
| Who is harmed | Usually the same user | Often a **different** user or the organization |
| Detectability | Visible in the transcript | Buried in content nobody reads |
| Why it's worse | — | The victim never typed anything malicious; trust is inherited from the data source |

## Procedure

1. **Map the trust boundaries.** List every string that reaches the model and label each
   `trusted` (your prompt template, your code) or `untrusted` (everything else — including your *own*
   database if users can write to it, and the model's previous output).
2. **Inventory capability, not just content.** For each tool: what can it read, write, spend, or send?
   The blast radius of an injection equals the union of the agent's permissions.
3. **Separate instructions from data.** Put untrusted content in clearly delimited, uniquely tagged
   blocks; state in the system prompt that content inside them is **data to analyze, never instructions
   to obey**. Restate the rule *after* the data (recency helps). "Spotlighting" techniques (marking or
   encoding untrusted spans so the model can tell them apart) raise the bar — they do not close the hole.
4. **Apply least privilege to tools.** Scoped read-only credentials by default; per-tool allowlists of
   domains, tables, paths, and recipients; separate identities per tool; no ambient admin token. An agent
   that cannot send email cannot be made to exfiltrate by email.
5. **Gate high-impact actions with a human.** Irreversible, financial, external-facing, or
   permission-changing actions get an approval step that shows **the exact action and its arguments** in
   plain language. Design the UI so approving is a decision, not a reflex.
6. **Validate output like any untrusted input.** Constrain to a schema
   ([structured-output-coach](../structured-output-coach/SKILL.md)); never `eval` model output; escape
   before rendering (HTML/markdown injection); strip or refuse auto-loading images and links to
   attacker-chosen URLs, which are a classic exfiltration channel for data placed in query strings.
7. **Keep secrets out of the prompt entirely.** API keys, other users' data, and internal URLs belong in
   the execution layer behind a tool, not in context. Assume the whole prompt may be revealed;
   a system prompt is a *product* decision, not a security control.
8. **Sandbox side effects.** Run generated code in an isolated, network-restricted, ephemeral
   environment; apply SSRF guards to any model-supplied URL (deny loopback, private, link-local, and
   cloud-metadata ranges; re-validate every redirect); default-deny egress.
9. **Segment context.** Don't mix a high-privilege session with untrusted browsing; use a separate,
   low-privilege sub-agent to read hostile content and return a **structured summary** rather than raw
   text. Clear or scope memory so a poisoned note doesn't persist across sessions.
10. **Monitor and rehearse.** Log full prompts, retrieved chunk IDs, tool calls, and arguments; alert on
    anomalies (unexpected recipients, sudden data volume, tool sequences never seen before). Keep a
    regression suite of **known-bad documents you own** so defenses don't silently degrade — run it in CI
    ([ci-pipeline-builder](../ci-pipeline-builder/SKILL.md)), and verify parsers/validators with `#run`
    (`learningos_runcode`).

## Defense scorecard

| Control | Stops direct | Stops indirect | Residual risk |
| --- | --- | --- | --- |
| Delimiters + "data, not instructions" | Partial | Partial | Persuasive payloads still land |
| Spotlighting / tagging untrusted spans | Partial | Partial | Model may still comply |
| Input classifier / filter | Partial | Partial | Bypassable; false positives |
| **Least-privilege tools + allowlists** | Strong | **Strong** | Misconfigured scope |
| **Human approval on high-impact actions** | Strong | **Strong** | Approval fatigue |
| Output schema validation + escaping | Partial | Strong | Only covers modelled fields |
| Sandbox + egress deny + SSRF guard | Strong | Strong | Sandbox escapes |
| Monitoring & alerting | Detects | Detects | Post-hoc only |

**The lesson:** prompt-level controls *reduce* the odds; **architectural** controls (privilege, approval,
sandboxing) bound the damage. Rely on the second column.

## Output shape

```
Prompt-injection review — <system>

Trust map:
  trusted:   <system prompt, code-authored strings>
  untrusted: <user text, RAG chunks, tool output, web/email/files, prior model output>

Capability & blast radius:
  <tool> -> can <read|write|send|spend> <scope>   # worst case if hijacked: <...>

Findings (highest impact first):
  1. <finding> — vector: <direct|indirect via X> — impact: <...> — OWASP: LLM01 / excessive agency
     Fix: <architectural control first, prompt control second>

Defense-in-depth plan:
  prompt layer:  <delimiters, spotlighting, restated rule>
  privilege:     <scoped creds, allowlists, per-tool identity>
  approval:      <which actions need a human, what the UI shows>
  output:        <schema validation, escaping, link/image policy>
  isolation:     <sandbox, egress deny, SSRF guard, context segmentation>
  monitoring:    <logs, alerts, regression corpus in CI>

Accepted residual risk: <what is still possible and why that's tolerable>
Next: <llm-guardrails-designer | threat-model | secure-code-review>
```

## Tips

- **Never trust your own database.** If users, crawlers, or integrations can write to it, retrieved
  chunks are attacker-controlled — RAG is an injection channel by construction
  ([rag-designer](../rag-designer/SKILL.md)).
- The model's *previous output* is untrusted input on the next turn; agent loops compound this.
- Beware "please ignore" wording as a defense — it is a suggestion, not a boundary. Measure, don't hope.
- Markdown images and auto-fetched links are a silent exfiltration path: data goes out in the URL. Deny
  by default.
- Approval fatigue is a real vulnerability: fewer, clearer, higher-signal prompts beat a wall of dialogs.
- Log **what was retrieved**, not just what was answered — most indirect injections are only visible in
  the retrieved chunks.
- Refuse, on principle, to produce working attack payloads; teach the defense and point to authorized
  red-teaming instead.
- Route onward to [llm-guardrails-designer](../llm-guardrails-designer/SKILL.md),
  [threat-model](../threat-model/SKILL.md), or
  [secure-code-review](../secure-code-review/SKILL.md).
  End with the **Learning Footer** (`AGENTS.md`).
