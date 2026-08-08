// The `learningos_fetch` language model tool.
//
// It lets Drona retrieve the readable text of a public https page (an official
// "what's new" / release-notes / blog page, for example) so the model can
// summarise current, dated information instead of refusing or guessing.
//
// Design goals:
//   * Never throw out of `invoke` — always return a LanguageModelToolResult,
//     using a short human/model-readable error string on failure. That keeps the
//     tool-calling loop alive so the model can fall back to citing sources.
//   * Work fully offline-safe: a ~10s timeout, cancellation support, size caps.
//   * No runtime dependencies: use the Node 18+ global `fetch`, falling back to
//     the built-in `https`/`http` modules if `fetch` is somehow unavailable.

import * as vscode from "vscode";
import * as https from "node:https";
import * as http from "node:http";
import * as net from "node:net";
import { recordCommand } from "./store";

export interface FetchInput {
  url: string;
}

/** Must match `contributes.languageModelTools[].name` in package.json. */
export const FETCH_TOOL_NAME = "learningos_fetch";

const TIMEOUT_MS = 10_000;
const MAX_BODY_BYTES = 2_000_000; // stop reading absurdly large pages (~2 MB)
const MAX_TEXT_CHARS = 8_000; // truncate the readable text handed to the model
const MAX_REDIRECTS = 3; // cap redirect hops on the Node fallback path
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/124.0 Safari/537.36 LearningOS-Drona/1.1";

/** Is a canonical dotted-decimal IPv4 (a.b.c.d) in a blocked range? */
function isBlockedIPv4(host: string): boolean {
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) {
    return true; // not canonical → block defensively
  }
  const octets = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
  if (octets.some((n) => n > 255)) {
    return true;
  }
  const [a, b] = octets;
  if (a === 0) return true; // 0.0.0.0/8
  if (a === 127) return true; // 127.0.0.0/8 loopback
  if (a === 10) return true; // 10.0.0.0/8 private
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12 private (172.15/172.32 stay allowed)
  if (a === 192 && b === 168) return true; // 192.168.0.0/16 private
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local (incl. 169.254.169.254 metadata)
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 CGNAT/shared (Alibaba Cloud metadata)
  return false;
}

/** Parse one part of a dotted host as an integer, honoring hex (0x) and octal (leading 0). */
function parseNumericPart(part: string): number | undefined {
  if (/^0x[0-9a-f]+$/i.test(part)) {
    return parseInt(part.slice(2), 16);
  }
  if (/^0[0-7]+$/.test(part)) {
    return parseInt(part, 8);
  }
  if (/^(0|[1-9]\d*)$/.test(part)) {
    return parseInt(part, 10);
  }
  return undefined; // non-numeric (a normal DNS label)
}

/**
 * Canonicalize a numeric host written in a non-standard encoding to dotted-decimal
 * IPv4, matching inet_aton semantics (decimal `2852039166`, octal `0177.0.0.1`,
 * hex `0x7f000001`, and short dotted forms like `127.1`). Returns undefined for
 * anything that isn't purely numeric (i.e. a real DNS name), so those stay allowed.
 */
function canonicalizeToIPv4(host: string): string | undefined {
  const parts = host.split(".");
  if (parts.length === 0 || parts.length > 4) {
    return undefined;
  }
  const nums: number[] = [];
  for (const part of parts) {
    const n = parseNumericPart(part);
    if (n === undefined || n < 0) {
      return undefined; // a non-numeric label → treat the whole host as a DNS name
    }
    nums.push(n);
  }
  // inet_aton: leading parts are single bytes; the final part fills the rest.
  let value: number;
  const n = nums.length;
  if (n === 1) {
    value = nums[0];
  } else {
    for (let i = 0; i < n - 1; i++) {
      if (nums[i] > 255) {
        return undefined;
      }
    }
    const lastBytes = 4 - (n - 1);
    if (nums[n - 1] >= Math.pow(256, lastBytes)) {
      return undefined;
    }
    value = nums[n - 1];
    for (let i = 0; i < n - 1; i++) {
      value += nums[i] * Math.pow(256, 3 - i);
    }
  }
  if (value < 0 || value > 0xffffffff) {
    return undefined;
  }
  const a = Math.floor(value / 0x1000000) & 0xff;
  const b = Math.floor(value / 0x10000) & 0xff;
  const c = Math.floor(value / 0x100) & 0xff;
  const d = value & 0xff;
  return `${a}.${b}.${c}.${d}`;
}

/** Expand any valid IPv6 literal (incl. `::` and embedded IPv4) to 8 hextets. */
function ipv6ToHextets(input: string): number[] | undefined {
  let s = input;
  // Convert a trailing embedded IPv4 (e.g. ::ffff:127.0.0.1) into two hex groups.
  const v4 = s.match(/(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const o = [Number(v4[1]), Number(v4[2]), Number(v4[3]), Number(v4[4])];
    if (o.some((x) => x > 255)) {
      return undefined;
    }
    const g1 = ((o[0] << 8) | o[1]).toString(16);
    const g2 = ((o[2] << 8) | o[3]).toString(16);
    s = s.slice(0, s.length - v4[0].length) + g1 + ":" + g2;
  }
  let groups: string[];
  if (s.includes("::")) {
    const halves = s.split("::");
    if (halves.length > 2) {
      return undefined;
    }
    const head = halves[0] ? halves[0].split(":") : [];
    const tail = halves[1] ? halves[1].split(":") : [];
    const missing = 8 - head.length - tail.length;
    if (missing < 0) {
      return undefined;
    }
    groups = [...head, ...Array(missing).fill("0"), ...tail];
  } else {
    groups = s.split(":");
  }
  if (groups.length !== 8) {
    return undefined;
  }
  const nums = groups.map((g) => (g === "" ? NaN : parseInt(g, 16)));
  if (nums.some((n) => Number.isNaN(n) || n < 0 || n > 0xffff)) {
    return undefined;
  }
  return nums;
}

/** Is a valid IPv6 literal loopback / unspecified / unique-local / link-local / v4-mapped-to-blocked? */
function isBlockedIPv6(host: string): boolean {
  const g = ipv6ToHextets(host);
  if (!g) {
    return true; // unparseable → block defensively
  }
  const firstSevenZero = g.slice(0, 7).every((x) => x === 0);
  if (firstSevenZero && (g[7] === 0 || g[7] === 1)) {
    return true; // :: (unspecified) or ::1 (loopback)
  }
  if (g[0] >= 0xfc00 && g[0] <= 0xfdff) return true; // fc00::/7 unique-local
  if (g[0] >= 0xfe80 && g[0] <= 0xfebf) return true; // fe80::/10 link-local
  // IPv4-mapped (::ffff:a.b.c.d) or IPv4-compatible (::a.b.c.d): check the embedded v4.
  const firstFiveZero = g.slice(0, 5).every((x) => x === 0);
  if (firstFiveZero && (g[5] === 0xffff || g[5] === 0) && !(g[5] === 0 && g[6] === 0 && (g[7] === 0 || g[7] === 1))) {
    const a = g[6] >> 8;
    const b = g[6] & 0xff;
    const c = g[7] >> 8;
    const d = g[7] & 0xff;
    return isBlockedIPv4(`${a}.${b}.${c}.${d}`);
  }
  return false; // ordinary public IPv6 → allowed
}

/**
 * SSRF guard: reject hosts that resolve to loopback / private / link-local /
 * cloud-metadata ranges. Returns true when the host must NOT be fetched.
 * Checked after parsing the URL and again on every redirect hop.
 *
 * Beyond canonical dotted-decimal IPv4 and `::1`, this also catches classic bypass
 * encodings: decimal (`2852039166`), octal (`0177.0.0.1`), hex (`0x7f000001`),
 * short dotted forms (`127.1`), a trailing dot (`127.0.0.1.` / `localhost.`), and
 * expanded / IPv4-mapped IPv6 loopback (`0:0:0:0:0:0:0:1`, `::ffff:7f00:1`).
 *
 * Residual limitation: this validates the URL's hostname only — it does NOT resolve
 * DNS, so a public name that resolves (or is later rebound) to a private IP can still
 * slip through. Fully closing that requires resolving and pinning the IP, which is
 * out of scope for a dependency-free fetch tool.
 */
export function isBlockedHost(hostname: string | undefined): boolean {
  let host = (hostname ?? "").trim().toLowerCase();
  if (!host) {
    return true;
  }
  // Strip IPv6 brackets and any zone id (e.g. "[fe80::1%eth0]").
  if (host.startsWith("[") && host.endsWith("]")) {
    host = host.slice(1, -1);
  }
  const zone = host.indexOf("%");
  if (zone !== -1) {
    host = host.slice(0, zone);
  }
  // Normalize a single trailing dot (FQDN root / evasion trick): "127.0.0.1." → "127.0.0.1".
  if (host.length > 1 && host.endsWith(".")) {
    host = host.slice(0, -1);
  }
  if (!host) {
    return true;
  }

  // Named local hosts.
  if (host === "localhost" || host === "local" || host.endsWith(".local")) {
    return true;
  }

  // Canonical IP literals (net.isIP: 0 = not an IP, 4 = IPv4, 6 = IPv6).
  const ver = net.isIP(host);
  if (ver === 4) {
    return isBlockedIPv4(host);
  }
  if (ver === 6) {
    return isBlockedIPv6(host);
  }

  // Not a canonical literal: block alternative numeric encodings that decode to an
  // IP (these are the SSRF bypasses; a legitimate source is always a DNS name that
  // won't canonicalize). e.g. http://2852039166 decodes to 169.254.169.254.
  const canonical = canonicalizeToIPv4(host);
  if (canonical) {
    return isBlockedIPv4(canonical);
  }

  return false; // ordinary DNS hostname → allowed (see DNS-rebinding caveat above)
}

/** Best-effort host extraction for friendly progress messages. */
function safeHost(url: string | undefined): string {
  try {
    return new URL(url ?? "").host || "the page";
  } catch {
    return "the page";
  }
}

/** Strip HTML to readable, whitespace-collapsed text. */
function htmlToText(html: string): string {
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
    .replace(/&#x27;/gi, "'")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\n\s*\n\s*/g, "\n\n")
    .trim();
}

function truncate(text: string): string {
  if (text.length <= MAX_TEXT_CHARS) {
    return text;
  }
  return text.slice(0, MAX_TEXT_CHARS).trimEnd() + "\n\n…[truncated]";
}

/** Validate and normalise a URL. Returns the URL or throws a friendly Error. */
function requireHttpUrl(input: string | undefined): URL {
  if (!input || typeof input !== "string") {
    throw new Error("no URL was provided");
  }
  let u: URL;
  try {
    u = new URL(input.trim());
  } catch {
    throw new Error(`"${input}" is not a valid URL`);
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") {
    throw new Error(`unsupported URL scheme "${u.protocol}" (only http/https are allowed)`);
  }
  if (isBlockedHost(u.hostname)) {
    throw new Error(
      `refusing to fetch a private, local or link-local address (${u.hostname}); only public https pages are allowed`
    );
  }
  return u;
}

/** Fetch via the Node built-in http/https modules (fallback when global fetch is missing). */
function fetchViaNode(
  u: URL,
  token: vscode.CancellationToken,
  redirectsLeft: number = MAX_REDIRECTS
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const lib = u.protocol === "https:" ? https : http;
    const req = lib.request(
      u,
      {
        method: "GET",
        headers: { "User-Agent": USER_AGENT, Accept: "text/html,text/plain,*/*" },
        timeout: TIMEOUT_MS,
      },
      (res) => {
        const status = res.statusCode ?? 0;
        // Follow redirects manually (keeps this dependency-free), but bounded and guarded.
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          if (redirectsLeft <= 0) {
            reject(new Error(`too many redirects from ${u.host}`));
            return;
          }
          let next: URL;
          try {
            next = new URL(res.headers.location, u);
          } catch {
            reject(new Error(`bad redirect from ${u.host}`));
            return;
          }
          if (next.protocol !== "https:" && next.protocol !== "http:") {
            reject(new Error(`unsupported redirect scheme "${next.protocol}"`));
            return;
          }
          if (isBlockedHost(next.hostname)) {
            reject(
              new Error(`refusing to follow a redirect to a private/local address (${next.hostname})`)
            );
            return;
          }
          fetchViaNode(next, token, redirectsLeft - 1).then(resolve, reject);
          return;
        }
        if (status < 200 || status >= 300) {
          res.resume();
          reject(new Error(`HTTP ${status} from ${u.host}`));
          return;
        }
        let size = 0;
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => {
          size += c.length;
          if (size > MAX_BODY_BYTES) {
            req.destroy();
            resolve(Buffer.concat(chunks).toString("utf8"));
            return;
          }
          chunks.push(c);
        });
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        res.on("error", (e) => reject(e));
      }
    );
    req.on("timeout", () => req.destroy(new Error(`timed out after ${TIMEOUT_MS / 1000}s`)));
    req.on("error", (e) => reject(e));
    const onCancel = token.onCancellationRequested(() => req.destroy(new Error("cancelled")));
    req.on("close", () => onCancel.dispose());
    req.end();
  });
}

/**
 * Fetch via the global `fetch` (Node 18+ / VS Code extension host).
 *
 * Redirects are followed MANUALLY (`redirect: "manual"`) so every hop's Location
 * host is run through the SSRF guard before we follow it — with `redirect: "follow"`
 * the platform would chase intermediate hops we never get to inspect. The streamed
 * byte cap and Content-Length bail are preserved on the final response.
 */
async function fetchViaGlobal(u: URL, token: vscode.CancellationToken): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const onCancel = token.onCancellationRequested(() => controller.abort());
  try {
    let current = u;
    for (let hop = 0; ; hop++) {
      const res = await fetch(current.toString(), {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: { "User-Agent": USER_AGENT, Accept: "text/html,text/plain,*/*" },
      });

      // Redirect hop: validate the next host ourselves, bounded by MAX_REDIRECTS.
      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        try {
          await res.body?.cancel();
        } catch {
          /* free the socket */
        }
        if (!location) {
          throw new Error(`redirect without a Location header from ${current.host}`);
        }
        if (hop >= MAX_REDIRECTS) {
          throw new Error(`too many redirects from ${u.host}`);
        }
        let next: URL;
        try {
          next = new URL(location, current);
        } catch {
          throw new Error(`bad redirect from ${current.host}`);
        }
        if (next.protocol !== "https:" && next.protocol !== "http:") {
          throw new Error(`unsupported redirect scheme "${next.protocol}"`);
        }
        if (isBlockedHost(next.hostname)) {
          throw new Error(`refusing to follow a redirect to a private/local address (${next.hostname})`);
        }
        current = next;
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

      // Bail early if the server declares an over-large body.
      const declared = Number(res.headers.get("content-length"));
      if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
        try {
          await res.body?.cancel();
        } catch {
          /* ignore */
        }
        throw new Error(`response too large (${declared} bytes) from ${current.host}`);
      }

      // Stream the body and stop once the byte cap is exceeded.
      const body = res.body;
      if (!body) {
        return "";
      }
      const reader = body.getReader();
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
  } finally {
    clearTimeout(timer);
    onCancel.dispose();
  }
}

/** Retrieve readable text for a URL, or throw a friendly Error. */
async function fetchReadableText(input: string | undefined, token: vscode.CancellationToken): Promise<string> {
  const u = requireHttpUrl(input);
  const hasGlobalFetch = typeof (globalThis as { fetch?: unknown }).fetch === "function";
  let raw: string;
  try {
    raw = hasGlobalFetch ? await fetchViaGlobal(u, token) : await fetchViaNode(u, token);
  } catch (err) {
    // Don't work around an SSRF policy block by retrying on the other path.
    const isPolicyBlock = err instanceof Error && err.message.startsWith("refusing");
    // If the modern path aborts for a non-cancellation reason, try the Node path once.
    if (hasGlobalFetch && !token.isCancellationRequested && !isPolicyBlock) {
      raw = await fetchViaNode(u, token);
    } else {
      throw err;
    }
  }
  const text = truncate(htmlToText(raw));
  if (!text) {
    return `Fetched ${u.toString()} but no readable text was found on the page.`;
  }
  return `Source: ${u.toString()}\nRetrieved: ${new Date().toISOString()}\n\n${text}`;
}

export class LearningFetchTool implements vscode.LanguageModelTool<FetchInput> {
  constructor(private readonly context: vscode.ExtensionContext) {}

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<FetchInput>,
    _token: vscode.CancellationToken
  ): Promise<vscode.PreparedToolInvocation> {
    return { invocationMessage: `Fetching ${safeHost(options.input?.url)}…` };
  }

  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<FetchInput>,
    token: vscode.CancellationToken
  ): Promise<vscode.LanguageModelToolResult> {
    try {
      const text = await fetchReadableText(options.input?.url, token);
      // Count a successful fetch for the dashboard's "commands & tools used" chart
      // (best-effort; never break the tool). Does not touch the SSRF-guarded path.
      void recordCommand(this.context, "fetch").catch(() => {
        /* persistence is best-effort */
      });
      return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(text)]);
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      // Return the failure as content (do NOT throw) so the model can gracefully
      // fall back to citing official source URLs instead.
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(
          `Could not fetch that page: ${reason}. ` +
            `Tell the learner you could not retrieve live content and cite the official source URL(s) instead.`
        ),
      ]);
    }
  }
}

/** Register the tool; safe to call once on activation. */
export function registerFetchTool(context: vscode.ExtensionContext): void {
  context.subscriptions.push(vscode.lm.registerTool<FetchInput>(FETCH_TOOL_NAME, new LearningFetchTool(context)));
}
