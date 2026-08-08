// Pure, dependency-free RSS/Atom parsing for the LearningOS feed client.
//
// Extracted from feeds.ts so it can be unit-tested directly (it imports NOTHING
// from vscode). Hardened against hostile input:
//   * Linear block splitting (no O(n^2) lazy-regex scan) — a 1.5 MB body of
//     unclosed <item>/<title> tags parses in ~2 ms instead of ~2 minutes.
//   * Bounded block count, block size, and capture length.
//   * Residual markup tags are stripped BEFORE entity decoding, so a headline
//     like "Why &lt;canvas&gt; beats &lt;svg&gt;" keeps its text.

export interface ParsedItem {
  title: string;
  link: string;
  isoDate: string; // "" when the feed gave no parseable date
}

const MAX_BLOCKS = 400; // cap items scanned per feed
const MAX_BLOCK_CHARS = 20_000; // cap chars considered per <item>/<entry>
const MAX_CAPTURE = 4_000; // cap a single tag's inner capture

/** Strip to readable text: unwrap CDATA, remove markup, THEN decode entities. */
export function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ") // strip residual tags BEFORE decoding entities
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, d) => {
      try {
        return String.fromCodePoint(Number(d));
      } catch {
        return "";
      }
    })
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Split an XML body into per-item blocks LINEARLY (split on the closing tag),
 * bounded in count and size. This avoids the catastrophic backtracking of a
 * lazy `<item>[\s\S]*?</item>` scan on bodies with many unclosed tags.
 */
function splitBlocks(xml: string, tag: string): string[] {
  const parts = xml.split(new RegExp(`</${tag}>`, "i"));
  const open = new RegExp(`<${tag}\\b`, "i");
  const out: string[] = [];
  for (let i = 0; i < parts.length - 1 && out.length < MAX_BLOCKS; i++) {
    const k = parts[i].search(open);
    if (k !== -1) {
      out.push(parts[i].slice(k, k + MAX_BLOCK_CHARS));
    }
  }
  return out;
}

/** First `<tag>…</tag>` inner text in a block, with a bounded capture length. */
export function firstTag(block: string, tag: string): string | undefined {
  const m = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]{0,${MAX_CAPTURE}}?)</${tag}>`, "i"));
  return m ? m[1] : undefined;
}

/** Atom links: prefer rel="alternate"; fall back to the first href. */
export function atomLink(block: string): string | undefined {
  const links = [...block.matchAll(/<link\b([^>]*)\/?>(?:<\/link>)?/gi)].map((m) => m[1]);
  const hrefOf = (attrs: string) => (attrs.match(/href\s*=\s*["']([^"']+)["']/i) || [])[1];
  const relOf = (attrs: string) => (attrs.match(/rel\s*=\s*["']([^"']+)["']/i) || [])[1];
  const alt = links.find((a) => (relOf(a) || "alternate") === "alternate" && hrefOf(a));
  return hrefOf(alt ?? links.find((a) => hrefOf(a)) ?? "");
}

/** Parse RSS `<item>` / Atom `<entry>` blocks into normalized items. Never throws. */
export function parseFeedItems(xml: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  const isAtom = /<entry[\s>]/i.test(xml) && !/<item[\s>]/i.test(xml);
  const blocks = splitBlocks(xml, isAtom ? "entry" : "item");

  for (const b of blocks) {
    const rawTitle = firstTag(b, "title");
    if (!rawTitle) {
      continue;
    }
    const title = decodeEntities(rawTitle);
    let link: string | undefined;
    if (isAtom) {
      link = atomLink(b);
    } else {
      link = firstTag(b, "link");
      if (link) {
        link = decodeEntities(link);
      }
      if (!link) {
        const g = firstTag(b, "guid");
        if (g && /^https?:\/\//i.test(g.trim())) {
          link = decodeEntities(g);
        }
      }
    }
    const dateRaw =
      firstTag(b, "pubDate") ||
      firstTag(b, "published") ||
      firstTag(b, "updated") ||
      firstTag(b, "dc:date") ||
      "";
    let isoDate = "";
    if (dateRaw) {
      const t = Date.parse(dateRaw.trim());
      if (!Number.isNaN(t)) {
        isoDate = new Date(t).toISOString();
      }
    }
    if (title && link) {
      items.push({ title, link: link.trim(), isoDate });
    }
  }
  return items;
}
