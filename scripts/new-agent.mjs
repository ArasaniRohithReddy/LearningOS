import { readFile, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

// Scaffold a new house-style agent and wire it into Drona's allow-list.  Usage:
//   node scripts/new-agent.mjs "<Display Name>" ["description"]
// For config-driven role-agents, prefer the /role-composer skill instead.
// After running:  node scripts/build-registry.mjs  (and  node scripts/validate.mjs)

const argv = process.argv.slice(2);
const display = (argv[0] || "").trim();
const desc = argv.slice(1).join(" ").trim();

if (!display) {
  console.error('Usage: node scripts/new-agent.mjs "<Display Name>" ["description"]');
  process.exit(1);
}
const slug = display.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const file = join(process.cwd(), ".github/agents", `${slug}.agent.md`);
if (existsSync(file)) { console.error(`Agent already exists: ${file}`); process.exit(1); }

const description =
  desc || `${display} — teaches <domain> by doing: <topics>. Use for '<trigger>', '<trigger>'. Ends with the Learning Footer.`;

const body = `---
description: "${description.replace(/"/g, "'")}"
name: "${display}"
tools: [read, search, web, edit]
argument-hint: "<goal> + <context>"
user-invocable: true
---

# ${display}

<One–two sentence persona: what you help with>, following the shared constitution in
[\`AGENTS.md\`](../../AGENTS.md).

## What you do
- <capability>
- <capability>

## Knowledge sources
Prefer official docs; cite with dates; verify; never fabricate.
- <official doc / source>

## How you teach
Explain the why and the trade-offs; adapt to the learner's level; end with the **Learning Footer**.

## Related skills
\`concept-explainer\`, \`practice-generator\`, \`quiz-generator\`.
`;

await writeFile(file, body, "utf8");
console.log(`Created .github/agents/${slug}.agent.md`);

// Wire into Drona's allow-list (single-line JSON array on the `agents:` line).
const dronaPath = join(process.cwd(), ".github/agents", "drona.agent.md");
if (existsSync(dronaPath)) {
  const drona = await readFile(dronaPath, "utf8");
  const m = drona.match(/^(agents:\s*)(\[.*\])(\s*)$/m);
  if (m) {
    let list;
    try { list = JSON.parse(m[2]); } catch { list = null; }
    if (Array.isArray(list)) {
      if (!list.includes(display)) {
        await copyFile(dronaPath, `${dronaPath}.bak-newagent`);
        list.push(display);
        const updated = drona.replace(m[0], `${m[1]}${JSON.stringify(list)}${m[3]}`);
        await writeFile(dronaPath, updated, "utf8");
        console.log(`Added "${display}" to Drona's allow-list (backup: drona.agent.md.bak-newagent).`);
        console.log(`Optional: add a routing row in drona.agent.md so Drona delegates to it explicitly.`);
      } else {
        console.log(`"${display}" already in Drona's allow-list.`);
      }
    } else {
      console.warn(`! Could not parse Drona's allow-list — add "${display}" manually.`);
    }
  } else {
    console.warn(`! No 'agents:' line found in drona.agent.md — add "${display}" manually.`);
  }
}
console.log(`Next: fill in the placeholders, then run:`);
console.log(`  node scripts/build-registry.mjs && node scripts/validate.mjs`);
