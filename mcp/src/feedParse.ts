// Pure, dependency-free RSS/Atom parsing (ported from the LearningOS extension).
// Hardened against catastrophic backtracking: linear block splitting, bounded
// block count/size/capture; residual markup stripped before entity decoding.

export interface ParsedItem {
  title: string;
  link: string;
  isoDate: string;
}

const MAX_BLOCKS = 400;
const MAX_BLOCK_CHARS = 20_000;
const MAX_CAPTURE = 4_000;

export function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
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

function firstTag(block: string, tag: string): string | undefined {
  const m = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]{0,${MAX_CAPTURE}}?)</${tag}>`, "i"));
  return m ? m[1] : undefined;
}

function atomLink(block: string): string | undefined {
  const links = [...block.matchAll(/<link\b([^>]*)\/?>(?:<\/link>)?/gi)].map((m) => m[1]);
  const hrefOf = (attrs: string) => (attrs.match(/href\s*=\s*["']([^"']+)["']/i) || [])[1];
  const relOf = (attrs: string) => (attrs.match(/rel\s*=\s*["']([^"']+)["']/i) || [])[1];
  const alt = links.find((a) => (relOf(a) || "alternate") === "alternate" && hrefOf(a));
  return hrefOf(alt ?? links.find((a) => hrefOf(a)) ?? "");
}

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
      firstTag(b, "pubDate") || firstTag(b, "published") || firstTag(b, "updated") || firstTag(b, "dc:date") || "";
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
