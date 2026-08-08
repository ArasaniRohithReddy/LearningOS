// LearningOS feed client.
//
// Loads the bundled curated feed catalog (content/data/news-feeds.json) and
// fetches + parses RSS/Atom feeds into a normalized item list for the Tech-News
// view and the `learningos_news` tool.
//
// Security: every request (and every redirect hop) is run through the SAME SSRF
// guard the fetch tool uses (`isBlockedHost` from fetchTool.ts) — private,
// loopback, link-local and cloud-metadata hosts are refused. https/http only.
//
// No runtime dependencies: uses the Node 18+ global `fetch` with a manual,
// bounded, guarded redirect loop, and a small tolerant XML scanner (no parser dep).

import * as vscode from "vscode";
import { isBlockedHost } from "./fetchTool";
import { contentUri } from "./catalog";
import { parseFeedItems } from "./feedParse";

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  type: string; // rss | atom | youtube | podcast
  category: string;
  topics: string[];
  homepage: string;
}
export interface CategoryMeta {
  label: string;
  domain: string;
}
export interface FeedCatalog {
  version: number;
  updated: string;
  categories: Record<string, CategoryMeta>;
  feeds: FeedSource[];
}
export interface NewsItem {
  title: string;
  link: string;
  isoDate: string; // "" when the feed gave no date
  source: string; // feed name
  category: string;
  topics: string[];
}

const FEED_TIMEOUT_MS = 12_000;
const MAX_FEED_BYTES = 1_500_000; // ~1.5 MB cap per feed
const MAX_REDIRECTS = 3;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/124.0 Safari/537.36 LearningOS-Drona/1.1";

let catalogCache: FeedCatalog | undefined;

/** Read + parse the bundled feed catalog (cached). Returns undefined if missing/corrupt. */
export async function loadFeedCatalog(context: vscode.ExtensionContext): Promise<FeedCatalog | undefined> {
  if (catalogCache) {
    return catalogCache;
  }
  try {
    const bytes = await vscode.workspace.fs.readFile(contentUri(context, "data", "news-feeds.json"));
    const parsed = JSON.parse(Buffer.from(bytes).toString("utf8")) as FeedCatalog;
    if (parsed && Array.isArray(parsed.feeds)) {
      catalogCache = parsed;
      return parsed;
    }
  } catch {
    /* fall through */
  }
  return undefined;
}

/** Validate an https/http URL and reject blocked hosts. Throws a friendly Error. */
function requirePublicUrl(input: string): URL {
  const u = new URL(input);
  if (u.protocol !== "https:" && u.protocol !== "http:") {
    throw new Error(`unsupported scheme ${u.protocol}`);
  }
  if (isBlockedHost(u.hostname)) {
    throw new Error(`blocked host ${u.hostname}`);
  }
  return u;
}

/** Fetch a feed body with a bounded, SSRF-guarded manual redirect loop. */
async function fetchFeedBody(url: string, signal: AbortSignal): Promise<string> {
  let current = requirePublicUrl(url);
  for (let hop = 0; ; hop++) {
    const res = await fetch(current.toString(), {
      method: "GET",
      redirect: "manual",
      signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
      },
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      try {
        await res.body?.cancel();
      } catch {
        /* free socket */
      }
      if (!loc) {
        throw new Error(`redirect without Location from ${current.host}`);
      }
      if (hop >= MAX_REDIRECTS) {
        throw new Error(`too many redirects from ${url}`);
      }
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
    // Read with a byte cap.
    const reader = res.body?.getReader();
    if (!reader) {
      return await res.text();
    }
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (value) {
        size += value.length;
        chunks.push(value);
        if (size > MAX_FEED_BYTES) {
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
}

// --- parse (hardened + testable, see feedParse.ts) → attach source metadata ---

/** Parse a feed body and attach the source's display name / category / topics. */
function parseFeed(xml: string, source: FeedSource): NewsItem[] {
  return parseFeedItems(xml).map((it) => ({
    title: it.title,
    link: it.link,
    isoDate: it.isoDate,
    source: source.name,
    category: source.category,
    topics: source.topics ?? [],
  }));
}

/** Fetch + parse a single feed; never throws (returns [] on any failure). */
export async function fetchFeed(source: FeedSource, maxItems = 8): Promise<NewsItem[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS);
  try {
    const body = await fetchFeedBody(source.url, controller.signal);
    return parseFeed(body, source).slice(0, maxItems);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch many feeds with a small concurrency limit, merge, sort newest-first, and
 * cap the result. Undated items sink to the bottom (stable by source).
 */
export async function fetchMany(
  sources: FeedSource[],
  opts: { perFeed?: number; total?: number; concurrency?: number; budgetMs?: number; token?: vscode.CancellationToken } = {}
): Promise<NewsItem[]> {
  const perFeed = opts.perFeed ?? 6;
  const total = opts.total ?? 60;
  const concurrency = Math.max(1, Math.min(opts.concurrency ?? 6, 10));
  const deadline = Date.now() + (opts.budgetMs ?? 25_000);
  const token = opts.token;

  const queue = [...sources];
  const all: NewsItem[] = [];
  async function worker(): Promise<void> {
    for (;;) {
      if (Date.now() > deadline || token?.isCancellationRequested) {
        return; // overall wall-clock budget / cancellation → return partial results
      }
      const src = queue.shift();
      if (!src) {
        return;
      }
      const items = await fetchFeed(src, perFeed);
      all.push(...items);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  all.sort((a, b) => {
    if (a.isoDate && b.isoDate) {
      return b.isoDate.localeCompare(a.isoDate);
    }
    if (a.isoDate) {
      return -1;
    }
    if (b.isoDate) {
      return 1;
    }
    return 0;
  });
  return all.slice(0, total);
}

/** Build an OPML 2.0 document (importable into any RSS reader) from the catalog. */
export function buildOpml(catalog: FeedCatalog): string {
  const esc = (s: string) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const byCat: Record<string, FeedSource[]> = {};
  for (const f of catalog.feeds) {
    (byCat[f.category] ||= []).push(f);
  }
  const out: string[] = [];
  out.push('<?xml version="1.0" encoding="UTF-8"?>');
  out.push('<opml version="2.0">');
  out.push("  <head><title>LearningOS — Curated Tech Feeds</title></head>");
  out.push("  <body>");
  for (const cat of Object.keys(byCat).sort()) {
    const label = catalog.categories?.[cat]?.label || cat;
    out.push(`    <outline text="${esc(label)}" title="${esc(label)}">`);
    for (const f of byCat[cat]) {
      out.push(
        `      <outline type="rss" text="${esc(f.name)}" title="${esc(f.name)}" xmlUrl="${esc(f.url)}" htmlUrl="${esc(f.homepage)}"/>`
      );
    }
    out.push("    </outline>");
  }
  out.push("  </body>");
  out.push("</opml>");
  return out.join("\n") + "\n";
}
