---
name: hallucination-mitigation-coach
description: "Reduce LLM hallucinations (confident, wrong output): ground with RAG, require citations, use self-consistency and self-checking, let the model abstain ('I don't know'), and evaluate faithfulness. Use for 'model makes things up', 'wrong but confident answers', 'add citations', 'reduce hallucination', 'faithfulness/groundedness eval', or 'when should it say I don't know'. Teaches mitigation, not a cure."
argument-hint: "The app + failure examples"
---

# Hallucination Mitigation Coach

Lower the rate of confident-but-false output — accepting that hallucination can be **reduced, not eliminated** —
following the honesty and source-discipline principles in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner's LLM invents facts, sources, or APIs and needs grounding, abstention, and faithfulness checks.
- Pairs with `rag-designer` (grounding), `llm-guardrails-designer` (output checks), and `eval-designer`.

## Procedure

1. **Classify the failures.** Separate *factuality* (wrong about the world) from *faithfulness* (contradicts the
   provided context) using real examples (taxonomy: Huang et al., arXiv:2311.05232, 2023-11-09).
2. **Ground the answer.** Supply authoritative context via retrieval and instruct the model to answer *only* from
   it (`rag-designer`; RAG, Lewis et al., arXiv:2005.11401, 2020-05-22) — grounding attacks the root cause.
3. **Require citations.** Make the model quote and attribute sources so each claim is checkable; unsupported
   sentences become visible.
4. **Add self-checking.** Sample multiple answers and keep the consistent one (self-consistency, Wang et al.,
   arXiv:2203.11171, 2022-03-21); verify with follow-up questions (Chain-of-Verification, Dhuliawala et al.,
   arXiv:2309.11495, 2023-09-20) or sampling-based checks (SelfCheckGPT, Manakul et al., arXiv:2303.08896,
   2023-03-15) — each adds cost and latency.
5. **Enable abstention.** Reward "I don't know" and refusals over guessing; a designed non-answer beats a confident lie.
6. **Evaluate faithfulness** on a labeled set (grounded-vs-hallucinated, citation validity) and track the rate
   over time (`eval-designer`).
7. End with the **Learning Footer** (`AGENTS.md`).

## Output shape

```
Failure log: factuality vs. faithfulness examples
Grounding: retrieval source + "answer only from context"
Citations: attribution format, checkable claims
Self-checks: consistency / verification (with cost note)
Abstention: when and how the model says "I don't know"
Eval: faithfulness + citation-validity rate
Learning Footer
```

## Tips

- You mitigate, never fully cure — set an acceptable rate and design abstention or human review for the rest.
- Most "hallucinations" in RAG are retrieval failures — check what context was supplied before blaming the model.
- Self-consistency and verification cut errors but multiply cost and latency; reserve them for high-stakes answers.
- Close with the **Learning Footer** (`AGENTS.md`) so the learner knows the next step.
