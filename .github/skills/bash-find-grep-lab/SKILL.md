---
name: bash-find-grep-lab
description: "Hands-on Bash lab on searching with find and grep: locating files by name, type, size, and time, searching contents recursively, bridging them with xargs -0, and deleting matches safely. Use for 'practice find and grep', 'hands-on lab', 'find files by name', 'search file contents', 'xargs', 'safely delete matching files', or learning file search in Bash by doing."
argument-hint: "The search"
---

# Bash Find & Grep Lab

Learn to locate files by **name, content, and metadata** — and delete matches without regret — a
guided, hands-on lab following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *practice* `find`/`grep`/`xargs`, not just look up a one-off command.
- Bulk file search and cleanup; pairs with [`linux-command-coach`](../linux-command-coach/SKILL.md).

## Procedure
**Concept (60s):** `find` walks the tree matching metadata (name, type, size, time); `grep` searches
*contents*; `xargs` feeds find's results into another command (`man find`/`xargs`; GNU findutils 4.10, 2024).

1. **By name/type:** `find . -type f -name '*.log'`; add `-maxdepth 2` to limit how deep it recurses.
2. **By content:** `grep -rn 'TODO' src/` prints file:line:match recursively; `-l` lists only filenames.
3. **Bridge safely:** `find . -name '*.log' -print0 | xargs -0 grep -l ERROR` handles spaces and newlines.
4. **Filter by meta:** `find . -type f -mtime +7 -size +1M` — files older than 7 days and over 1 MB.
5. **List, then delete:** review the printed list first, then `find . -name '*.tmp' -delete` once you trust it.

**Reference sketch:**
```bash
find . -type f -name '*.log' -print0 | xargs -0 grep -l 'ERROR'   # NUL-safe search
find . -name '*.tmp' -print                                       # 1) preview matches
find . -name '*.tmp' -delete                                      # 2) delete only after review
```
**Pitfalls:** filenames with spaces/newlines break plain pipes — use `-print0` with `xargs -0`;
⚠ `-delete` and `-exec rm` are irreversible — always run the `-print` version first.

## Output shape
```
Search: <by name | content | metadata>
Chain: find <filters> -print0 | xargs -0 <cmd> ; grep -rn <pattern>
Check: matches previewed before any delete? NUL-safe for odd names?
```

## Tips
- ⚠ Never pipe a delete blind — preview with `-print`, and prefer `-delete` over `-exec rm -rf`.
- `-print0 | xargs -0` (or `find -exec … +`) is the only safe way over arbitrary filenames.
- Pair with [`linux-command-coach`](../linux-command-coach/SKILL.md) & [`shell-scripting-coach`](../shell-scripting-coach/SKILL.md); version cleanup scripts with [`git-coach`](../git-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
