// Network helpers for the LearningOS MCP server: an SSRF-guarded fetch (used by
// the tech-news and fetch-page tools) and a Piston code-execution client (used by
// the run-code tool). Dependency-free (global fetch, Node 18+).

import { isBlockedHost } from "./ssrf.js";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/124.0 Safari/537.36 LearningOS-MCP/1.0";
const MAX_REDIRECTS = 3;

function requirePublicUrl(input: string): URL {
  const u = new URL(input);
  if (u.protocol !== "https:" && u.protocol !== "http:") {
    throw new Error(`unsupported URL scheme "${u.protocol}" (only http/https)`);
  }
  if (isBlockedHost(u.hostname)) {
    throw new Error(`refusing a private/local/link-local address (${u.hostname})`);
  }
  return u;
}

/** SSRF-guarded GET (manual, bounded, guarded redirects). Returns the raw body text. */
export async function fetchRaw(
  input: string,
  opts: { accept?: string; timeoutMs?: number; maxBytes?: number } = {}
): Promise<string> {
  const timeoutMs = opts.timeoutMs ?? 12_000;
  const maxBytes = opts.maxBytes ?? 2_000_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let current = requirePublicUrl(input);
    for (let hop = 0; ; hop++) {
      const res = await fetch(current.toString(), {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: { "User-Agent": USER_AGENT, Accept: opts.accept ?? "*/*" },
      });
      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get("location");
        try {
          await res.body?.cancel();
        } catch {
          /* free socket */
        }
        if (!loc) throw new Error(`redirect without Location from ${current.host}`);
        if (hop >= MAX_REDIRECTS) throw new Error(`too many redirects from ${input}`);
        current = requirePublicUrl(new URL(loc, current).toString());
        continue;
      }
      if (!res.ok) {
        try {
          await res.body?.cancel();
        } catch {
          /* ignore */
        }
        throw new Error(`HTTP ${res.status} from ${current.host}`);
      }
      const reader = res.body?.getReader();
      if (!reader) return await res.text();
      const chunks: Uint8Array[] = [];
      let size = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          size += value.length;
          chunks.push(value);
          if (size > maxBytes) {
            try {
              await reader.cancel();
            } catch {
              /* ignore */
            }
            break;
          }
        }
      }
      return Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf8");
    }
  } finally {
    clearTimeout(timer);
  }
}

/** Strip HTML to readable, whitespace-collapsed text. */
export function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/(p|div|li|h[1-6]|tr|section|article|header|footer|br)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\n\s*\n\s*/g, "\n\n")
    .trim();
}

// --- Piston code runner ------------------------------------------------------

export interface RunResult {
  ok: boolean;
  language: string;
  version?: string;
  stdout: string;
  stderr: string;
  code: number | null;
  message?: string;
}

interface Runtime {
  language: string;
  version: string;
  aliases?: string[];
}

/**
 * Execute code via a Piston-compatible runner. `baseUrl` defaults to the public
 * emkc.org Piston (now often whitelist-only → HTTP 401; self-host for reliability).
 * Never throws — returns a RunResult with `ok:false` + a message on failure.
 */
export async function runPiston(
  baseUrl: string,
  input: { language: string; version?: string; code: string; stdin?: string },
  timeoutMs = 15_000
): Promise<RunResult> {
  const base = baseUrl.replace(/\/+$/, "");
  const lang = input.language.trim().toLowerCase();
  try {
    let version = input.version;
    if (!version) {
      const runtimesText = await fetchRaw(`${base}/runtimes`, { accept: "application/json", timeoutMs });
      const runtimes = JSON.parse(runtimesText) as Runtime[];
      const match = runtimes.find(
        (r) => r.language.toLowerCase() === lang || (r.aliases || []).some((a) => a.toLowerCase() === lang)
      );
      if (!match) {
        return {
          ok: false,
          language: input.language,
          stdout: "",
          stderr: "",
          code: null,
          message: `language "${input.language}" is not available on the runner`,
        };
      }
      version = match.version;
    }
    const body = JSON.stringify({
      language: lang,
      version,
      files: [{ content: input.code }],
      stdin: input.stdin ?? "",
    });
    const u = requirePublicUrl(`${base}/execute`);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs + 2_000);
    try {
      const res = await fetch(u.toString(), {
        method: "POST",
        signal: controller.signal,
        headers: { "User-Agent": USER_AGENT, "Content-Type": "application/json", Accept: "application/json" },
        body,
      });
      if (!res.ok) {
        const hint =
          res.status === 401 || res.status === 403
            ? " (the public Piston is whitelist-only — self-host Piston and set PISTON_URL to http://localhost:2000/api/v2)"
            : "";
        return { ok: false, language: lang, version, stdout: "", stderr: "", code: null, message: `HTTP ${res.status} from the runner${hint}` };
      }
      const data = (await res.json()) as {
        run?: { stdout?: string; stderr?: string; code?: number; output?: string };
        compile?: { stderr?: string; code?: number };
        message?: string;
      };
      const run = data.run ?? {};
      const compileErr = data.compile?.stderr ? `${data.compile.stderr}\n` : "";
      return {
        ok: true,
        language: lang,
        version,
        stdout: run.stdout ?? "",
        stderr: compileErr + (run.stderr ?? ""),
        code: typeof run.code === "number" ? run.code : null,
      };
    } finally {
      clearTimeout(timer);
    }
  } catch (err) {
    return {
      ok: false,
      language: input.language,
      stdout: "",
      stderr: "",
      code: null,
      message: err instanceof Error ? err.message : String(err),
    };
  }
}
