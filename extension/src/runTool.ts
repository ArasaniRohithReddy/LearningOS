// The `learningos_runcode` language model tool.
//
// It lets Drona (and any tool-capable model) execute a code snippet REMOTELY and
// return its real stdout / stderr / exit code, so a learner can run and test code
// in 90+ languages WITHOUT installing a local toolchain.
//
// The learner picks the execution PROVIDER via `learningos.codeRunner.provider`:
//
//   * "piston" (default) — the Piston v2 API (https://github.com/engineer-man/piston):
//       - public   : the free, keyless public endpoint (https://emkc.org/api/v2/piston)
//       - self-host: point `learningos.codeRunner.baseUrl` at a local Piston instance
//                    (e.g. http://localhost:2000/api/v2) for unlimited, OFFLINE runs
//
//   * "onlinecompiler" — the onlinecompiler.io / OneCompiler run API. POSTs the code to
//       `learningos.codeRunner.onlinecompilerEndpoint` (default https://api.onecompiler.com/v1/run)
//       with an `X-API-Key` header (the key is read from VS Code SecretStorage, preferred, with a
//       one-time migration from the legacy plaintext `learningos.codeRunner.apiKey` setting) and a
//       `{ language, stdin?, files:[{ name, content }] }` body, then formats the
//       stdout/stderr/exception/status/executionTime it returns.
//
// Design goals (mirrors src/fetchTool.ts):
//   * Never throw out of `invoke` — always return a LanguageModelToolResult, using a
//     short human/model-readable error string on failure. That keeps the tool-calling
//     loop alive so the model can still teach from what it has.
//   * No runtime dependencies: use the Node 18+ / VS Code extension-host global `fetch`.
//   * Resolve an unversioned language via GET /runtimes (cached for the session, Piston).
//
// SECURITY NOTE (deliberately DIFFERENT from fetchTool.ts): this tool performs an
// HTTP request ONLY to the *configured* code-runner endpoint (the public Piston by
// default, or the user's own localhost / self-hosted Piston, or the user's chosen
// onlinecompiler endpoint). It therefore must NOT apply fetchTool's private-host SSRF
// block — a self-hosted Piston on localhost is a first-class, supported target. We only
// validate that the configured URL is http/https; any non-default host is, by
// construction, one the user set themselves in settings.

import * as vscode from "vscode";
import { recordCodeRun } from "./store";

/** Input for the run-code tool. Matches the schema in package.json. */
export interface RunInput {
  language: string;
  code: string;
  stdin?: string;
  version?: string;
}

/** Must match `contributes.languageModelTools[].name` in package.json. */
export const RUN_TOOL_NAME = "learningos_runcode";

/**
 * SecretStorage key for the onlinecompiler API key (also the legacy plaintext settings key,
 * `learningos.codeRunner.apiKey`). Shared so the store (extension.ts) and read (this file)
 * always use the exact same key.
 */
export const CODE_RUNNER_API_KEY_SECRET = "learningos.codeRunner.apiKey";

/** The free, keyless public Piston endpoint (the default target). */
const DEFAULT_BASE_URL = "https://emkc.org/api/v2/piston";
/** The default onlinecompiler.io / OneCompiler run endpoint (configurable — hosts differ across sources). */
const DEFAULT_ONLINECOMPILER_ENDPOINT = "https://api.onecompiler.com/v1/run";
const DEFAULT_TIMEOUT_MS = 15_000;
/** Extra headroom so the HTTP request doesn't abort exactly as Piston hits its run limit. */
const NETWORK_BUFFER_MS = 5_000;
/** Truncate very long program output before handing it to the model. */
const MAX_OUTPUT_CHARS = 8_000;
/** Hard cap on the raw HTTP body we buffer from the runner (mirrors fetchTool's cap). */
const MAX_BODY_BYTES = 2_000_000; // ~2 MB safety net; real Piston bodies are far smaller

interface PistonRuntime {
  language: string;
  version: string;
  aliases?: string[];
  runtime?: string;
}

/** One stage (compile or run) of a Piston execute response. */
interface PistonStage {
  stdout?: string;
  stderr?: string;
  output?: string;
  code?: number | null;
  signal?: string | null;
}

interface PistonExecuteResponse {
  language?: string;
  version?: string;
  run?: PistonStage;
  compile?: PistonStage;
  message?: string; // present on API errors
}

/** Shape of an onlinecompiler.io / OneCompiler `/run` response (all fields best-effort). */
interface OneCompilerResponse {
  stdout?: string | null;
  stderr?: string | null;
  exception?: string | null;
  status?: string | null; // "success" | "failed"
  executionTime?: number | null; // ms
  memoryUsed?: number | null; // kb
  limitRemaining?: number | null;
  error?: string | null; // e.g. "E003: invalid access_token"
  message?: string | null;
}

/** The learner's chosen execution backend. */
type CodeRunnerProvider = "piston" | "onlinecompiler";

interface RunnerSettings {
  provider: CodeRunnerProvider;
  baseUrl: string;
  onlinecompilerEndpoint: string;
  timeoutMs: number;
}

/**
 * Read the code-runner settings, applying defaults and clamping bad values.
 *
 * NOTE: the API key is deliberately NOT read here. It belongs ONLY to the `onlinecompiler`
 * provider and is resolved separately (SecretStorage-first, with a plaintext-setting fallback)
 * inside the onlinecompiler path, so it can never ride along on a keyless Piston request.
 */
function readSettings(): RunnerSettings {
  const cfg = vscode.workspace.getConfiguration("learningos.codeRunner");
  const providerRaw = (cfg.get<string>("provider", "piston") || "piston").trim().toLowerCase();
  const provider: CodeRunnerProvider = providerRaw === "onlinecompiler" ? "onlinecompiler" : "piston";
  const baseUrl = (cfg.get<string>("baseUrl", DEFAULT_BASE_URL) || DEFAULT_BASE_URL).trim();
  const onlinecompilerEndpoint = (
    cfg.get<string>("onlinecompilerEndpoint", DEFAULT_ONLINECOMPILER_ENDPOINT) || DEFAULT_ONLINECOMPILER_ENDPOINT
  ).trim();
  let timeoutMs = cfg.get<number>("timeoutMs", DEFAULT_TIMEOUT_MS);
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    timeoutMs = DEFAULT_TIMEOUT_MS;
  }
  return { provider, baseUrl, onlinecompilerEndpoint, timeoutMs };
}

/** Validate the configured base URL is http/https (NO SSRF block — localhost is allowed). */
function parseHttpBase(baseUrl: string): URL {
  let u: URL;
  try {
    u = new URL(baseUrl);
  } catch {
    throw new Error(
      `the code-runner URL "${baseUrl}" is not a valid URL; ` +
        `set learningos.codeRunner.baseUrl to a Piston base like ${DEFAULT_BASE_URL}`
    );
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error(`unsupported code-runner URL scheme "${u.protocol}" (only http/https are allowed)`);
  }
  return u;
}

/**
 * Build request headers for the Piston path. Piston — public AND self-hosted — is KEYLESS, so
 * this attaches NO API key. The `onlinecompiler` provider is the only keyed backend, and it
 * builds its own `X-API-Key` header in runViaOnlineCompiler. Keeping the key out of this shared
 * builder guarantees it can never be sent to a Piston host (e.g. the public emkc.org endpoint).
 */
function buildHeaders(json: boolean): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (json) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

/** A reachable runner returned a non-2xx HTTP status — distinct from a transport failure. */
class ApiStatusError extends Error {
  constructor(
    readonly status: number,
    readonly bodyText: string
  ) {
    super(`HTTP ${status}`);
    this.name = "ApiStatusError";
  }
}

/** The runner tried to redirect a credentialed API call; we refuse to follow it. */
class RedirectError extends Error {
  constructor(url: string, location: string, status: number) {
    super(
      `The code runner at ${url} tried to redirect the request (HTTP ${status || "3xx"}) to ${location}. ` +
        `Refusing to follow it: this request carries your code (and any API key), which must not be ` +
        `forwarded to another location. Point learningos.codeRunner.baseUrl directly at the runner's ` +
        `real API base (e.g. http://localhost:2000/api/v2 for self-hosted Piston).`
    );
    this.name = "RedirectError";
  }
}

/**
 * A single HTTP call via the global `fetch`, with a timeout + cancellation, returning
 * the status and raw body text (read even on non-2xx so we can surface the API message).
 *
 * Redirects are NOT followed: this request carries the user's code plus optional
 * Authorization/X-API-Key headers, so `redirect:"manual"` prevents the platform from
 * silently re-issuing it (credentials and all) to another location — a 3xx becomes a
 * clear RedirectError instead. The body read is capped at MAX_BODY_BYTES (streamed
 * reader + Content-Length bail), mirroring fetchTool.
 */
async function httpText(
  url: string,
  method: "GET" | "POST",
  headers: Record<string, string>,
  body: string | undefined,
  timeoutMs: number,
  token: vscode.CancellationToken
): Promise<{ status: number; ok: boolean; body: string }> {
  if (typeof fetch !== "function") {
    throw new Error("this runtime has no global fetch; a newer VS Code is required to run code remotely");
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onCancel = token.onCancellationRequested(() => controller.abort());
  try {
    const res = await fetch(url, { method, headers, body, redirect: "manual", signal: controller.signal });
    // status 0 == an opaque redirect on some runtimes; 3xx == a redirect exposed by others.
    if (res.status === 0 || (res.status >= 300 && res.status < 400)) {
      const location = res.headers.get("location") ?? "another location";
      try {
        await res.body?.cancel();
      } catch {
        /* free the socket */
      }
      throw new RedirectError(url, location, res.status);
    }
    const text = await readCappedBody(res);
    return { status: res.status, ok: res.ok, body: text };
  } finally {
    clearTimeout(timer);
    onCancel.dispose();
  }
}

/**
 * Read a response body but never buffer more than MAX_BODY_BYTES: bail early on an
 * over-large Content-Length, then stop streaming once the cap is hit. The runner's real
 * responses are tiny; this is a safety net against a broken or hostile server.
 */
async function readCappedBody(res: Awaited<ReturnType<typeof fetch>>): Promise<string> {
  const declared = Number(res.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    try {
      await res.body?.cancel();
    } catch {
      /* ignore */
    }
    throw new Error(`the code runner response was too large (${declared} bytes)`);
  }
  const stream = res.body;
  if (!stream) {
    return "";
  }
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (value) {
        size += value.byteLength;
        chunks.push(value);
        if (size > MAX_BODY_BYTES) {
          try {
            await reader.cancel();
          } catch {
            /* ignore */
          }
          break;
        }
      }
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {
      /* ignore */
    }
  }
  return Buffer.concat(chunks).toString("utf8");
}

/** Pull a human-readable `message` out of an API error body, or a bounded raw snippet. */
function extractMessage(body: string): string {
  if (!body) {
    return "";
  }
  try {
    const obj = JSON.parse(body) as { message?: unknown };
    if (obj && typeof obj.message === "string" && obj.message.trim()) {
      return obj.message.trim();
    }
  } catch {
    /* not JSON — fall through to a bounded raw snippet */
  }
  const trimmed = body.trim();
  return trimmed.length > 200 ? trimmed.slice(0, 200) + "…" : trimmed;
}

/** Friendly message for a network-level failure (unreachable, timeout, cancelled). */
function describeNetworkError(err: unknown, url: string): string {
  const reason = err instanceof Error ? err.message : String(err);
  const aborted = /abort/i.test(reason);
  const detail = aborted ? "the request timed out or was cancelled" : reason;
  return (
    `Couldn't reach the code runner at ${url}: ${detail}; ` +
    `check your connection, or run the command "Drona: Set up code execution" to self-host ` +
    `Piston with Docker (offline, unlimited) and point learningos.codeRunner.baseUrl at ` +
    `http://localhost:2000/api/v2.`
  );
}

/** Friendly message for a non-2xx API response (surfaces the server's own message). */
function describeApiError(status: number, body: string, url: string): string {
  const msg = extractMessage(body);
  const detail = msg ? `: ${msg}` : "";
  const gated = status === 401 || status === 403;
  const cause = gated
    ? `The public Piston is now whitelist-only for keyless use, so it returns HTTP ${status}. `
    : `The free public Piston can be rate-limited or whitelist-only. `;
  return (
    `The code runner at ${url} rejected the request (HTTP ${status})${detail}. ` +
    cause +
    `Recommended fix: self-host Piston with Docker (offline, unlimited, no key) and set ` +
    `learningos.codeRunner.baseUrl to http://localhost:2000/api/v2 — run the command ` +
    `"Drona: Set up code execution" for the exact steps. Alternatively use a keyed provider ` +
    `(e.g. onlinecompiler.io) by setting learningos.codeRunner.apiKey.`
  );
}

/** Parse a version like "3.12.0" (or "1.20") into numeric parts; non-numeric parts → 0. */
function parseVersion(v: string): number[] {
  return (v ?? "").split(/[.+-]/).map((p) => {
    const n = parseInt(p, 10);
    return Number.isFinite(n) ? n : 0;
  });
}

/** Compare two version strings for a DESCENDING sort (highest first); tolerant of non-semver. */
function compareVersionsDesc(a: string, b: string): number {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da !== db) {
      return db - da; // higher numeric part sorts first
    }
  }
  return (b ?? "").localeCompare(a ?? ""); // stable, deterministic tiebreak (null-safe vs. a malformed payload)
}

/**
 * Find the runtime whose language name (preferred) or an alias equals the requested one
 * (case-insensitive). A self-hosted Piston can list several versions of the same language
 * (e.g. python 3.10 AND 3.12); pick the HIGHEST version so the choice is deterministic and
 * current, rather than whichever the server happened to list first.
 */
function findRuntime(runtimes: PistonRuntime[], language: string): PistonRuntime | undefined {
  const q = language.toLowerCase();
  const byName = runtimes.filter((r) => (r.language ?? "").toLowerCase() === q);
  const pool = byName.length
    ? byName
    : runtimes.filter((r) => (r.aliases ?? []).some((a) => (a ?? "").toLowerCase() === q));
  if (!pool.length) {
    return undefined;
  }
  return pool.slice().sort((a, b) => compareVersionsDesc(a.version, b.version))[0];
}

/** Build a helpful "no match / did you mean" string when a language can't be resolved. */
function suggestLanguages(runtimes: PistonRuntime[], language: string): string {
  const q = language.toLowerCase();
  const near = new Set<string>();
  for (const r of runtimes) {
    const hay = [r.language, ...(r.aliases ?? [])].filter(Boolean).map((s) => (s as string).toLowerCase());
    if (hay.some((h) => h.includes(q) || q.includes(h))) {
      near.add(r.language);
    }
  }
  if (near.size > 0) {
    return (
      `No exact match for language "${language}" on the code runner. ` +
      `Did you mean: ${[...near].slice(0, 8).join(", ")}? Pass one of these names (or a known alias).`
    );
  }
  const sample = [...new Set(runtimes.map((r) => r.language))].sort().slice(0, 12);
  return (
    `The code runner has no language matching "${language}". ` +
    `Some available languages: ${sample.join(", ")}. ` +
    `Pass one of these names (or a known alias), or set the "version" input explicitly.`
  );
}

/** Format a Piston execute response into a compact, teachable block. */
function formatResult(data: PistonExecuteResponse, requestedLang: string, requestedVersion: string): string {
  const lang = data.language || requestedLang;
  const version = data.version || requestedVersion || "unknown";
  const lines: string[] = [`Ran ${lang} ${version} on the remote code runner (Piston).`];

  // A non-zero compile exit means the program never ran — show the compiler error.
  const compile = data.compile;
  if (compile && typeof compile.code === "number" && compile.code !== 0) {
    const cerr = (compile.stderr || compile.output || "").trim();
    lines.push("", `Compilation FAILED (exit code ${compile.code}):`, cerr || "(no compiler output)");
    lines.push("", `Exit code: ${compile.code}`);
    return truncate(lines.join("\n"));
  }

  const run = data.run;
  if (!run) {
    if (data.message) {
      lines.push("", `The runner reported: ${data.message}`);
    } else {
      lines.push("", "The runner returned no run output.");
    }
    return truncate(lines.join("\n"));
  }

  const stdout = (run.stdout ?? "").replace(/\s+$/, "");
  const stderr = (run.stderr ?? "").replace(/\s+$/, "");
  const output = (run.output ?? "").replace(/\s+$/, "");

  if (stdout) {
    lines.push("", "stdout:", stdout);
  }
  if (stderr) {
    lines.push("", "stderr:", stderr);
  }
  if (!stdout && !stderr) {
    lines.push("", "output:", output || "(no output)");
  }

  const code = typeof run.code === "number" ? run.code : "unknown";
  lines.push("", `Exit code: ${code}${run.signal ? ` (signal ${run.signal})` : ""}`);
  return truncate(lines.join("\n"));
}

function truncate(text: string): string {
  if (text.length <= MAX_OUTPUT_CHARS) {
    return text;
  }
  return text.slice(0, MAX_OUTPUT_CHARS).trimEnd() + "\n\n…[output truncated]";
}

/** Language name/alias → source-file extension for onlinecompiler's `files[].name`. */
const LANGUAGE_EXTENSIONS: Record<string, string> = {
  python: ".py",
  py: ".py",
  python3: ".py",
  javascript: ".js",
  js: ".js",
  node: ".js",
  nodejs: ".js",
  typescript: ".ts",
  ts: ".ts",
  java: ".java",
  c: ".c",
  cpp: ".cpp",
  "c++": ".cpp",
  cplusplus: ".cpp",
  csharp: ".cs",
  "c#": ".cs",
  cs: ".cs",
  go: ".go",
  golang: ".go",
  rust: ".rs",
  rs: ".rs",
  ruby: ".rb",
  rb: ".rb",
  php: ".php",
  kotlin: ".kt",
  kt: ".kt",
  swift: ".swift",
  bash: ".sh",
  sh: ".sh",
  shell: ".sh",
  sql: ".sql",
};

/** Map a language name/alias to a source-file extension (falls back to ".txt"). */
function extensionForLanguage(language: string): string {
  return LANGUAGE_EXTENSIONS[(language ?? "").toLowerCase().trim()] ?? ".txt";
}

/**
 * OneCompiler language aliases → its canonical language id. Unlike Piston, OneCompiler has no
 * `/runtimes` endpoint to resolve an alias against, so a model-supplied alias such as `js` / `py`
 * / `cpp` can be rejected outright; normalize the common ones (falling back to the raw value for
 * anything not listed, so an already-canonical or unknown language passes through unchanged).
 */
const ONLINECOMPILER_LANGUAGE_ALIASES: Record<string, string> = {
  js: "javascript",
  node: "javascript",
  nodejs: "javascript",
  py: "python",
  python3: "python",
  ts: "typescript",
  rb: "ruby",
  cs: "csharp",
  "c#": "csharp",
  kt: "kotlin",
  sh: "bash",
  shell: "bash",
  "c++": "cpp",
  cplusplus: "cpp",
  golang: "go",
  rs: "rust",
};

/** Normalize a model-supplied language to OneCompiler's canonical id (falls back to the raw value). */
function canonicalOnlineCompilerLanguage(language: string): string {
  const key = (language ?? "").toLowerCase().trim();
  return ONLINECOMPILER_LANGUAGE_ALIASES[key] ?? language;
}

/** Format an onlinecompiler.io / OneCompiler `/run` response into a compact, teachable block. */
function formatOnlineCompilerResult(data: OneCompilerResponse, requestedLang: string): string {
  const lines: string[] = [`Ran ${requestedLang} on the remote code runner (onlinecompiler).`];

  const stdout = (data.stdout ?? "").toString().replace(/\s+$/, "");
  const stderr = (data.stderr ?? "").toString().replace(/\s+$/, "");
  const exception = (data.exception ?? "").toString().replace(/\s+$/, "");

  if (stdout) {
    lines.push("", "stdout:", stdout);
  }
  if (stderr) {
    lines.push("", "stderr:", stderr);
  }
  if (exception) {
    lines.push("", "exception:", exception);
  }
  if (!stdout && !stderr && !exception) {
    lines.push("", "output:", "(no output)");
  }

  const meta: string[] = [];
  const status = (data.status ?? "").toString().trim();
  if (status) {
    meta.push(`status: ${status}`);
  }
  if (typeof data.executionTime === "number") {
    meta.push(`executionTime: ${data.executionTime} ms`);
  }
  if (typeof data.memoryUsed === "number") {
    meta.push(`memoryUsed: ${data.memoryUsed} KB`);
  }
  if (meta.length) {
    lines.push("", meta.join(" · "));
  }
  return truncate(lines.join("\n"));
}

/** Friendly message for an onlinecompiler rejection (surfaces its `error`/status). */
function describeOnlineCompilerError(status: number, data: OneCompilerResponse, url: string): string {
  const code = (data.error ?? data.message ?? "").toString().trim();
  const gated =
    status === 401 ||
    status === 403 ||
    /access[_ ]?token|api[_ ]?key|unauthori|invalid.*token/i.test(code);
  const detail = code ? `: ${code}` : status ? ` (HTTP ${status})` : "";
  const cause = gated
    ? "The endpoint rejected your API key — check learningos.codeRunner.apiKey and make sure it matches the " +
      "service at learningos.codeRunner.onlinecompilerEndpoint. "
    : "";
  return (
    `The onlinecompiler endpoint at ${url} rejected the request${detail}. ` +
    cause +
    `Get a key from your onlinecompiler.io / onecompiler account (run the command "Drona: Set up code execution" ` +
    `for a guided setup), or switch learningos.codeRunner.provider back to "piston".`
  );
}

export class LearningRunCodeTool implements vscode.LanguageModelTool<RunInput> {
  /** Per-session cache of the runtimes list, keyed by the base URL it came from. */
  private runtimesCache: { baseUrl: string; runtimes: PistonRuntime[] } | undefined;

  constructor(private readonly context: vscode.ExtensionContext) {}

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<RunInput>,
    _token: vscode.CancellationToken
  ): Promise<vscode.PreparedToolInvocation> {
    const lang = (options.input?.language ?? "").toString().trim() || "code";
    return { invocationMessage: `Running ${lang}…` };
  }

  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<RunInput>,
    token: vscode.CancellationToken
  ): Promise<vscode.LanguageModelToolResult> {
    try {
      const text = await this.runCode(options.input, token);
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(text)]);
    } catch (err) {
      // Last-resort safety net — the normal paths below already return strings.
      const reason = err instanceof Error ? err.message : String(err);
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(
          `Could not run the code: ${reason}. Tell the learner the remote code runner was unavailable.`
        ),
      ]);
    }
  }

  /** Resolve the runtime version (if needed), execute, and format — never throws for expected cases. */
  private async runCode(input: RunInput | undefined, token: vscode.CancellationToken): Promise<string> {
    const language = (input?.language ?? "").toString().trim();
    const code = typeof input?.code === "string" ? input.code : "";
    const stdin = typeof input?.stdin === "string" ? input.stdin : undefined;
    const requestedVersion = typeof input?.version === "string" ? input.version.trim() : "";

    if (!language) {
      return 'No language was provided. Pass a language name or alias (e.g. "python", "js", "cpp").';
    }
    if (!code.trim()) {
      return `No code was provided to run for ${language}.`;
    }

    const settings = readSettings();
    // Branch on the learner's chosen execution provider (piston | onlinecompiler).
    if (settings.provider === "onlinecompiler") {
      return this.runViaOnlineCompiler(settings, language, code, stdin, token);
    }
    return this.runViaPiston(settings, language, code, stdin, requestedVersion, token);
  }

  /**
   * Execute via a Piston-compatible runner (the default provider): resolve the runtime
   * version from /runtimes (unless supplied), then POST /execute. All the existing
   * hardening applies (size cap, highest-version pick, manual redirects, error labels).
   */
  private async runViaPiston(
    settings: RunnerSettings,
    language: string,
    code: string,
    stdin: string | undefined,
    requestedVersion: string,
    token: vscode.CancellationToken
  ): Promise<string> {
    let base: URL;
    try {
      base = parseHttpBase(settings.baseUrl);
    } catch (err) {
      return err instanceof Error ? err.message : String(err);
    }
    // Strip any trailing slash so `${baseUrl}/runtimes` / `${baseUrl}/execute` are clean.
    const baseUrl = base.toString().replace(/\/+$/, "");

    // Resolve the version from /runtimes unless the caller supplied one explicitly.
    let version = requestedVersion;
    let resolvedLanguage = language;
    if (!version) {
      let runtimes: PistonRuntime[];
      try {
        runtimes = await this.getRuntimes(baseUrl, settings, token);
      } catch (err) {
        if (err instanceof RedirectError) {
          return err.message;
        }
        if (err instanceof ApiStatusError) {
          // Reachable but non-2xx (e.g. 429/403): surface the status instead of
          // mislabeling it as an unreachable-host/network error.
          return describeApiError(err.status, err.bodyText, `${baseUrl}/runtimes`);
        }
        return describeNetworkError(err, `${baseUrl}/runtimes`);
      }
      const match = findRuntime(runtimes, language);
      if (!match) {
        return suggestLanguages(runtimes, language);
      }
      version = match.version;
      resolvedLanguage = match.language;
    }

    // Execute. Piston runs untrusted code in an isolated sandbox on the server.
    const payload = {
      language: resolvedLanguage,
      version,
      files: [{ content: code }],
      ...(stdin !== undefined ? { stdin } : {}),
      run_timeout: settings.timeoutMs,
      compile_timeout: settings.timeoutMs,
    };

    let resp: { status: number; ok: boolean; body: string };
    try {
      resp = await httpText(
        `${baseUrl}/execute`,
        "POST",
        buildHeaders(true),
        JSON.stringify(payload),
        settings.timeoutMs + NETWORK_BUFFER_MS,
        token
      );
    } catch (err) {
      if (err instanceof RedirectError) {
        return err.message;
      }
      return describeNetworkError(err, `${baseUrl}/execute`);
    }

    if (!resp.ok) {
      return describeApiError(resp.status, resp.body, baseUrl);
    }

    let data: PistonExecuteResponse;
    try {
      data = JSON.parse(resp.body) as PistonExecuteResponse;
    } catch {
      return `The code runner at ${baseUrl} returned an unreadable response (HTTP ${resp.status}).`;
    }
    // The runner accepted and executed the snippet in this language — count it for
    // the dashboard's "languages practiced" chart (best-effort; never break the tool).
    void recordCodeRun(this.context, resolvedLanguage).catch(() => {
      /* persistence is best-effort */
    });
    return formatResult(data, resolvedLanguage, version);
  }

  /**
   * Execute via the onlinecompiler.io / OneCompiler run API. POSTs the code with an
   * `X-API-Key` header to the user-configured endpoint and formats the returned
   * stdout/stderr/exception/status/executionTime. Never throws: a missing key, an
   * invalid endpoint, a transport failure, or a rejection all come back as a concise,
   * actionable string so the tool-calling loop stays alive.
   */
  private async runViaOnlineCompiler(
    settings: RunnerSettings,
    language: string,
    code: string,
    stdin: string | undefined,
    token: vscode.CancellationToken
  ): Promise<string> {
    // Validate the endpoint is http/https (user-configured; no SSRF block by design).
    let endpoint: URL;
    try {
      endpoint = new URL(settings.onlinecompilerEndpoint);
    } catch {
      return (
        `the onlinecompiler endpoint "${settings.onlinecompilerEndpoint}" is not a valid URL; ` +
        `set learningos.codeRunner.onlinecompilerEndpoint to your provider's run URL ` +
        `(default ${DEFAULT_ONLINECOMPILER_ENDPOINT}).`
      );
    }
    if (endpoint.protocol !== "http:" && endpoint.protocol !== "https:") {
      return `unsupported onlinecompiler endpoint scheme "${endpoint.protocol}" (only http/https are allowed).`;
    }
    const endpointUrl = endpoint.toString();

    // Resolve the API key: SecretStorage first, then the legacy plaintext setting (migrating it).
    // This key is ONLY ever attached to this onlinecompiler request — never to a Piston call.
    const apiKey = await this.resolveOnlineCompilerKey();

    // A friendly, non-throwing nudge when no key is configured yet.
    if (!apiKey) {
      return (
        "The code runner provider is set to onlinecompiler, but no API key is configured. " +
        'Run the command "Drona: Set up code execution" to store your onlinecompiler.io / onecompiler ' +
        "key securely (kept in VS Code SecretStorage, not synced settings) — or set " +
        'learningos.codeRunner.apiKey manually — or switch learningos.codeRunner.provider back to "piston".'
      );
    }

    const fileName = "main" + extensionForLanguage(language);
    const payload: Record<string, unknown> = {
      language: canonicalOnlineCompilerLanguage(language),
      files: [{ name: fileName, content: code }],
      ...(stdin !== undefined ? { stdin } : {}),
    };
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    };

    let resp: { status: number; ok: boolean; body: string };
    try {
      resp = await httpText(
        endpointUrl,
        "POST",
        headers,
        JSON.stringify(payload),
        settings.timeoutMs + NETWORK_BUFFER_MS,
        token
      );
    } catch (err) {
      if (err instanceof RedirectError) {
        return err.message;
      }
      return describeNetworkError(err, endpointUrl);
    }

    let data: OneCompilerResponse;
    try {
      data = JSON.parse(resp.body) as OneCompilerResponse;
    } catch {
      if (!resp.ok) {
        return describeOnlineCompilerError(resp.status, {}, endpointUrl);
      }
      return `The onlinecompiler endpoint at ${endpointUrl} returned an unreadable response (HTTP ${resp.status}).`;
    }

    // Some providers signal failure with a non-2xx status; others return 200 + an `error` code.
    if (!resp.ok || (typeof data.error === "string" && data.error.trim())) {
      return describeOnlineCompilerError(resp.status, data, endpointUrl);
    }

    // The runner accepted and executed the snippet — count it for the dashboard's
    // "languages practiced" chart (best-effort; never break the tool).
    void recordCodeRun(this.context, language).catch(() => {
      /* persistence is best-effort */
    });
    return formatOnlineCompilerResult(data, language);
  }

  /**
   * Resolve the onlinecompiler API key, preferring VS Code SecretStorage over the legacy
   * plaintext `learningos.codeRunner.apiKey` setting (which syncs via Settings Sync). If a key
   * is found ONLY in the plaintext setting, migrate it into SecretStorage and clear the setting.
   * Returns "" when no key is configured anywhere. Best-effort and never throws.
   */
  private async resolveOnlineCompilerKey(): Promise<string> {
    try {
      const stored = (await this.context.secrets.get(CODE_RUNNER_API_KEY_SECRET))?.trim();
      if (stored) {
        return stored;
      }
    } catch {
      /* SecretStorage unavailable — fall back to the plaintext setting */
    }
    const cfg = vscode.workspace.getConfiguration("learningos.codeRunner");
    const legacy = (cfg.get<string>("apiKey", "") || "").trim();
    if (!legacy) {
      return "";
    }
    // Migrate the manually-set plaintext key into SecretStorage, then clear the syncing setting.
    try {
      await this.context.secrets.store(CODE_RUNNER_API_KEY_SECRET, legacy);
      await cfg.update("apiKey", "", vscode.ConfigurationTarget.Global);
    } catch {
      /* best-effort migration; still return the key so this run works */
    }
    return legacy;
  }

  /** GET /runtimes, cached per base URL for the session. Throws on network/non-200. */
  private async getRuntimes(
    baseUrl: string,
    settings: RunnerSettings,
    token: vscode.CancellationToken
  ): Promise<PistonRuntime[]> {
    if (this.runtimesCache && this.runtimesCache.baseUrl === baseUrl) {
      return this.runtimesCache.runtimes;
    }
    const resp = await httpText(`${baseUrl}/runtimes`, "GET", buildHeaders(false), undefined, settings.timeoutMs, token);
    if (!resp.ok) {
      // Reachable but rejected — carry the status so the caller can label it as an HTTP
      // error (e.g. 429/403) rather than an unreachable-host/transport error.
      throw new ApiStatusError(resp.status, resp.body);
    }
    let runtimes: unknown;
    try {
      runtimes = JSON.parse(resp.body);
    } catch {
      throw new Error(`the runtimes list from ${baseUrl} was unreadable`);
    }
    if (!Array.isArray(runtimes)) {
      throw new Error(`unexpected runtimes response from ${baseUrl}`);
    }
    const list = runtimes as PistonRuntime[];
    this.runtimesCache = { baseUrl, runtimes: list };
    return list;
  }
}

/** Register the run-code tool; safe to call once on activation. */
export function registerRunTool(context: vscode.ExtensionContext): void {
  context.subscriptions.push(vscode.lm.registerTool<RunInput>(RUN_TOOL_NAME, new LearningRunCodeTool(context)));
}
