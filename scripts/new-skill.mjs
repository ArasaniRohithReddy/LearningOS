import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

// Scaffold a new house-style skill.  Usage:
//   node scripts/new-skill.mjs <kebab-name> ["one-line description"]
// Then run:  node scripts/build-registry.mjs   (and  node scripts/validate.mjs)

const [name, ...rest] = process.argv.slice(2);
const desc = rest.join(" ").trim();

if (!name) {
  console.error("Usage: node scripts/new-skill.mjs <kebab-name> [\"description\"]");
  process.exit(1);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
  console.error(`Skill name must be kebab-case (got "${name}"). Example: sql-window-functions-lab`);
  process.exit(1);
}
const dir = join(process.cwd(), ".github/skills", name);
if (existsSync(dir)) { console.error(`Skill already exists: ${dir}`); process.exit(1); }

const Title = name.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
const description = desc || `Do <X> as a lesson — <what the learner gets>. Use for '<trigger>', '<trigger>', or '<trigger>'.`;

const body = `---
name: ${name}
description: "${description.replace(/"/g, "'")}"
argument-hint: "<what to provide, optional>"
---

# ${Title}

<One–two sentence intro: what this teaches and why>, following [\`AGENTS.md\`](../../../AGENTS.md).

## When to use
- <trigger / situation>
- <trigger / situation>

## Procedure
1. <step>
2. <step>
3. <step>

## Output shape
\`\`\`
<compact example of what this skill returns>
\`\`\`

## Tips
- <pitfall or best practice>
- Pairs with \`<related-skill>\`. End with the **Learning Footer** (\`AGENTS.md\`).
`;

await mkdir(dir, { recursive: true });
await writeFile(join(dir, "SKILL.md"), body, "utf8");
console.log(`Created .github/skills/${name}/SKILL.md`);
console.log(`Next: fill in the placeholders, then run:`);
console.log(`  node scripts/build-registry.mjs && node scripts/validate.mjs`);
