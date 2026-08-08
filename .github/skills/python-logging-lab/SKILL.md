---
name: python-logging-lab
description: "Hands-on Python lab on logging: the standard library logging module — loggers, handlers, and formatters, the DEBUG/INFO/WARNING/ERROR/CRITICAL levels, basicConfig vs dictConfig, per-module getLogger(__name__), and logger.exception for tracebacks. Use for 'teach me logging', 'hands-on logging lab', 'loggers vs handlers vs formatters', 'set log level', 'configure logging', or replacing print with real logs."
argument-hint: "The app"
---

# Python Logging Lab

Learn logging by wiring records to a handler — a guided, hands-on lab following the teaching
principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner is debugging with `print` and wants leveled, configurable output.
- Teaching observability basics for **Coding Mentor** or a backend role-agent.

## Procedure
**Concept (60s):** a **Logger** you call routes each record to a **Handler** (where it goes), formatted by
a **Formatter** (how it looks); records below the level are dropped (docs.python.org; PEP 282, 2002).

1. **Levels:** call `debug/info/warning/error/critical`; the default threshold is WARNING.
2. **Named logger:** use `logging.getLogger(__name__)`, never the root, so config stays per-module.
3. **Handler + formatter:** attach a `StreamHandler` with a `Formatter` (time, level, name, message).
4. **Configure once:** `basicConfig(level=…)` at startup, or `dictConfig` for real apps.
5. **Tracebacks:** inside `except`, call `logger.exception("…")` to log ERROR plus the stack.

**Reference sketch:**
```python
import logging

logging.basicConfig(                     # configure once, at startup
    level=logging.INFO,                  # show INFO and above
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
log = logging.getLogger(__name__)        # per-module, not the root

log.debug("hidden")                      # below INFO → suppressed
log.info("starting up")                  # shown
log.warning("low disk space")            # shown
```
**Pitfalls:** using `print` instead of levels; calling `basicConfig` twice (later calls are no-ops);
duplicate handlers double-logging; logging secrets; building costly messages the level then discards.

## Output shape
```
Concept: Logger → Handler → Formatter; records filtered by level
Steps 1–5: <what you logged + why>; INFO vs WARNING threshold observed
Check: getLogger(__name__)? configured once? exception() used in except?
```

## Tips
- Log for the reader six months from now: level, context, and no secrets.
- Design an app-wide policy with [`logging-strategy-coach`](../logging-strategy-coach/SKILL.md); drill more via [`practice-generator`](../practice-generator/SKILL.md).
- A log line missing? [`debugging-coach`](../debugging-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
