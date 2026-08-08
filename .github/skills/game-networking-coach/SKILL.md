---
name: game-networking-coach
description: "Teach real-time multiplayer networking from first principles — authoritative client-server vs peer-to-peer, client-side prediction and server reconciliation, entity interpolation, and lag compensation (server rewind). Use for 'how does multiplayer netcode work', 'client prediction and reconciliation', 'why does my movement rubber-band', 'authoritative server', 'lag compensation / hit registration', or designing netcode."
argument-hint: "The multiplayer need or netcode symptom"
---

# Game Networking Coach

Teach how many machines share one world over a laggy link — hiding latency without letting clients cheat,
per the teaching and Learning Footer guidance in [`AGENTS.md`](../../../AGENTS.md).

## When to use

- The learner is adding multiplayer and hits rubber-banding, cheating, or "shots that don't register".
- Complements [concept-explainer](../concept-explainer/SKILL.md) and [game-loop-coach](../game-loop-coach/SKILL.md).

## Procedure

1. **Pick a model.** Prefer an **authoritative server**: clients send *inputs*, the server simulates and is
   the source of truth (P2P/lockstep suits deterministic RTS but trusts peers).
2. **Predict on the client.** Apply local input immediately instead of waiting a round-trip, so control
   feels instant.
3. **Reconcile.** The server replies with authoritative state + the last-processed input number; the client
   rewinds and **re-simulates** unacknowledged inputs — a mismatch shows as a correction (rubber-band).
4. **Interpolate other entities** by rendering them ~100 ms in the past from a buffer, so remote motion is
   smooth despite discrete packets.
5. **Compensate for lag** — the server rewinds targets to the shooter's view time for fair hit
   registration; balance it against the "shot behind cover" feeling.

## Output shape

```
Model: authoritative server | topology: <C/S, P2P>
Local player: predict → server ack (input seq) → reconcile + replay
Remote players: interpolate at t − <~100 ms> from buffer
Lag comp: rewind to t − RTT/2 | symptom→cause: rubber-band→misprediction
```

## Tips

- Engine map: Unreal Actor **replication** + RPCs + `CharacterMovementComponent` prediction (UE5 docs);
  Unity **Netcode for GameObjects** (NGO, Unity docs); Godot high-level `MultiplayerSynchronizer` / `@rpc` (Godot 4 docs).
- Never trust the client for authoritative outcomes (position, damage, score); validate on the server.
- Verify against engine netcode docs by version; never fabricate. End with the **Learning Footer** (`AGENTS.md`).
