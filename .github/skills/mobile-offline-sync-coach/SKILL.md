---
name: mobile-offline-sync-coach
description: "Design offline-first mobile apps as a lesson — local store, background sync, conflict resolution, and an outbox queue on iOS and Android. Use for 'offline-first', 'offline sync', 'Core Data/SwiftData vs Room', 'CloudKit sync', 'WorkManager sync', 'conflict resolution / last-write-wins', 'outbox queue', or 'app must work with no network'."
argument-hint: "The offline need"
---

# Mobile Offline Sync Coach

Design offline-first mobile so the app works with no network and reconciles later — local store, sync,
conflicts, and queueing — per the coding standards and Learning Footer in
[`AGENTS.md`](../../../AGENTS.md). Pairs with [caching-strategy-coach](../caching-strategy-coach/SKILL.md).

## When to use

- The learner needs the app usable offline, then synced when connectivity returns.
- Reconciling edits made on multiple devices, or making retries safe.

## Procedure

1. **Make local the source of truth** — read/write a local store first; UI never blocks on the
   network. iOS: SwiftData/Core Data; Android: Room (Apple, *Core Data*; Android, *Save data with Room*, 2024).
2. **Choose a sync strategy** — pull, push, or bidirectional; delta vs snapshot. iOS:
   `NSPersistentCloudKitContainer`; Android: `WorkManager` periodic/one-time sync with constraints.
3. **Queue mutations (outbox)** — record local changes with a status; retry with exponential backoff;
   make writes idempotent (see [api-design-review](../api-design-review/SKILL.md)).
4. **Resolve conflicts** — pick a policy: last-write-wins, server-wins, or field-merge/CRDT; version
   rows with timestamps/vector clocks (Core Data `NSMergePolicy`).
5. **Cache and invalidate** — layer a cache with clear invalidation (pair
   [caching-strategy-coach](../caching-strategy-coach/SKILL.md)).
6. **Handle edge cases** — tombstones for deletes, clock skew, large payloads, auth expiry mid-sync.

## Output shape

```
Local store: SwiftData/Core Data | Room — source of truth
Sync: pull | push | bidirectional · delta vs snapshot
Queue: outbox rows + status + backoff (idempotent)
Conflict: LWW | server-wins | merge/CRDT — version by …
Invalidation: cache TTL / etag
Edge cases: deletes(tombstone) · clock skew · auth
```

## Tips

- "Sync" is a queue plus a conflict policy — decide the policy before writing code.
- Idempotent writes make retries safe; without them, retries corrupt data.
- Test airplane mode → reconnect; end with the **Learning Footer** (`AGENTS.md`).
