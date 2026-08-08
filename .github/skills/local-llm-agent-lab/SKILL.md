---
name: local-llm-agent-lab
description: "Hands-on local agent lab — build a small tool-using LLM agent against a local Ollama model with no API key, no subscription, and no cost, fully offline. Define tool schemas, run the observe-act loop with function/tool calling, and add guardrails (max steps, arg validation). Use for 'local AI agent', 'tool calling with Ollama', 'function calling offline', 'ReAct loop', 'agent guardrails', or a hands-on lab for local agents."
argument-hint: "The agent goal"
---

# Local LLM Agent Lab

Build a minimal tool-using agent on a local model and learn the loop, tool calling, and **guardrails** —
plus why small local models need tighter limits — per [`AGENTS.md`](../../../AGENTS.md).
Pairs with [agent-designer](../agent-designer/SKILL.md) and [ollama-local-llm-lab](../ollama-local-llm-lab/SKILL.md).

## When to use

- The learner wants to give a **local, free** LLM tools (calculator, search-your-files) and watch it plan, act, and stop — offline.
- After [ollama-local-llm-lab](../ollama-local-llm-lab/SKILL.md); deeper design and failure modes in [agent-designer](../agent-designer/SKILL.md).

## Procedure

1. **Concept** — an agent loops: the LLM picks a **tool call**, your code runs it, the result is fed back,
   repeat until a final answer (ReAct: Yao et al., arXiv:2210.03629, 2022-10-06).
2. **Pick a tool-capable model** — pull one that supports tools (e.g., `llama3.1`, `qwen2.5`) and run Ollama
   locally ([ollama-local-llm-lab](../ollama-local-llm-lab/SKILL.md)); not all models can call tools (ollama.com, *Tool support*, 2024).
3. **Define tools** — pass a JSON schema (name, description, parameters) in the `/api/chat` `tools` field and
   implement each tool as a real local function (ollama.com, *API reference — chat/tools*, 2025).
4. **Run the loop** — send `messages` + `tools`; if the reply has `tool_calls`, execute them, append a
   `role: "tool"` message with the result, and call again until a plain answer comes back.
5. **Exercise — add guardrails** — cap iterations (e.g., ≤5), **validate/whitelist** tool args, time out
   calls, and handle malformed JSON so a confused model can't loop forever or do damage.
6. ⚠ **Verify** — trace each step (thought → tool → result) and test a prompt needing no tool; confirm the
   loop terminates and tools ran with safe args. Offline, no API key.

## Output shape

```
Goal: <task> | Model: llama3.1 (tool-capable, local)
Tools: JSON schema {name, description, parameters} → local fn
Loop: chat(messages, tools) → tool_calls → run → role:"tool" → repeat
Guardrails: max steps ≤5 · arg whitelist/validation · timeouts
Stop: final assistant message with no tool_calls
Verify: steps traced · loop terminates · offline · no API key
```

## Tips

- Small local models call tools **less reliably** than frontier APIs — expect wrong names, bad args, or loops; keep tools few and schemas tiny.
- Guardrails are not optional: always cap iterations and validate arguments before executing anything.
- Ground knowledge with retrieval ([ollama-rag-lab](../ollama-rag-lab/SKILL.md)) and design bigger agents with [agent-designer](../agent-designer/SKILL.md); end with the **Learning Footer** (`AGENTS.md`).
