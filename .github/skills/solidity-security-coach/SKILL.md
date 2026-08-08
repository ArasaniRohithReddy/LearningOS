---
name: solidity-security-coach
description: "DEFENSIVE Solidity security — teach the most common smart-contract vulnerabilities (reentrancy, integer overflow/underflow, broken access control, unchecked low-level calls, tx.origin auth, front-running) and how to PREVENT them with checks-effects-interactions, guards, and OpenZeppelin patterns. Use for 'is my contract safe', 'harden this contract', 'audit my Solidity', 'reentrancy help', or 'access control review'. Prevention only — never exploitation."
argument-hint: "The contract to harden"
---

# Solidity Security Coach

Teach the learner to **find and fix** contract weaknesses so they write safer Solidity — authorized,
defensive review only, per the guardrails in [`AGENTS.md`](../../../AGENTS.md). Never explain how to
exploit a flaw. Complements [secure-code-review](../secure-code-review/SKILL.md) and
[smart-contract-coach](../smart-contract-coach/SKILL.md).

## When to use

- The learner shares a contract and wants a security pass with fixes and the principle behind each.
- Hardening before deploying to a **testnet / local chain — never with real funds**.

## Procedure

1. **Confirm scope.** Language/version, framework, trust boundaries, and that the review is authorized.
2. **Walk the classics (risk → fix):** reentrancy → **checks-effects-interactions** + `ReentrancyGuard`;
   overflow/underflow → Solidity ≥0.8 checked math (avoid `unchecked`); broken access control →
   `Ownable`/`AccessControl`, not `tx.origin`; unchecked low-level `call` → check the return, handle failure.
3. **Explain the why.** Per finding give **what** (named risk) → **why** (the principle) → **fixed code**.
4. **Prove it.** Suggest a failing-then-passing test that locks the fix in (e.g., a reentrancy-guard test).
5. **Rank by severity;** separate confirmed issues from things to verify — never invent a CVE or version.

## Output shape

```
Summary: <posture + biggest risk>
[Critical] Reentrancy — <finding> → why → fixed code (CEI + guard)
[High]     Access control — tx.origin/missing check → fix
Verify: <items needing runtime/context confirmation>
Tests to add: <security regression tests>
Learning Footer
```

## Tips

- Frame every note as prevention/hardening — never as how to exploit the flaw.
- Prefer audited building blocks: OpenZeppelin Contracts; cite Solidity & OZ docs (versions/dates).
- End with the **Learning Footer** (`AGENTS.md`).
