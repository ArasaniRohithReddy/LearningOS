---
name: gcp-pubsub-emulator-lab
description: "Hands-on GCP lab: practice Google Cloud Pub/Sub locally and fully offline with the free official Pub/Sub emulator — no Google Cloud billing account, no subscription, no real credentials. Start it with gcloud beta emulators pubsub start, export PUBSUB_EMULATOR_HOST, then use the client libraries to create topics/subscriptions and publish/pull messages. Use for 'learn Pub/Sub without billing', 'local Pub/Sub emulator', 'offline GCP messaging lab', 'PUBSUB_EMULATOR_HOST', or practicing pub/sub messaging by doing."
argument-hint: "The Pub/Sub task (topics/subscriptions/publish/pull)"
---

# GCP Pub/Sub Emulator Lab

Learn Pub/Sub by *running Google's local emulator* — start it, export one env var, publish and verify — no
project or bill, per [`AGENTS.md`](../../../AGENTS.md). Pairs with [gcp-pubsub-lab](../gcp-pubsub-lab/SKILL.md) and [floci-gcp-local-lab](../floci-gcp-local-lab/SKILL.md).

## When to use

- The learner wants runnable Pub/Sub practice with no Google Cloud billing, subscription, or budget.
- Reinforcing hands-on messaging (topics, subscriptions, publish/pull) offline for a **GCP/backend** role-agent.

## Procedure

1. **Concept:** The Pub/Sub emulator is Google's **official** local *emulator* for dev/test — it approximates
   the Pub/Sub API in-process, with no cloud project or bill; some admin/IAM features are unsupported
   (cloud.google.com/pubsub/docs/emulator, 2026).
2. **Start it:** `gcloud beta emulators pubsub start --host-port=localhost:8085` (needs the free gcloud CLI +
   Java). A community Docker image can wrap the same command if you prefer containers.
3. **Point your tools:** in the app terminal, `export PUBSUB_EMULATOR_HOST=localhost:8085` (and
   `PUBSUB_PROJECT_ID=demo`) so the client libraries auto-target the emulator instead of the cloud.
4. **Do a small exercise:** create a topic and a subscription, publish a message, then pull it with the
   client library.
5. **Verify:** the pulled message matches what you published — approximate behavior, so cross-check
   delivery/ordering/retention semantics in the Pub/Sub docs.
6. ⚠ **Clean up:** stop the emulator with Ctrl-C and `unset PUBSUB_EMULATOR_HOST`; its state is in-memory
   and gone on exit, but a stale env var silently keeps apps pointed at nothing.

## Output shape

```
Start:  gcloud beta emulators pubsub start --host-port=localhost:8085
Point:  export PUBSUB_EMULATOR_HOST=localhost:8085 ; PUBSUB_PROJECT_ID=demo
Try:    create topic → subscription → publish → pull (client library)
Verify: pulled == published   ·   Clean: Ctrl-C + unset PUBSUB_EMULATOR_HOST ⚠
# start (separate terminals)
gcloud beta emulators pubsub start --host-port=localhost:8085
# in the app terminal, before running your code:
export PUBSUB_EMULATOR_HOST=localhost:8085
export PUBSUB_PROJECT_ID=demo
```

## Tips

- The emulator is free and official but *approximate* — it omits IAM, some admin operations, and exact retention/ordering timing, so validate anything you ship against the official Pub/Sub docs.
- Always `unset PUBSUB_EMULATOR_HOST` when done, or real client code will silently fail to reach Google Cloud.
- End with the **Learning Footer** (`AGENTS.md`) — one messaging pattern (dead-letter, ordering keys) to try next + one behavior to verify against real Pub/Sub yourself.
