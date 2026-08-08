# LearningOS data catalogs

> **The feed catalog is data, not code.** Add or remove sources by editing the JSON here — no code
> changes needed. These files power the extension's **Tech News** and **Roadmaps** views, the
> `learningos_news` tool, and the **Research & News Analyst** agent.

| File | What it is |
|---|---|
| [`news-feeds.json`](news-feeds.json) | Curated RSS/Atom feed catalog (~190 sources) grouped into categories, each with topic tags. |
| [`feeds.opml`](feeds.opml) | The same feeds as an **OPML 2.0** file — import into any RSS reader (Feedly, NetNewsWire, etc.). Regenerated from `news-feeds.json`. |
| [`roadmaps.json`](roadmaps.json) | A **link-out** catalog of [roadmap.sh](https://roadmap.sh) learning paths (title, slug, canonical URL, our own description). |

## `news-feeds.json` shape

```jsonc
{
  "version": 1,
  "updated": "YYYY-MM-DD",
  "categories": { "<id>": { "label": "…", "domain": "…" } },
  "feeds": [
    {
      "id": "openai-blog",              // stable unique slug
      "name": "OpenAI Blog",            // human-readable
      "url": "https://openai.com/blog/rss.xml",
      "type": "rss",                    // rss | atom | youtube | podcast
      "category": "ai-ml",              // one of the keys in `categories`
      "topics": ["ai"],                 // free tags used for filtering
      "homepage": "https://openai.com"
    }
  ]
}
```

**Categories:** `ai-ml`, `research`, `cloud-vendor`, `release-notes`, `devops`, `data`, `security`,
`language`, `web`, `eng-blog`, `dev-tools`, `dev-community`, `thought-leader`, `news`, `community`,
`video`, `podcast`.

### Add a feed
1. Append an object to `feeds` (pick an existing `category`, or add one to `categories`).
2. Give it a unique `id` and a clean `name`, and confirm the `url` returns valid RSS/Atom.
3. Re-export the OPML (the extension's **Drona: Export curated feeds (OPML)** command does this from the
   live catalog), and re-package the extension so `content/data/` ships the update.

### Provenance & safety
- The initial set was cleaned from a personal aggregator export; ~60 **authoritative primary-source**
  feeds (official release notes, language/runtime blogs, security advisories, data platforms) were then
  added and each URL verified to return valid RSS/Atom.
- Feeds are fetched **only** in the extension host through the same SSRF guard the fetch tool uses
  (no private/loopback/link-local/metadata hosts); the webview itself makes no network requests.

## `roadmaps.json` — attribution (required)

roadmap.sh / `kamranahmedse/developer-roadmap` content is **all-rights-reserved**. Sharing **links** to
roadmap.sh is expressly permitted; copying roadmap node content is **not**. This catalog therefore stores
**only** titles, slugs, canonical `roadmap.sh` URLs, and LearningOS-authored descriptions — never any
roadmap step/node content. Wherever the catalog is surfaced, ship this credit:

> Roadmaps courtesy of [roadmap.sh](https://roadmap.sh) by Kamran Ahmed — © roadmap.sh, all rights
> reserved. LearningOS links to these roadmaps and is not affiliated with or endorsed by roadmap.sh.
