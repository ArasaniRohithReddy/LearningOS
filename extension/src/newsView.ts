// The "Tech News" and "Roadmaps" webview views (LearningOS activity bar).
//
// NewsViewProvider   — reads the bundled curated feed catalog (content/data/
//                      news-feeds.json), fetches feeds in the EXTENSION HOST (never
//                      the webview) via the SSRF-guarded feed client, and streams a
//                      merged, newest-first, categorized headline list to the view.
// RoadmapsViewProvider — reads content/data/roadmaps.json (a link-out catalog of
//                      roadmap.sh learning paths) and renders it grouped by type.
//
// Both views hand every "learn / summarize / start" action to @drona so news and
// roadmaps become active learning, not passive reading. Links open externally only
// after an https/http check. Webviews run a strict CSP + per-render nonce; the only
// script is our own inline block, and the webview itself makes no network requests.

import * as vscode from "vscode";
import { contentUri } from "./catalog";
import { FeedCatalog, FeedSource, NewsItem, loadFeedCatalog, fetchMany } from "./feeds";

function getNonce(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < 32; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}

/** JSON safe to embed inside a <script> tag. */
function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

function openExternalSafe(url: unknown): void {
  if (typeof url !== "string") {
    return;
  }
  try {
    const u = new URL(url);
    if (u.protocol === "https:" || u.protocol === "http:") {
      void vscode.env.openExternal(vscode.Uri.parse(u.toString()));
    }
  } catch {
    /* ignore malformed */
  }
}

function askDrona(query: string): void {
  void vscode.commands.executeCommand("workbench.action.chat.open", { query });
}

// ---------------------------------------------------------------------------
// Tech News
// ---------------------------------------------------------------------------

export class NewsViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "learningos.news";
  private view?: vscode.WebviewView;
  private busy = false;

  constructor(private readonly context: vscode.ExtensionContext) {}

  public resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;
    webviewView.webview.options = { enableScripts: true, localResourceRoots: [this.context.extensionUri] };
    webviewView.webview.html = this.renderHtml(webviewView.webview);
    webviewView.webview.onDidReceiveMessage((msg) => this.handleMessage(msg));
    void this.postCatalog();
  }

  public focusAndRefresh(): void {
    void vscode.commands.executeCommand("learningos.news.focus");
    void this.postCatalog();
  }

  /** Push the category list so the webview can render its filter, then auto-load top picks. */
  private async postCatalog(): Promise<void> {
    const catalog = await loadFeedCatalog(this.context);
    if (!catalog) {
      this.view?.webview.postMessage({ type: "error", message: "Feed catalog not found. Re-package the extension to bundle data/news-feeds.json." });
      return;
    }
    const cats = Object.entries(catalog.categories || {}).map(([id, meta]) => ({ id, label: meta.label }));
    this.view?.webview.postMessage({ type: "catalog", categories: cats, updated: catalog.updated, count: catalog.feeds.length });
    void this.load("__top", catalog);
  }

  /** Select the feed sources for a category id ("__top" = 2 per category, text sources only). */
  private selectSources(catalog: FeedCatalog, category: string): FeedSource[] {
    if (category && category !== "__top" && category !== "all") {
      return catalog.feeds.filter((f) => f.category === category);
    }
    if (category === "all") {
      return catalog.feeds.filter((f) => f.type === "rss" || f.type === "atom");
    }
    // Top picks: up to 2 text feeds from each category for a fast, broad default.
    const perCat: Record<string, number> = {};
    const picks: FeedSource[] = [];
    for (const f of catalog.feeds) {
      if (f.type !== "rss" && f.type !== "atom") {
        continue;
      }
      perCat[f.category] = (perCat[f.category] || 0) + 1;
      if (perCat[f.category] <= 2) {
        picks.push(f);
      }
    }
    return picks;
  }

  private async load(category: string, preloaded?: FeedCatalog): Promise<void> {
    if (this.busy) {
      return;
    }
    this.busy = true;
    this.view?.webview.postMessage({ type: "loading" });
    try {
      const catalog = preloaded ?? (await loadFeedCatalog(this.context));
      if (!catalog) {
        throw new Error("catalog missing");
      }
      const sources = this.selectSources(catalog, category);
      const items = await fetchMany(sources, { perFeed: category === "__top" ? 4 : 6, total: 70, concurrency: 6 });
      this.view?.webview.postMessage({ type: "items", items, category, fetched: sources.length });
    } catch (e) {
      this.view?.webview.postMessage({ type: "error", message: e instanceof Error ? e.message : String(e) });
    } finally {
      this.busy = false;
    }
  }

  private handleMessage(msg: unknown): void {
    const m = (msg ?? {}) as { type?: string; category?: string; url?: string; title?: string; source?: string };
    switch (m.type) {
      case "refresh":
        void this.load(typeof m.category === "string" ? m.category : "__top");
        break;
      case "open":
        openExternalSafe(m.url);
        break;
      case "learn":
        askDrona(
          `@drona Read this article with your fetch tool and teach me its key idea from first principles, with why it matters and one takeaway I can apply. Title: "${m.title}". URL: ${m.url}. Source: ${m.source ?? ""}.`
        );
        break;
      case "digest":
        askDrona(
          "@drona /learn Give me today's tech-news digest: use your fetch tool on 4-6 of the most important recent items from my curated feeds, cluster them by theme, and summarize each with why it matters and a source link + date."
        );
        break;
      default:
        break;
    }
  }

  private renderHtml(webview: vscode.Webview): string {
    const nonce = getNonce();
    const csp = [
      "default-src 'none'",
      `img-src ${webview.cspSource} https: data:`,
      `style-src ${webview.cspSource} 'nonce-${nonce}'`,
      `script-src 'nonce-${nonce}'`,
    ].join("; ");
    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/>
<meta http-equiv="Content-Security-Policy" content="${csp}"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style nonce="${nonce}">
  :root{color-scheme:light dark}
  body{font-family:var(--vscode-font-family);font-size:13px;color:var(--vscode-foreground);padding:8px 10px}
  h2{font-size:13px;margin:0 0 6px;text-transform:uppercase;letter-spacing:.06em;opacity:.8}
  .bar{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:8px}
  select,button{font-family:inherit;font-size:12px;color:var(--vscode-foreground);background:var(--vscode-button-secondaryBackground,transparent);border:1px solid var(--vscode-panel-border,#8884);border-radius:6px;padding:3px 8px;cursor:pointer}
  button.primary{background:var(--vscode-button-background);color:var(--vscode-button-foreground);border:none}
  button:hover{filter:brightness(1.1)}
  .muted{opacity:.65;font-size:11px}
  ul{list-style:none;margin:0;padding:0}
  li{padding:7px 0;border-bottom:1px solid var(--vscode-panel-border,#8883)}
  .t{font-weight:600;cursor:pointer;line-height:1.3}
  .t:hover{text-decoration:underline;color:var(--vscode-textLink-foreground)}
  .meta{display:flex;gap:8px;align-items:center;margin-top:3px;flex-wrap:wrap}
  .src{color:var(--vscode-textLink-foreground);font-size:11px}
  .date{font-size:11px;opacity:.6}
  .tag{font-size:10px;opacity:.7;border:1px solid var(--vscode-panel-border,#8884);border-radius:999px;padding:0 6px}
  .learn{font-size:11px;background:none;border:none;color:var(--vscode-textLink-foreground);cursor:pointer;padding:0}
  .learn:hover{text-decoration:underline}
  .empty{opacity:.7;padding:14px 0}
  .spin{opacity:.7;padding:14px 0}
</style></head>
<body>
  <div class="bar">
    <select id="cat" title="Feed category"></select>
    <button id="refresh" class="primary" title="Fetch latest">↻ Refresh</button>
    <button id="digest" title="Ask Drona for a clustered digest">✨ Digest</button>
  </div>
  <div id="status" class="muted"></div>
  <ul id="list"></ul>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const $ = (id) => document.getElementById(id);
    const list = $("list"), status = $("status"), cat = $("cat");
    let current = "__top";

    function esc(s){const d=document.createElement("div");d.textContent=s==null?"":String(s);return d.innerHTML.replace(/"/g,"&quot;");}
    function rel(iso){ if(!iso) return ""; const t=Date.parse(iso); if(isNaN(t)) return "";
      const s=Math.floor((Date.now()-t)/1000); if(s<3600) return Math.max(1,Math.floor(s/60))+"m ago";
      if(s<86400) return Math.floor(s/3600)+"h ago"; const d=Math.floor(s/86400);
      return d<30? d+"d ago" : new Date(t).toISOString().slice(0,10); }

    window.addEventListener("message",(e)=>{
      const m=e.data||{};
      if(m.type==="catalog"){
        const opts=[{id:"__top",label:"★ Top picks"},{id:"all",label:"All feeds (slow)"}].concat(m.categories||[]);
        cat.innerHTML=opts.map(o=>'<option value="'+esc(o.id)+'">'+esc(o.label)+"</option>").join("");
        cat.value=current;
        status.textContent=(m.count||0)+" curated feeds · updated "+esc(m.updated||"");
      } else if(m.type==="loading"){
        list.innerHTML='<li class="spin">Fetching the latest headlines…</li>';
      } else if(m.type==="error"){
        list.innerHTML='<li class="empty">⚠ '+esc(m.message||"Could not load feeds.")+"</li>";
      } else if(m.type==="items"){
        current=m.category||current; cat.value=current;
        const items=m.items||[];
        status.textContent=items.length+" items from "+(m.fetched||0)+" feeds";
        if(!items.length){ list.innerHTML='<li class="empty">No items right now — try Refresh or another category.</li>'; return; }
        list.innerHTML=items.map((it,i)=>{
          const tags=(it.topics||[]).slice(0,2).map(t=>'<span class="tag">'+esc(t)+"</span>").join("");
          return '<li>'+
            '<div class="t" data-open="'+i+'">'+esc(it.title)+"</div>"+
            '<div class="meta"><span class="src" data-open="'+i+'">'+esc(it.source)+"</span>"+
            (rel(it.isoDate)?'<span class="date">'+esc(rel(it.isoDate))+"</span>":"")+tags+
            '<button class="learn" data-learn="'+i+'">🎓 Learn with Drona</button></div></li>';
        }).join("");
        list._items=items;
      }
    });

    list.addEventListener("click",(e)=>{
      const t=e.target;
      const oi=t.getAttribute&&t.getAttribute("data-open");
      const li=t.getAttribute&&t.getAttribute("data-learn");
      const items=list._items||[];
      if(oi!==null&&oi!==undefined&&items[oi]) vscode.postMessage({type:"open",url:items[oi].link});
      else if(li!==null&&li!==undefined&&items[li]) vscode.postMessage({type:"learn",title:items[li].title,url:items[li].link,source:items[li].source});
    });
    $("refresh").addEventListener("click",()=>vscode.postMessage({type:"refresh",category:cat.value}));
    $("digest").addEventListener("click",()=>vscode.postMessage({type:"digest"}));
    cat.addEventListener("change",()=>vscode.postMessage({type:"refresh",category:cat.value}));
  </script>
</body></html>`;
  }
}

// ---------------------------------------------------------------------------
// Roadmaps (roadmap.sh link-out catalog)
// ---------------------------------------------------------------------------

interface Roadmap {
  title: string;
  slug: string;
  url: string;
  type: string;
  description?: string;
}
interface RoadmapCatalog {
  updated?: string;
  attribution?: string;
  roadmaps: Roadmap[];
}

export class RoadmapsViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "learningos.roadmaps";
  private view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext) {}

  public resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;
    webviewView.webview.options = { enableScripts: true, localResourceRoots: [this.context.extensionUri] };
    webviewView.webview.html = this.renderHtml(webviewView.webview);
    webviewView.webview.onDidReceiveMessage((msg) => this.handleMessage(msg));
    void this.post();
  }

  private async post(): Promise<void> {
    try {
      const bytes = await vscode.workspace.fs.readFile(contentUri(this.context, "data", "roadmaps.json"));
      const cat = JSON.parse(Buffer.from(bytes).toString("utf8")) as RoadmapCatalog;
      this.view?.webview.postMessage({ type: "roadmaps", roadmaps: cat.roadmaps || [], attribution: cat.attribution || "" });
    } catch {
      this.view?.webview.postMessage({ type: "error", message: "Roadmap catalog not found." });
    }
  }

  private handleMessage(msg: unknown): void {
    const m = (msg ?? {}) as { type?: string; url?: string; title?: string };
    switch (m.type) {
      case "open":
        openExternalSafe(m.url);
        break;
      case "plan":
        askDrona(
          `@drona /plan Build me a dated, personalized study plan to learn "${m.title}". Base it on the structure of the roadmap.sh "${m.title}" roadmap (${m.url}), adapt it to my level and goal, and for each stage suggest a hands-on exercise and how I'll know I've mastered it.`
        );
        break;
      default:
        break;
    }
  }

  private renderHtml(webview: vscode.Webview): string {
    const nonce = getNonce();
    const csp = [
      "default-src 'none'",
      `style-src ${webview.cspSource} 'nonce-${nonce}'`,
      `script-src 'nonce-${nonce}'`,
    ].join("; ");
    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/>
<meta http-equiv="Content-Security-Policy" content="${csp}"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style nonce="${nonce}">
  body{font-family:var(--vscode-font-family);font-size:13px;color:var(--vscode-foreground);padding:8px 10px}
  .bar{display:flex;gap:6px;margin-bottom:8px}
  input{flex:1;font-family:inherit;font-size:12px;color:var(--vscode-input-foreground);background:var(--vscode-input-background);border:1px solid var(--vscode-input-border,#8884);border-radius:6px;padding:4px 8px}
  h3{font-size:11px;text-transform:uppercase;letter-spacing:.06em;opacity:.7;margin:12px 0 4px}
  ul{list-style:none;margin:0;padding:0}
  li{padding:6px 0;border-bottom:1px solid var(--vscode-panel-border,#8883)}
  .t{font-weight:600;cursor:pointer}
  .t:hover{text-decoration:underline;color:var(--vscode-textLink-foreground)}
  .d{font-size:11px;opacity:.7;margin-top:2px}
  .act{margin-top:3px}
  .plan{font-size:11px;background:none;border:none;color:var(--vscode-textLink-foreground);cursor:pointer;padding:0}
  .plan:hover{text-decoration:underline}
  .muted{opacity:.6;font-size:11px;margin-top:10px}
</style></head>
<body>
  <div class="bar"><input id="q" placeholder="Filter roadmaps… (e.g. devops, python, ai)"/></div>
  <div id="wrap"><div class="muted">Loading roadmaps…</div></div>
  <div id="attr" class="muted"></div>
  <script nonce="${nonce}">
    const vscode=acquireVsCodeApi();
    const wrap=document.getElementById("wrap"), q=document.getElementById("q"), attr=document.getElementById("attr");
    let all=[];
    const LABEL={"role-based":"Role-based paths","skill-based":"Skill-based paths","best-practices":"Best practices","project-ideas":"Project ideas"};
    function esc(s){const d=document.createElement("div");d.textContent=s==null?"":String(s);return d.innerHTML.replace(/"/g,"&quot;");}
    function render(){
      const term=(q.value||"").toLowerCase().trim();
      const items=all.filter(r=>!term|| (r.title+" "+(r.description||"")+" "+r.slug).toLowerCase().includes(term));
      if(!items.length){wrap.innerHTML='<div class="muted">No roadmaps match “'+esc(term)+'”.</div>';return;}
      const groups={};
      for(const r of items)(groups[r.type]||(groups[r.type]=[])).push(r);
      const order=["role-based","skill-based","best-practices","project-ideas"];
      const types=order.filter(t=>groups[t]).concat(Object.keys(groups).filter(t=>!order.includes(t)));
      wrap.innerHTML=types.map(tp=>{
        const rows=groups[tp].map((r)=>{
          const gi=all.indexOf(r);
          return '<li><div class="t" data-open="'+gi+'">'+esc(r.title)+'</div>'+
            (r.description?'<div class="d">'+esc(r.description)+'</div>':'')+
            '<div class="act"><button class="plan" data-plan="'+gi+'">📅 Start with Drona</button></div></li>';
        }).join("");
        return '<h3>'+esc(LABEL[tp]||tp)+' ('+groups[tp].length+')</h3><ul>'+rows+'</ul>';
      }).join("");
    }
    window.addEventListener("message",(e)=>{
      const m=e.data||{};
      if(m.type==="roadmaps"){all=m.roadmaps||[];attr.textContent=m.attribution||"";render();}
      else if(m.type==="error"){wrap.innerHTML='<div class="muted">⚠ '+esc(m.message||"")+'</div>';}
    });
    wrap.addEventListener("click",(e)=>{
      const t=e.target;
      const oi=t.getAttribute&&t.getAttribute("data-open");
      const pi=t.getAttribute&&t.getAttribute("data-plan");
      if(oi!==null&&oi!==undefined&&all[oi]) vscode.postMessage({type:"open",url:all[oi].url});
      else if(pi!==null&&pi!==undefined&&all[pi]) vscode.postMessage({type:"plan",title:all[pi].title,url:all[pi].url});
    });
    q.addEventListener("input",render);
  </script>
</body></html>`;
  }
}
