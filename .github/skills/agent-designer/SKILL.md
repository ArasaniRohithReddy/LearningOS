---
name: agent-designer
description: "Design an LLM agent: decompose the task, wire tool/function calling, choose memory, pick a planning loop (ReAct/reflection), integrate tools via MCP, add guardrails, and evaluate agentic behavior end to end. Use for 'build an AI agent', 'tool/function calling', 'ReAct/planning loop', 'give the LLM tools', 'agent memory', 'MCP integration', or 'why is my agent looping'. Teaches the design and its failure modes."
argument-hint: "The agent's goal + available tools"
---

# Agent Designer

Design an LLM agent that plans, calls tools, and knows when to stop — **explaining every trade-off and
failure mode** — per the teaching principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner needs an LLM to *act* (call tools/APIs, take multi-step actions), not just answer once.
- Pairs with `prompt-optimizer` (its prompts), `rag-designer` (a retrieval tool), and `eval-designer`.

## Procedure

1. **Define goal & boundaries.** What the agent may do, what it must never do, success criteria, and
   where a human approves — prefer the simplest option (a plain prompt or RAG) if it suffices.
2. **Decompose the task** into steps/sub-goals; decide fixed workflow vs. dynamic planning.
3. **Choose the loop.** Interleave reasoning and acting with **ReAct** (Yao et al., arXiv:2210.03629,
   2022-10-06); add self-critique via **Reflexion** (Shinn et al., arXiv:2303.11366, 2023-03-20) — each
   step costs latency and tokens.
4. **Wire tools/function calling.** Give typed, well-described tools; **MCP** standardizes tool/data
   access (Anthropic, modelcontextprotocol.io, 2024-11-25). Validate arguments and handle tool errors.
5. **Add memory** deliberately: short-term (scratchpad/history) vs. long-term (vector store) — more
   memory means more tokens and stale-context risk.
6. **Set guardrails:** step/loop caps, timeouts, cost budgets, permission gates, and output validation —
   agents loop, hallucinate tool calls, and compound errors.
7. **Evaluate the trajectory**, not just the final answer: task success, tool-call correctness, steps,
   and cost (`eval-designer`).
8. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Goal & boundaries: allowed / forbidden / human-in-loop
Decomposition: steps or planning strategy
Loop: ReAct / reflection — with cost note
Tools: name → signature → guardrail (MCP?)
Memory: short vs. long term, and why
Guardrails: step cap, budget, validation, permissions
Eval: trajectory + tool correctness + cost
Learning Footer
```

## Tips

- Start with the least agency that works; every extra step adds latency, cost, and a place to fail.
- Most agent bugs are tool/planning failures — log the full trajectory and inspect it before blaming the model.
- Always cap steps, time, and spend — an unbounded loop is an unbounded bill.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
