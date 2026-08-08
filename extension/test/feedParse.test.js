// Unit tests for the hardened feed parser (extension/src/feedParse.ts).
//
// Runs against the COMPILED module (out/feedParse.js), so it exercises the real
// shipped code. Run with:  npm test   (from the extension/ folder)
// Exits non-zero on any failure (usable in CI).

"use strict";
const assert = require("node:assert");
const path = require("node:path");

const mod = require(path.join(__dirname, "..", "out", "feedParse.js"));
const { parseFeedItems, decodeEntities } = mod;

let failed = 0;
function ok(name, cond) {
  if (cond) {
    console.log("PASS " + name);
  } else {
    failed++;
    console.error("FAIL " + name);
  }
}

// --- RSS ---------------------------------------------------------------------
const rss = `<?xml version="1.0"?><rss><channel>
<item><title>Hello &amp; Welcome</title><link>https://ex.com/a</link><pubDate>Wed, 06 Aug 2025 12:00:00 GMT</pubDate></item>
<item><title><![CDATA[Second <b>Post</b>]]></title><guid isPermaLink="true">https://ex.com/b</guid><dc:date>2025-08-05T09:00:00Z</dc:date></item>
</channel></rss>`;
const r = parseFeedItems(rss);
ok("rss: 2 items", r.length === 2);
ok("rss: entity-decoded title", r[0].title === "Hello & Welcome");
ok("rss: link", r[0].link === "https://ex.com/a");
ok("rss: RFC-822 date -> ISO", r[0].isoDate === "2025-08-06T12:00:00.000Z");
ok("rss: CDATA + inner tag stripped", r[1].title === "Second Post");
ok("rss: guid permalink used as link", r[1].link === "https://ex.com/b");

// --- Atom --------------------------------------------------------------------
const atom = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom">
<entry><title>Atom One</title><link rel="alternate" href="https://ex.com/x"/><published>2025-08-04T10:00:00Z</published></entry>
<entry><title>Atom Two</title><link href="https://ex.com/y"/><updated>2025-08-03T10:00:00Z</updated></entry>
</feed>`;
const a = parseFeedItems(atom);
ok("atom: 2 entries", a.length === 2);
ok("atom: rel=alternate link", a[0].link === "https://ex.com/x");
ok("atom: fallback href link", a[1].link === "https://ex.com/y");
ok("atom: published date", a[0].isoDate === "2025-08-04T10:00:00.000Z");

// --- YouTube Atom ------------------------------------------------------------
const yt = `<feed xmlns="http://www.w3.org/2005/Atom">
<entry><title>Video Title</title><link rel="alternate" href="https://youtube.com/watch?v=abc"/><published>2025-08-02T10:00:00Z</published></entry>
</feed>`;
const y = parseFeedItems(yt);
ok("youtube atom: 1 entry with query-string link", y.length === 1 && y[0].link.includes("watch?v=abc"));

// --- Entity-preservation fix (was: content silently deleted) -----------------
ok(
  "decode keeps encoded angle-bracket content",
  decodeEntities("Why &lt;canvas&gt; beats &lt;svg&gt; for 60fps") === "Why <canvas> beats <svg> for 60fps"
);
const gen = parseFeedItems(
  `<rss><channel><item><title>Using Vec&lt;T&gt; in Rust</title><link>https://ex.com/g</link></item></channel></rss>`
);
ok("generics headline preserved", gen.length === 1 && gen[0].title === "Using Vec<T> in Rust");

// --- ReDoS / catastrophic-backtracking guard (must be FAST) -------------------
// A 1.5 MB body with ~250k unclosed <item> tags used to take ~73 s. Must be < 1 s now.
const hostileItems = "<item ".repeat(250000);
let t0 = Date.now();
const h1 = parseFeedItems(hostileItems);
const d1 = Date.now() - t0;
ok(`hostile unclosed <item> parses fast (${d1}ms < 1500)`, d1 < 1500);
ok("hostile unclosed <item> yields no items", Array.isArray(h1) && h1.length === 0);

// Many items, each with a huge unclosed <title> (~1.5 MB) — used to take ~131 s.
const hostileTitles = ("<item><title>" + "x".repeat(6000)).repeat(230);
t0 = Date.now();
const h2 = parseFeedItems(hostileTitles);
const d2 = Date.now() - t0;
ok(`hostile unclosed <title> parses fast (${d2}ms < 1500)`, d2 < 1500);

// --- Robustness --------------------------------------------------------------
ok("empty string -> []", parseFeedItems("").length === 0);
ok("garbage -> []", parseFeedItems("not xml at all <<< >>>").length === 0);
ok("item without title skipped", parseFeedItems("<rss><item><link>https://x</link></item></rss>").length === 0);
ok("bad date -> empty isoDate", (() => {
  const p = parseFeedItems("<rss><item><title>T</title><link>https://x</link><pubDate>not-a-date</pubDate></item></rss>");
  return p.length === 1 && p[0].isoDate === "";
})());

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} TEST(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
