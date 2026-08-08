// A minimal, self-contained MCP (Model Context Protocol) stdio client dedicated to
// driving the Flint-Chart MCP server (`flint-chart-mcp`) so the dashboard can render a
// chart to an SVG string — OFFLINE, using the copy of flint-chart-mcp BUNDLED inside
// this extension's own node_modules (shipped in the .vsix).
//
// WHY self-spawn (and bundle) instead of `vscode.lm.invokeTool`? Invoking an MCP tool
// from a webview context requires an interactive confirmation that never surfaces there,
// so the dashboard's "Render with Flint-Chart" button used to hang. This client owns the
// whole lifecycle instead, and it prefers the flint engine SHIPPED IN THE .vsix so it
// renders with no network and no `npx` download.
//
// LAUNCH FALLBACK CHAIN (each attempt has its own timeout; all graceful, never hang):
//   (a) BUNDLED — run the bundled `flint-chart-mcp` with the extension host's OWN Node.
//                 We spawn `process.execPath` (the VS Code/Electron binary) with
//                 ELECTRON_RUN_AS_NODE=1 so it behaves as plain Node and executes the
//                 bundled server entry — no external Node/npx required. [PRIMARY, offline]
//   (b) npx     — `npx -y flint-chart-mcp` (downloads/uses a global copy). [online]
// The caller (dashboard) adds two more rungs after this client: (c) a registered Flint
// LM tool via `vscode.lm.invokeTool`, then (d) the built-in inline-SVG chart.
//
// Which command runs (a)/(b) is overridable via the `learningos.flintChart.command` /
// `args` settings: empty/default keeps the bundled-first behavior; a custom command is
// tried first (with the bundled copy kept as a safety net).
//
// PROTOCOL (line-delimited JSON-RPC 2.0 on stdio, per the MCP spec):
//   1. -> initialize (id:1)              2. <- id:1 result
//   3. -> notifications/initialized      4. -> tools/call render_chart (id:2, format:"svg")
//   5. <- id:2 result  ->  result.content[<the SVG text part>].text
//
// Runtime deps: Node's built-in `child_process`/`fs`/`path`, plus the bundled
// `flint-chart-mcp` package (resolved from the extension's own node_modules).

import { spawn, type ChildProcess } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

/** A Flint-Chart `chart_spec` (the subset we build from the dashboard's own data). */
export interface FlintChartSpec {
  /** e.g. "Bar Chart" (a Flint chart-type name, not a Vega-Lite mark). */
  chartType: string;
  /** e.g. { x: { field: "day" }, y: { field: "runs" } }. */
  encodings: Record<string, unknown>;
  /** Optional pixel size hint. */
  baseSize?: { width: number; height: number };
}

export interface RenderChartOptions {
  /** Overall budget for a launcher attempt: spawn -> handshake -> render -> SVG. Default 35s. */
  timeoutMs?: number;
  /** Online-fallback launcher command. Default "npx" (empty = bundled only). */
  command?: string;
  /** Online-fallback launcher args. Default ["-y", "flint-chart-mcp"]. */
  args?: string[];
  /** Extension install path, used to locate the BUNDLED flint-chart-mcp in node_modules. */
  extensionPath?: string;
}

/** A successful render plus which launcher produced it (for the caption / diagnostics). */
export interface RenderChartResult {
  svg: string;
  /** "bundled" | "npx" | the custom command label. */
  via: string;
}

const DEFAULT_TIMEOUT_MS = 35_000;
/** The bundled render is local (no download), so cap its attempt tighter than the npx one. */
const BUNDLED_TIMEOUT_MS = 20_000;
const MIN_TIMEOUT_MS = 3_000;
const DEFAULT_COMMAND = "npx";
const DEFAULT_ARGS: readonly string[] = ["-y", "flint-chart-mcp"];
const PACKAGE_NAME = "flint-chart-mcp";
/** Keep the buffered stderr (for diagnostics) bounded. */
const MAX_STDERR = 8_000;
/** Cap the buffered stdout so a newline-less / runaway response can't grow memory unbounded. */
const MAX_STDOUT = 8 * 1024 * 1024; // ~8 MB; a real render response (one SVG line) is far smaller
const IS_WINDOWS = process.platform === "win32";

function errText(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/** Last non-empty line of buffered text, trimmed and bounded — for a friendly diagnostic. */
function lastLine(text: string): string {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const line = lines.length ? lines[lines.length - 1] : "";
  return line.length > 300 ? line.slice(0, 300) + "…" : line;
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

/** Quote an argument for a Windows shell command line (only when it contains spaces/quotes). */
function quoteArg(arg: string): string {
  return /[\s"]/.test(arg) ? `"${arg.replace(/"/g, '\\"')}"` : arg;
}

/** JSON-RPC ids echo back with the type we sent; accept the string form too, defensively. */
function idIs(json: { id?: unknown }, n: number): boolean {
  return json.id === n || json.id === String(n);
}

/** A parsed JSON-RPC error object → a short human string. */
function describeRpcError(error: unknown): string {
  if (error && typeof error === "object") {
    const e = error as { message?: unknown; code?: unknown };
    const msg = typeof e.message === "string" ? e.message : "";
    const code = typeof e.code === "number" ? ` (code ${e.code})` : "";
    if (msg) {
      return `${msg}${code}`;
    }
  }
  return typeof error === "string" ? error : JSON.stringify(error);
}

/**
 * Pull the chart text out of an MCP tool result. `render_chart` returns the SVG as a
 * text part (`content[i].text`) — often alongside a short note text part — so we prefer
 * the part that actually contains an `<svg>`; otherwise we join all text parts (which is
 * what a validation/error result looks like, so the caller can surface it). An SVG
 * returned as a base64 `image/svg+xml` part is decoded to a string too.
 */
function extractResultText(result: unknown): string | undefined {
  if (!result || typeof result !== "object") {
    return undefined;
  }
  const content = (result as { content?: unknown }).content;
  if (!Array.isArray(content)) {
    return undefined;
  }
  const texts: string[] = [];
  for (const part of content) {
    if (!part || typeof part !== "object") {
      continue;
    }
    const p = part as { text?: unknown; data?: unknown; mimeType?: unknown };
    if (typeof p.text === "string") {
      texts.push(p.text);
    } else if (typeof p.data === "string" && typeof p.mimeType === "string" && /svg\+xml/i.test(p.mimeType)) {
      try {
        texts.push(Buffer.from(p.data, "base64").toString("utf8"));
      } catch {
        /* ignore an undecodable part */
      }
    }
  }
  if (!texts.length) {
    return undefined;
  }
  const svgPart = texts.find((t) => /<svg[\s>]/i.test(t));
  return svgPart ?? texts.join("\n");
}

/** True when the text is a full SVG document (opening `<svg …>` … closing `</svg>`). */
function looksLikeSvg(text: string): boolean {
  return /<svg[\s>][\s\S]*<\/svg>/i.test(text);
}

/** How to launch one Flint-Chart server attempt. */
interface LaunchStrategy {
  /** Human label for the caption / diagnostics: "bundled" | "npx" | the custom command. */
  label: string;
  /** Executable to spawn (process.execPath for bundled, or the command for npx/custom). */
  exec: string;
  /** Arguments to the executable. */
  args: string[];
  /** Use a shell (needed on Windows to resolve `npx` via PATHEXT; never for bundled). */
  useShell: boolean;
  /** Extra env (bundled sets ELECTRON_RUN_AS_NODE=1); undefined inherits process.env. */
  env?: NodeJS.ProcessEnv;
  /** Per-attempt timeout. */
  timeoutMs: number;
}

/**
 * Locate the BUNDLED flint-chart-mcp server entry (its `bin`, e.g. dist/cli.js) inside
 * the extension's own node_modules. Tries the passed extension path first, then
 * `require.resolve`. Returns an absolute path to the JS entry, or undefined if not found.
 */
function resolveBundledEntry(extensionPath?: string): string | undefined {
  const pkgDirs: string[] = [];
  if (extensionPath) {
    pkgDirs.push(path.join(extensionPath, "node_modules", PACKAGE_NAME));
  }
  try {
    // Works from the compiled out/flintClient.js (node walks up to <ext>/node_modules).
    pkgDirs.push(path.dirname(require.resolve(`${PACKAGE_NAME}/package.json`)));
  } catch {
    /* not resolvable this way — rely on extensionPath */
  }
  for (const pkgDir of pkgDirs) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, "package.json"), "utf8")) as {
        bin?: unknown;
        main?: unknown;
      };
      let rel: string | undefined;
      if (typeof pkg.bin === "string") {
        rel = pkg.bin;
      } else if (pkg.bin && typeof pkg.bin === "object") {
        const bins = pkg.bin as Record<string, string>;
        rel = bins[PACKAGE_NAME] ?? Object.values(bins)[0];
      }
      if (!rel && typeof pkg.main === "string") {
        rel = pkg.main;
      }
      if (!rel) {
        continue;
      }
      const entry = path.join(pkgDir, rel);
      if (fs.existsSync(entry)) {
        return entry;
      }
    } catch {
      /* try the next candidate dir */
    }
  }
  return undefined;
}

/**
 * Build the ordered list of launch strategies. Bundled-first by default (offline); an
 * explicit non-default `command` is honored first, with bundled kept as a safety net.
 * An empty `command` means bundled-only (no npx fallback).
 */
function buildStrategies(opts: RenderChartOptions): LaunchStrategy[] {
  const requested =
    typeof opts.timeoutMs === "number" && Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : DEFAULT_TIMEOUT_MS;
  const timeoutMs = Math.max(MIN_TIMEOUT_MS, requested);
  const command = (opts.command ?? "").trim();
  const args = opts.args && opts.args.length ? [...opts.args] : [...DEFAULT_ARGS];

  const bundledEntry = resolveBundledEntry(opts.extensionPath);
  const bundled: LaunchStrategy | undefined = bundledEntry
    ? {
        label: "bundled",
        exec: process.execPath,
        args: [bundledEntry],
        useShell: false,
        env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
        timeoutMs: Math.max(MIN_TIMEOUT_MS, Math.min(timeoutMs, BUNDLED_TIMEOUT_MS)),
      }
    : undefined;

  const commandStrategy: LaunchStrategy | undefined = command
    ? {
        label: command === DEFAULT_COMMAND ? "npx" : command,
        exec: command,
        args,
        useShell: IS_WINDOWS,
        timeoutMs,
      }
    : undefined;

  const isDefaultCommand = command === "" || command === DEFAULT_COMMAND;
  const strategies: LaunchStrategy[] = [];
  if (isDefaultCommand) {
    // Bundled first (offline), then the default npx online fallback (none if command empty).
    if (bundled) {
      strategies.push(bundled);
    }
    if (commandStrategy) {
      strategies.push(commandStrategy);
    }
  } else {
    // Explicit custom launcher: honor it first, keep the bundled copy as a safety net.
    if (commandStrategy) {
      strategies.push(commandStrategy);
    }
    if (bundled) {
      strategies.push(bundled);
    }
  }
  return strategies;
}

/**
 * Render a chart, preferring the BUNDLED flint-chart-mcp (offline) and falling back to
 * npx (or a custom command). Resolves with the SVG and which launcher produced it;
 * rejects only if EVERY strategy fails (the caller then falls back further). Never hangs:
 * each attempt has its own timeout that force-kills its child process.
 */
export async function renderChartSvg(
  rows: Array<Record<string, unknown>>,
  chartSpec: FlintChartSpec,
  opts: RenderChartOptions = {}
): Promise<RenderChartResult> {
  const strategies = buildStrategies(opts);
  if (!strategies.length) {
    throw new Error(
      "no Flint-Chart launcher available: the bundled flint-chart-mcp could not be resolved and no " +
        "launcher command is configured (set learningos.flintChart.command)."
    );
  }
  const errors: string[] = [];
  for (const strategy of strategies) {
    try {
      const svg = await spawnAndRender(strategy, rows, chartSpec);
      return { svg, via: strategy.label };
    } catch (err) {
      errors.push(`${strategy.label}: ${errText(err)}`);
    }
  }
  throw new Error(errors.join(" | "));
}

/**
 * Spawn ONE Flint-Chart server (per the given strategy), do the MCP handshake + render,
 * and resolve with the SVG string. Always tears the child down (a single timeout that
 * kills it, plus a force-kill in cleanup) so it never hangs and never leaves a zombie.
 */
function spawnAndRender(
  strategy: LaunchStrategy,
  rows: Array<Record<string, unknown>>,
  chartSpec: FlintChartSpec
): Promise<string> {
  const timeoutMs = strategy.timeoutMs;
  return new Promise<string>((resolve, reject) => {
    let child: ChildProcess | undefined;
    let settled = false;
    let stdoutBuf = "";
    let stderrBuf = "";
    let timer: ReturnType<typeof setTimeout> | undefined;

    // Force-kill the whole process tree so nothing is orphaned. On Windows the child may
    // be `cmd.exe` (npx via shell) wrapping node, or node/Electron directly (bundled), so
    // we `taskkill /T`; on POSIX the child leads its own process group (detached).
    const killTree = (): void => {
      const proc = child;
      if (!proc) {
        return;
      }
      const pid = proc.pid;
      try {
        if (IS_WINDOWS && pid != null) {
          spawn("taskkill", ["/pid", String(pid), "/t", "/f"], { stdio: "ignore", windowsHide: true }).on(
            "error",
            () => {
              /* ignore: a taskkill spawn failure must not surface as an uncaughtException */
            }
          );
        } else if (!IS_WINDOWS && pid != null) {
          try {
            process.kill(-pid, "SIGKILL");
          } catch {
            proc.kill("SIGKILL");
          }
        } else {
          proc.kill();
        }
      } catch {
        try {
          proc.kill();
        } catch {
          /* already gone */
        }
      }
    };

    const cleanup = (): void => {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      try {
        child?.stdin?.end();
      } catch {
        /* ignore */
      }
      killTree();
    };

    const finish = (err: Error | undefined, svg?: string): void => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      if (err) {
        reject(err);
      } else {
        resolve(svg as string);
      }
    };

    // Launch. On Windows the npx/custom path needs a shell so PATHEXT resolves the command;
    // we pass a single quoted command line (not an args array) to avoid Node's shell-args
    // escaping deprecation. The bundled path spawns `process.execPath` directly (absolute
    // path, no shell) with ELECTRON_RUN_AS_NODE so it runs as plain Node. POSIX spawns in a
    // new process group (detached) so killTree can signal it. Command/args come from the
    // extension's own settings (same trust model as the code runner's base URL).
    try {
      if (strategy.useShell) {
        const cmdline = [strategy.exec, ...strategy.args].map(quoteArg).join(" ");
        child = spawn(cmdline, {
          shell: true,
          windowsHide: true,
          stdio: ["pipe", "pipe", "pipe"],
          env: strategy.env,
        });
      } else {
        child = spawn(strategy.exec, strategy.args, {
          detached: !IS_WINDOWS,
          windowsHide: true,
          stdio: ["pipe", "pipe", "pipe"],
          env: strategy.env,
        });
      }
    } catch (err) {
      finish(new Error(`could not start the Flint-Chart MCP (${strategy.label}): ${errText(err)}`));
      return;
    }

    const stdin = child.stdin;
    const stdout = child.stdout;
    const stderr = child.stderr;
    if (!stdin || !stdout) {
      finish(new Error(`the Flint-Chart MCP process (${strategy.label}) exposed no stdio pipes`));
      return;
    }

    // A single real timeout that always settles the promise and kills the child.
    timer = setTimeout(() => {
      const extra = stderrBuf.trim() ? ` Last server message: ${lastLine(stderrBuf)}` : "";
      finish(new Error(`the Flint-Chart MCP (${strategy.label}) did not render within ${timeoutMs}ms.${extra}`));
    }, timeoutMs);
    timer.unref?.();

    // Never let a stream 'error' (e.g. EPIPE after the child dies) crash the host.
    stdin.on("error", () => {
      /* handled via close/timeout */
    });
    stdout.on("error", () => {
      /* handled via close/timeout */
    });

    child.on("error", (err) => {
      finish(
        new Error(
          `could not start the Flint-Chart MCP (${strategy.label}) — is the launcher available? ${errText(err)}`
        )
      );
    });

    child.on("close", (code) => {
      if (!settled) {
        const extra = stderrBuf.trim() ? ` Server said: ${lastLine(stderrBuf)}` : "";
        finish(
          new Error(
            `the Flint-Chart MCP (${strategy.label}) exited (code ${code ?? "unknown"}) before returning a chart.${extra}`
          )
        );
      }
    });

    if (stderr) {
      stderr.on("error", () => {
        /* ignore */
      });
      stderr.on("data", (chunk: Buffer | string) => {
        stderrBuf += chunk.toString();
        if (stderrBuf.length > MAX_STDERR) {
          stderrBuf = stderrBuf.slice(-MAX_STDERR);
        }
      });
    }

    const send = (obj: unknown): void => {
      if (settled) {
        return;
      }
      try {
        stdin.write(JSON.stringify(obj) + "\n");
      } catch (err) {
        finish(new Error(`failed writing to the Flint-Chart MCP (${strategy.label}): ${errText(err)}`));
      }
    };

    const onMessage = (json: { id?: unknown; result?: unknown; error?: unknown }): void => {
      // Response to `initialize` (id:1): confirm, send the initialized notification, render.
      if (idIs(json, 1)) {
        if (json.error) {
          finish(new Error(`Flint-Chart initialize failed: ${describeRpcError(json.error)}`));
          return;
        }
        send({ jsonrpc: "2.0", method: "notifications/initialized" });
        send({
          jsonrpc: "2.0",
          id: 2,
          method: "tools/call",
          params: {
            name: "render_chart",
            arguments: {
              data: { values: rows },
              chart_spec: chartSpec,
              backend: "vegalite",
              // Ask for SVG explicitly — otherwise the server defaults to a PNG image part;
              // with format:"svg" the SVG comes back as a text part we can return as a string.
              format: "svg",
              background: "#ffffff",
            },
          },
        });
        return;
      }
      // Response to `tools/call render_chart` (id:2): the SVG text, or a validation error.
      if (idIs(json, 2)) {
        if (json.error) {
          finish(new Error(`Flint-Chart render_chart failed: ${describeRpcError(json.error)}`));
          return;
        }
        const text = extractResultText(json.result);
        if (!text) {
          finish(new Error("Flint-Chart returned an empty result (no chart content)."));
          return;
        }
        const trimmed = text.trim();
        if (looksLikeSvg(trimmed)) {
          finish(undefined, trimmed);
        } else {
          finish(new Error(`Flint-Chart could not render the chart: ${truncate(trimmed, 400)}`));
        }
        return;
      }
      // Any other message (server log notifications, etc.) is ignored.
    };

    // Read line-delimited JSON from stdout, buffering partial lines across chunks.
    stdout.on("data", (chunk: Buffer | string) => {
      stdoutBuf += chunk.toString();
      // Bound the stdout buffer: a newline-less / runaway response must not grow memory until the
      // timeout fires. Force-finish (which triggers killTree) — mirrors the stderr cap above.
      if (stdoutBuf.length > MAX_STDOUT) {
        finish(new Error("oversized flint response"));
        return;
      }
      let nl: number;
      while ((nl = stdoutBuf.indexOf("\n")) >= 0) {
        const line = stdoutBuf.slice(0, nl).trim();
        stdoutBuf = stdoutBuf.slice(nl + 1);
        if (!line) {
          continue;
        }
        let parsed: unknown;
        try {
          parsed = JSON.parse(line);
        } catch {
          continue; // not a complete JSON object (or a non-JSON log line) — skip it
        }
        if (parsed && typeof parsed === "object") {
          onMessage(parsed as { id?: unknown; result?: unknown; error?: unknown });
        }
      }
    });

    // Kick off the handshake.
    send({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "learningos", version: "1.1.9" },
      },
    });
  });
}
