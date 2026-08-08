---
name: ollama-local-llm-lab
description: "Hands-on Ollama lab — run open-weight LLMs locally on Mac/Windows/Linux with no API key, no subscription, and no cost, fully offline. Pull a model, chat in the terminal, and call the local REST API (/api/generate, /api/chat) on port 11434. Use for 'run an LLM locally', 'Ollama basics', 'local LLM API', 'offline chatbot', 'no API key LLM', 'llama3.2/mistral/qwen locally', or a hands-on lab for local inference."
argument-hint: "The local LLM task"
---

# Ollama Local LLM Lab

Run open-weight LLMs on your own machine — no API key, no cloud, no bill — while learning what local
inference can and can't do, per the teaching and source-discipline principles in [`AGENTS.md`](../../../AGENTS.md).
Pairs with [ollama-rag-lab](../ollama-rag-lab/SKILL.md) and [local-llm-agent-lab](../local-llm-agent-lab/SKILL.md).

## When to use

- The learner wants a free, private, offline LLM to chat with *and* call from code, without signing up anywhere.
- Groundwork before [ollama-rag-lab](../ollama-rag-lab/SKILL.md) or tuning prompts with [prompt-optimizer](../prompt-optimizer/SKILL.md).

## Procedure

1. **Concept** — Ollama runs quantized GGUF models via a background server on `http://localhost:11434`;
   nothing leaves your machine, and model size is bounded by your **RAM/VRAM** (ollama.com, *docs*, 2025).
2. **Install & pull** — install Ollama, then `ollama pull llama3.2` downloads a model once (offline after);
   `ollama list` shows local models (github.com/ollama/ollama, *README*, 2025).
3. **Chat locally** — `ollama run llama3.2` opens an interactive prompt; ask a factual *and* a reasoning
   question to feel the model's limits versus a hosted frontier model.
4. **Exercise — call the API** — with the server up, POST to `/api/generate` (one-shot) or `/api/chat`
   (multi-turn `messages`); set `"stream": false` for a single JSON reply (ollama.com, *API reference*, 2025).
5. ⚠ **Verify** — disconnect the network and re-run to prove it's offline, check `ollama ps` for the loaded
   model, and **fact-check** an answer — small local models hallucinate more than large hosted ones.
6. **Tips** — swap models (`mistral`, `qwen2.5`), tune `options.temperature`/`num_ctx`, or reuse the
   OpenAI-compatible endpoint at `/v1` for existing SDK code (ollama.com, *OpenAI compatibility*, 2024).

## Output shape

```
Task: <what you want the local LLM to do>
Model: llama3.2 (pulled once) | Host: localhost:11434 (offline)
Chat: ollama run <model> → terminal Q&A
API: POST /api/chat {messages, stream:false} → JSON
Limits: fits RAM/VRAM · quantized · weaker/slower than frontier APIs
Verify: network off still works · answer fact-checked
```

## Tips

- Bigger ≠ better locally — a 7–8B quantized model may be all your RAM allows; measure tokens/sec and quality on *your* task.
- Free and private, but there's no knowledge-cutoff fix — add retrieval via [ollama-rag-lab](../ollama-rag-lab/SKILL.md) for grounded facts.
- Keep models warm with `keep_alive`; end with the **Learning Footer** (`AGENTS.md`) — one model to compare + one API call to script.
