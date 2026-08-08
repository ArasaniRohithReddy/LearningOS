---
name: bash-text-processing-lab
description: "Hands-on Bash lab on text processing with grep, sed, and awk: filtering lines, substituting text, and extracting or summarizing fields from logs and CSVs. Use for 'practice grep sed awk', 'hands-on lab', 'extract a column', 'transform text in Bash', 'sum a field with awk', or learning command-line text wrangling by doing."
argument-hint: "The text task"
---

# Bash Text Processing Lab

Learn to slice and reshape text with **grep, sed, and awk** by running them on real sample data — a
guided, hands-on lab following the teaching principles and Learning Footer in [`AGENTS.md`](../../../AGENTS.md).

## When to use
- The learner wants to *practice* extracting or transforming text, not just read regex theory.
- Turning logs/CSVs into answers; pairs with [`linux-command-coach`](../linux-command-coach/SKILL.md) and `regex-explainer`.

## Procedure
**Concept (60s):** grep *finds* lines, sed *edits* a stream line-by-line, awk splits each line into
*fields* for reporting (`man grep`/`sed`/`awk`; GNU grep 3.11 2023, sed 4.9 2022, gawk 5.3 2023).

1. **Sample data:** `printf 'id,qty\n1,5\n2,7\n' > sales.csv` in a sandbox dir you can delete.
2. **Filter (grep):** `grep -n 7 sales.csv`; add `-i` (ignore case), `-E` (extended regex), `-c` (count).
3. **Transform (sed):** `sed 's/,/ | /g' sales.csv` prints edits; `sed -n '2p'` prints just one line.
4. **Fields (awk):** `awk -F, 'NR>1 {sum+=$2} END{print sum}' sales.csv` sums column 2, skipping the header.
5. **Compose:** chain them — `grep -v '^id' sales.csv | awk -F, '{print $1}'` extracts only the ids.

**Reference sketch:**
```bash
# total quantity from a CSV, header skipped
awk -F, 'NR>1 { total += $2 } END { printf "total=%d\n", total }' sales.csv
sed 's/,/\t/g' sales.csv > sales.tsv     # comma → tab, written to a NEW file
```
**Pitfalls:** greedy/unanchored regex over-matches; awk's field separator defaults to whitespace;
⚠ `sed -i` edits files *in place* — back up first, or write to a new file as shown above.

## Output shape
```
Task: <extract | transform | summarize>
Tool: grep <filter> → sed <edit> → awk <fields/aggregate>
Check: right rows? header handled? original file preserved?
```

## Tips
- ⚠ Test `sed`/`awk` to stdout before adding `-i` or `>`; `>` overwrites the target file silently.
- Reach for grep to find, sed for simple swaps, awk when you need columns or arithmetic.
- Pair with [`linux-command-coach`](../linux-command-coach/SKILL.md) & [`shell-scripting-coach`](../shell-scripting-coach/SKILL.md); track scripts with [`git-coach`](../git-coach/SKILL.md). End with the **Learning Footer** (`AGENTS.md`).
