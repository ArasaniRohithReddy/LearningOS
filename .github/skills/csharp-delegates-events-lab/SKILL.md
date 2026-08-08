---
name: csharp-delegates-events-lab
description: "Hands-on C# lab on delegates and events: delegate types, built-in Func/Action/Predicate, lambda expressions, and the publisher/subscriber event pattern with EventHandler and safe ?.Invoke. Use for 'teach me delegates and events', 'hands-on delegates lab', 'Func vs Action', 'the event pattern', 'EventHandler<T>', or practicing C# callbacks and events by building them."
argument-hint: "The callback/event"
---

# C# Delegates & Events Lab

Learn delegates and events by wiring a publisher to subscribers yourself — a guided, hands-on lab
following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to pass behavior as data (callbacks) or broadcast notifications to many listeners.
- Teaching `Func`/`Action` and the event pattern for **Coding Mentor** or an [`oop-design-coach`](../oop-design-coach/SKILL.md) session.

## Procedure
**Concept (60s):** a delegate is a *type-safe reference to a method*; an `event` is a delegate the class
exposes for subscribe/unsubscribe only (learn.microsoft.com, "Delegates & events", C# 1.0/2.0).

1. **Delegate type:** declare `delegate int Op(int a, int b)`, assign a method, then a lambda.
2. **Built-ins:** swap to `Func<int,int,int>` (returns) and `Action<string>` (void); `Predicate<T>` returns `bool`.
3. **Multicast:** subscribe two handlers with `+=`; invoke and note both run, in order.
4. **Event pattern:** expose `event EventHandler<decimal>?`; raise it only from inside the class (`Update`).
5. **Invoke safely:** raise with `handler?.Invoke(this, e)` so zero subscribers doesn't throw.

**Reference sketch:**
```csharp
public class Ticker
{
    public event EventHandler<decimal>? PriceChanged;     // event = subscribe/unsubscribe only

    public void Update(decimal price)
        => PriceChanged?.Invoke(this, price);             // ?.Invoke → safe with no subscribers
}
// ticker.PriceChanged += (s, p) => Console.WriteLine(p);  // subscribe with a lambda
```
**Pitfalls:** raising without `?.` throws when no one subscribed; `=` instead of `+=` wipes other handlers;
never `-=`-ing a subscriber leaks memory; `Func`/`Action` differ only by returning a value vs `void`.

## Output shape
```
Concept: delegate = method reference; event = a guarded delegate
Steps 1–5: <what you wired + why>; Func (returns) vs Action (void) vs Predicate (bool)
Check: raised with ?.Invoke? subscribers use += / -=? handler signature matches?
```

## Tips
- Prefer `Func`/`Action` over hand-written delegate types unless a name adds real clarity.
- Trace subscribe/raise flow with [`worked-example`](../worked-example/SKILL.md); drill more via [`practice-generator`](../practice-generator/SKILL.md).
- End with the **Learning Footer** (`AGENTS.md`).
