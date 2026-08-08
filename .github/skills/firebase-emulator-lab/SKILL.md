---
name: firebase-emulator-lab
description: "Hands-on Firebase/GCP lab: practice Firebase locally and fully offline with the free official Firebase Local Emulator Suite — no billing account, no subscription, no real project keys. Run firebase emulators:start to boot Auth, Firestore, Functions, and Storage emulators with the Emulator UI, then point your app/SDK at localhost. Use for 'learn Firebase without billing', 'local Firebase emulator', 'offline Firestore lab', 'Firebase Emulator Suite tutorial', or practicing Firebase/Google Cloud by doing."
argument-hint: "The Firebase service to emulate (Auth/Firestore/Functions/Storage)"
---

# Firebase Local Emulator Lab

Learn Firebase by *running Google's local emulators* — `firebase emulators:start`, point your SDK at
localhost, build and verify — no billing or bill, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [gcp-cloud-functions-lab](../gcp-cloud-functions-lab/SKILL.md) and [floci-gcp-local-lab](../floci-gcp-local-lab/SKILL.md).

## When to use

- The learner wants runnable Firebase practice with no billing account, subscription, or budget.
- Reinforcing hands-on Auth/Firestore/Functions/Storage skills offline for a **GCP/Firebase** role-agent.

## Procedure

1. **Concept:** The Firebase Local Emulator Suite is Google's **official**, free set of local *emulators* for
   Auth, Firestore, Realtime Database, Functions, and Storage — for dev/test, approximating (not replacing)
   the cloud (firebase.google.com/docs/emulator-suite, 2026).
2. **Start it:** `firebase emulators:start` boots the emulators plus the **Emulator UI** on `4000`; defaults
   are Firestore `8080`, Auth `9099`, Functions `5001`, Storage `9199` (the Firebase CLI runs it — no Docker
   needed).
3. **Point your tools:** in code, connect the SDK to the emulators (e.g.,
   `connectFirestoreEmulator(db, "localhost", 8080)`) so all reads/writes stay local.
4. **Do a small exercise:** create a user in the Auth emulator, then write and read a Firestore document.
5. **Verify:** the document and user show in the Emulator UI at `http://localhost:4000` — approximate
   behavior, so cross-check security rules and quotas in the Firebase docs.
6. ⚠ **Clean up:** stop with Ctrl-C; emulator data is in-memory and clears on exit (use `--export-on-exit`
   only if you *want* to persist it).

## Output shape

```
Start:  firebase emulators:start  →  Emulator UI http://localhost:4000
Ports:  Firestore 8080 · Auth 9099 · Functions 5001 · Storage 9199
Point:  app SDK  →  connect*Emulator(…) / *_EMULATOR_HOST env
Verify: Emulator UI shows the doc/user   ·   Clean: Ctrl-C (in-memory) ⚠
# firebase.json
{
  "emulators": {
    "ui":        { "enabled": true, "port": 4000 },
    "auth":      { "port": 9099 },
    "firestore": { "port": 8080 },
    "functions": { "port": 5001 },
    "storage":   { "port": 9199 }
  }
}
```

## Tips

- The Suite is free and official but *emulates* Firebase — production security rules, quotas, and some triggers differ, so validate anything you ship against the official Firebase/Google Cloud docs.
- Cloud Firebase itself has free (Spark) and paid (Blaze) plans; the emulator runs offline for free but is not a production backend.
- End with the **Learning Footer** (`AGENTS.md`) — one service (Functions triggers, Storage rules) to emulate next + one behavior to verify against real Firebase yourself.
