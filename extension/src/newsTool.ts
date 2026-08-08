// The `learningos_news` language model tool.
//
// Lets Drona pull recent headlines from the bundled curated feed catalog
// (content/data/news-feeds.json) so it can produce a grounded, dated, cited news
// digest instead of guessing. Selection is by category id, topic tag, or a broad
// "top picks" default. Fetching goes through the SSRF-guarded feed client; the
// tool returns a compact, source-attributed, dated text list for the model to
// cluster and summarize. Never throws out of invoke (keeps the tool loop alive).

import * as vscode from "vscode";
import { loadFeedCatalog, fetchMany, FeedSource } from "./feeds";
import { recordCommand } from "./store";

export const NEWS_TOOL_NAME = "learningos_news";

interface NewsInput {
  category?: string;
  topic?: string;
  limit?: number;
}

function pickSources(feeds: FeedSource[], input: NewsInput): { sources: FeedSource[]; label: string } {
  const cat = (input.category || "").trim().toLowerCase();
  const topic = (input.topic || "").trim().toLowerCase();
  if (topic) {
    const s = feeds.filter((f) => (f.topics || []).some((t) => t.toLowerCase() === topic));
    if (s.length) {
      return { sources: s, label: `topic "${topic}"` };
    }
  }
  if (cat && cat !== "top" && cat !== "__top" && cat !== "all") {
    const s = feeds.filter((f) => f.category.toLowerCase() === cat);
    if (s.length) {
      return { sources: s, label: `category "${cat}"` };
    }
  }
  if (cat === "all") {
    return { sources: feeds.filter((f) => f.type === "rss" || f.type === "atom"), label: "all feeds" };
  }
  // Top picks: up to 2 text feeds per category.
  const perCat: Record<string, number> = {};
  const picks: FeedSource[] = [];
  for (const f of feeds) {
    if (f.type !== "rss" && f.type !== "atom") {
      continue;
    }
    perCat[f.category] = (perCat[f.category] || 0) + 1;
    if (perCat[f.category] <= 2) {
      picks.push(f);
    }
  }
  return { sources: picks, label: "top picks across domains" };
}

export function registerNewsTool(context: vscode.ExtensionContext): void {
  const tool: vscode.LanguageModelTool<NewsInput> = {
    async invoke(options, token) {
      const input = options.input || {};
      try {
        const catalog = await loadFeedCatalog(context);
        if (!catalog) {
          return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart("The LearningOS feed catalog is unavailable in this build."),
          ]);
        }
        const { sources, label } = pickSources(catalog.feeds, input);
        const limit = Math.max(5, Math.min(Number(input.limit) || 25, 50));
        const items = await fetchMany(sources, { perFeed: 5, total: limit, concurrency: 6, budgetMs: 25_000, token });

        try {
          recordCommand(context, "news");
        } catch {
          /* best-effort */
        }

        if (!items.length) {
          return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(
              `No items could be fetched right now for ${label} (feeds may be temporarily unreachable). Suggest the learner retry or cite official sources directly.`
            ),
          ]);
        }
        const lines = items.map((it) => {
          const d = it.isoDate ? it.isoDate.slice(0, 10) : "undated";
          return `- ${it.title} — ${it.source} (${d})\n  ${it.link}`;
        });
        const header =
          `Recent items from the LearningOS curated feed catalog (${label}, ${items.length} of ${sources.length} feeds), newest first. ` +
          `Cluster these by theme and summarize the most important few, each with why it matters and its source + date:\n`;
        return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(header + lines.join("\n"))]);
      } catch (err) {
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(
            `Could not gather news: ${err instanceof Error ? err.message : String(err)}. Fall back to citing official sources.`
          ),
        ]);
      }
    },
  };
  context.subscriptions.push(vscode.lm.registerTool(NEWS_TOOL_NAME, tool));
}
