---
name: multi-agent-orchestration-coach
description: "Orchestrate multiple LLM agents that work together: roles/specialization, handoffs, shared state/memory, supervisor (orchestrator-worker) vs. peer patterns, and failure/loop/cost control. Use for 'multi-agent system', 'agents talking to each other', 'supervisor/router agent', 'agent handoff', 'crew/team of agents', 'agents stuck in a loop', or 'is one agent enough'. Teaches when NOT to go multi-agent, too."
argument-hint: "The multi-agent goal"
---

# Multi-Agent Orchestration Coach

Coordinate several LLM agents into one reliable system — **and first question whether you need more than one** —
per the teaching principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner wants specialized agents to collaborate (research + write + review) or a supervisor to route work.
- Builds on `agent-designer` (each agent) and pairs with `llm-guardrails-designer` and `eval-designer`.

## Procedure

1. **Justify the topology.** Multi-agent adds coordination cost and new failure modes; use it only when roles
   genuinely differ or work parallelizes — often one well-scoped agent (`agent-designer`) wins.
2. **Define roles & interfaces.** Give each agent a narrow job, typed inputs/outputs, and tools; specialization
   beats one agent trying to do everything.
3. **Choose a pattern.** Supervisor / orchestrator-worker (a router delegates and aggregates) vs. peer
   conversation (AutoGen, Wu et al., arXiv:2308.08155, 2023-08-16); Anthropic frames these as composable
   workflows (*Building Effective Agents*, anthropic.com, 2024-12-19).
4. **Design handoffs & shared state.** Pass distilled structured messages (not raw transcripts), decide what is
   shared vs. private, and stop context from bloating as agents accumulate history.
5. **Control failure & loops.** Cap turns, add timeouts and budgets, and define who decides "done"; misaligned
   agents, repetition, and no-stop loops dominate real failures (Cemri et al., *Why Do Multi-Agent LLM Systems
   Fail?*, arXiv:2503.13657, 2025-03-17).
6. **Add a verifier/human gate** for irreversible actions and route unsafe output through guardrails (`llm-guardrails-designer`).
7. **Evaluate the whole trajectory** — task success, per-agent correctness, message count, latency, and total cost (`eval-designer`).
8. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Goal & justification: why >1 agent (or not)
Roles: agent → job → tools → I/O
Pattern: supervisor / peers — with coordination cost
State & handoffs: shared vs. private, message format
Failure control: turn cap, timeout, budget, stop rule
Eval: trajectory success + per-agent + cost
Learning Footer
```

## Tips

- More agents = more coordination, more tokens, more ways to fail — start with one and split only when it pays off.
- Handoffs leak context — pass distilled messages, not whole histories, or cost and confusion explode.
- Most multi-agent failures are specification and verification gaps, not model IQ — log every message and inspect it.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
