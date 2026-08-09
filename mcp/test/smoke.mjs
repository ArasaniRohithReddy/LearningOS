// Smoke test for the LearningOS MCP server: spawns it, speaks MCP over stdio
// (newline-delimited JSON-RPC), and asserts tools/resources/prompts + two local
// tool calls work. Network tools (tech_news/run_code/fetch_page) are not called
// here (they depend on external services). Run: npm test  (from mcp/). Exit != 0 on failure.

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const server = spawn(process.execPath, [path.join(__dirname, "..", "out", "index.js")], {
  stdio: ["pipe", "pipe", "inherit"],
});

let buf = "";
const pending = new Map();
server.stdout.on("data", (d) => {
  buf += d.toString("utf8");
  let i;
  while ((i = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, i).trim();
    buf = buf.slice(i + 1);
    if (!line) continue;
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      continue;
    }
    if (msg.id != null && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  }
});

const send = (obj) => server.stdin.write(JSON.stringify(obj) + "\n");
const request = (id, method, params) =>
  new Promise((res, rej) => {
    pending.set(id, res);
    send({ jsonrpc: "2.0", id, method, params });
    setTimeout(() => rej(new Error("timeout: " + method)), 20_000);
  });

let failed = 0;
const ok = (name, cond) => {
  console.log((cond ? "PASS " : "FAIL ") + name);
  if (!cond) failed++;
};

try {
  const init = await request(1, "initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "smoke", version: "1.0" },
  });
  ok("initialize → serverInfo.name = learningos-drona", init?.result?.serverInfo?.name === "learningos-drona");
  send({ jsonrpc: "2.0", method: "notifications/initialized" });

  const tools = await request(2, "tools/list", {});
  const names = (tools?.result?.tools || []).map((t) => t.name);
  ok(`tools/list → 9 tools (got ${names.length})`, names.length === 9);
  for (const n of [
    "search_skills",
    "get_skill",
    "search_agents",
    "get_agent",
    "find_learning_resources",
    "list_roadmaps",
    "tech_news",
    "run_code",
    "fetch_page",
  ]) {
    ok("tool present: " + n, names.includes(n));
  }

  const call = await request(3, "tools/call", { name: "search_skills", arguments: { query: "dynamic programming" } });
  ok("search_skills finds dynamic-programming-coach", (call?.result?.content?.[0]?.text || "").includes("dynamic-programming"));

  const res = await request(4, "tools/call", { name: "find_learning_resources", arguments: { domain: "dsa", limit: 3 } });
  ok("find_learning_resources returns links", (res?.result?.content?.[0]?.text || "").includes("http"));

  const roads = await request(5, "tools/call", { name: "list_roadmaps", arguments: { query: "frontend" } });
  ok("list_roadmaps returns roadmap.sh links", (roads?.result?.content?.[0]?.text || "").includes("roadmap.sh"));

  const prompts = await request(6, "prompts/list", {});
  ok("prompts include drona", (prompts?.result?.prompts || []).some((p) => p.name === "drona"));

  const resources = await request(7, "resources/list", {});
  ok(
    "resources include the constitution",
    (resources?.result?.resources || []).some((r) => r.uri === "learningos://constitution")
  );
} catch (e) {
  console.error("smoke error:", e.message);
  failed++;
} finally {
  server.stdin.end();
  server.kill();
}

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
