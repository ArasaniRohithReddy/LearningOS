// The "LearningOS" dashboard — a WebviewView shown in a dedicated Activity Bar
// container. It renders a rich set of learning metrics from the persisted data:
// an objective/goal panel, streak & momentum, an activity-over-time chart, topics
// by area, commands & tools used, languages practiced, reviews due, and recent
// history. All charts are built in the webview from globalState data as inline SVG
// / CSS bars, so the whole view works fully offline (no CDN, no remote fonts).
//
// PLUS: an optional "Render with Flint-Chart" toggle. Clicking it renders the
// activity chart with the Flint-Chart MCP *locally*: the extension host self-spawns
// the `flint-chart-mcp` server and drives it over stdio JSON-RPC (see
// src/flintClient.ts) with a chart spec built from the SAME data, gets back an SVG,
// and posts a sanitized data: URI to the webview to display in an <img>. If a Flint
// render tool also happens to be registered in `vscode.lm.tools`, it's used as a
// best-effort secondary fallback. Any failure keeps the built-in offline charts and
// shows a hint — the dashboard never hangs and never breaks offline.
//
// Security: scripts are enabled but locked down with a strict CSP + per-render
// nonce. The only script that can run is our own inline block. Flint output is
// only ever shown as an <img src="data:…"> (an image context cannot execute
// scripts), which is why img-src allows the data: scheme.

import * as vscode from "vscode";
import { dayKey, getData, LearningData } from "./store";
import { renderChartSvg, type FlintChartSpec } from "./flintClient";

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

export class DashboardViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "learningos.dashboard";

  private view?: vscode.WebviewView;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly onDidChangeData: vscode.Event<void>
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri],
    };
    webviewView.webview.html = this.renderHtml(webviewView.webview);
    webviewView.webview.onDidReceiveMessage((msg) => this.handleMessage(msg));

    // Re-push data whenever it changes (after each @drona turn).
    const sub = this.onDidChangeData(() => this.postData());
    webviewView.onDidDispose(() => sub.dispose());
  }

  /** Push fresh data to a live webview without a full reload. */
  private postData(): void {
    this.view?.webview.postMessage({ type: "data", data: getData(this.context) });
  }

  /** Public refresh entry point (used by the Refresh button and commands). */
  public refresh(): void {
    this.postData();
  }

  private handleMessage(msg: unknown): void {
    const m = (msg ?? {}) as { type?: string; chart?: string; topic?: string };
    switch (m.type) {
      case "onboard":
        void vscode.commands.executeCommand("workbench.action.chat.open", {
          query:
            "@drona I'm setting up my learning profile. Ask me my goal, current level, and tech stack, then save a plan.",
        });
        break;
      case "resume":
        void vscode.commands.executeCommand("workbench.action.chat.open", { query: "@drona /resume" });
        break;
      case "openProfile":
        void vscode.commands.executeCommand("learningos.showProgress");
        break;
      case "setupCharts":
        void vscode.commands.executeCommand("learningos.setup");
        break;
      case "review": {
        const topic = typeof m.topic === "string" && m.topic.trim() ? m.topic.trim() : "my recent topics";
        void vscode.commands.executeCommand("workbench.action.chat.open", {
          query: `@drona /learn Quick spaced-repetition review with a few quiz questions on: ${topic}`,
        });
        break;
      }
      case "flint":
        void this.renderFlint(typeof m.chart === "string" ? m.chart : "activity");
        break;
      case "refresh":
        this.postData();
        break;
      default:
        break;
    }
  }

  /**
   * Render one dashboard chart and post the resulting image back to the webview.
   *
   * PRIMARY path: self-spawn the Flint-Chart MCP (`flint-chart-mcp`) and drive it over
   * stdio JSON-RPC (see src/flintClient.ts). It returns the chart as an SVG string; we
   * base64 it into a `data:` URI shown in the <img> (a data: image can't run scripts,
   * and `img-src … data:` is already allowed by the CSP — we never inject raw SVG).
   *
   * SECONDARY fallback: only if the self-spawn fails AND a Flint render tool happens to
   * be registered in `vscode.lm.tools`, try `vscode.lm.invokeTool` (raced against a real
   * timeout, since a webview-context tool call can await a confirmation that never
   * surfaces). On any failure we post a helpful message and the built-in offline chart
   * stays — the dashboard never hangs and never breaks offline.
   */
  private async renderFlint(chart: string): Promise<void> {
    const post = (payload: Record<string, unknown>): void => {
      void this.view?.webview.postMessage({ type: "flintResult", chart, ...payload });
    };

    const data = getData(this.context);
    const built = buildSelfSpawnChart(chart, data);
    if (!built) {
      post({ ok: false, message: "Not enough activity yet to render that chart with flint-chart-mcp." });
      return;
    }

    // --- PRIMARY: render locally with flint-chart-mcp (bundled offline copy, then npx). ---
    const cfg = vscode.workspace.getConfiguration("learningos.flintChart");
    // `?? "npx"` (not `|| "npx"`) so an explicitly-empty command means "bundled only".
    const command = (cfg.get<string>("command", "npx") ?? "npx").trim();
    const argsSetting = cfg.get<string[]>("args", ["-y", "flint-chart-mcp"]);
    let timeoutMs = cfg.get<number>("timeoutMs", 35_000);
    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
      timeoutMs = 35_000;
    }

    try {
      const rendered = await renderChartSvg(built.rows, built.chartSpec, {
        command,
        args: Array.isArray(argsSetting) && argsSetting.length ? argsSetting : undefined,
        timeoutMs,
        extensionPath: this.context.extensionUri.fsPath,
      });
      const dataUri = `data:image/svg+xml;base64,${Buffer.from(rendered.svg, "utf8").toString("base64")}`;
      post({ ok: true, dataUri, tool: `flint-chart-mcp (${rendered.via})` });
      return;
    } catch (primaryErr) {
      const primaryReason = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
      // --- SECONDARY: best-effort fall back to an installed Flint LM tool, if any. ---
      const secondary = await this.renderFlintViaLmTool(chart, data);
      if (secondary) {
        post(secondary);
        return;
      }
      post({
        ok: false,
        message:
          `flint-chart-mcp couldn't render: ${primaryReason} ` +
          "The built-in charts still work offline. The extension ships a bundled flint engine; if it can't run, " +
          "ensure the extension installed fully, or point learningos.flintChart.command/args at another launcher.",
      });
    }
  }

  /**
   * Secondary, best-effort render via an installed Flint LM tool (`vscode.lm.invokeTool`),
   * raced against a real timeout because a webview-context tool invocation may await a
   * confirmation that never appears. Returns a postable success payload, or undefined so
   * the caller falls back to a helpful message + the built-in chart.
   */
  private async renderFlintViaLmTool(
    chart: string,
    data: LearningData
  ): Promise<{ ok: true; dataUri: string; tool: string } | undefined> {
    const tool = findFlintRenderTool();
    if (!tool) {
      return undefined;
    }
    const spec = buildFlintSpec(chart, data);
    if (!spec) {
      return undefined;
    }
    const cts = new vscode.CancellationTokenSource();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const result = await Promise.race([
        vscode.lm.invokeTool(tool.name, { input: spec, toolInvocationToken: undefined }, cts.token),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => {
            cts.cancel(); // best-effort cooperative cancel
            reject(new Error("__FLINT_TIMEOUT__"));
          }, 20_000);
        }),
      ]);
      const image = extractImageFromToolResult(result);
      if (!image) {
        return undefined;
      }
      const dataUri = image.svg
        ? `data:image/svg+xml;base64,${Buffer.from(image.svg, "utf8").toString("base64")}`
        : (image.dataUri as string);
      return { ok: true, dataUri, tool: tool.name };
    } catch {
      return undefined;
    } finally {
      if (timer) {
        clearTimeout(timer);
      }
      cts.dispose();
    }
  }

  private renderHtml(webview: vscode.Webview): string {
    const nonce = getNonce();
    const data: LearningData = getData(this.context);
    const csp = [
      "default-src 'none'",
      `img-src ${webview.cspSource} data:`,
      `style-src ${webview.cspSource} 'unsafe-inline'`,
      `script-src 'nonce-${nonce}'`,
    ].join("; ");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LearningOS</title>
  <style>
    :root { color-scheme: light dark; }
    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size, 13px);
      color: var(--vscode-foreground);
      padding: 10px 12px 24px;
    }
    h2 { font-size: 12px; text-transform: uppercase; letter-spacing: .04em; opacity: .8; margin: 18px 0 8px; }
    h1 { font-size: 15px; margin: 2px 0 10px; }
    .card {
      background: var(--vscode-editorWidget-background, rgba(127,127,127,.08));
      border: 1px solid var(--vscode-widget-border, transparent);
      border-radius: 6px; padding: 10px 12px; margin-bottom: 6px;
    }
    .muted { opacity: .7; }
    .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .stats3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .stat { background: var(--vscode-editorWidget-background, rgba(127,127,127,.08));
      border: 1px solid var(--vscode-widget-border, transparent); border-radius: 6px; padding: 8px 10px; }
    .stat .n { font-size: 19px; font-weight: 600; }
    .stat .l { font-size: 11px; opacity: .75; }
    .row { display: flex; align-items: center; gap: 8px; margin: 5px 0; }
    .bar { height: 8px; border-radius: 4px; background: var(--vscode-progressBar-background, #3794ff); }
    .bar-track { flex: 1; height: 8px; border-radius: 4px; background: var(--vscode-input-background, rgba(127,127,127,.18)); overflow: hidden; }
    .label { width: 42%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
    .count { width: 30px; text-align: right; font-variant-numeric: tabular-nums; opacity: .75; font-size: 12px; }
    .due { font-variant-numeric: tabular-nums; font-size: 12px; opacity: .75; }
    ul.hist { list-style: none; padding: 0; margin: 0; }
    ul.hist li { padding: 6px 0; border-bottom: 1px solid var(--vscode-widget-border, rgba(127,127,127,.15)); }
    ul.hist li:last-child { border-bottom: none; }
    .hist .top { font-weight: 600; font-size: 12px; }
    .hist .meta { font-size: 11px; opacity: .7; }
    .hist .sum { font-size: 12px; opacity: .9; }
    .btns { display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0 4px; }
    button {
      font-family: inherit; font-size: 12px; cursor: pointer;
      color: var(--vscode-button-foreground); background: var(--vscode-button-background);
      border: none; border-radius: 4px; padding: 5px 10px;
    }
    button:hover { background: var(--vscode-button-hoverBackground); }
    button.secondary { color: var(--vscode-button-secondaryForeground); background: var(--vscode-button-secondaryBackground); }
    button.secondary:hover { background: var(--vscode-button-secondaryHoverBackground); }
    button:disabled { opacity: .5; cursor: default; }
    button.linkish { background: transparent; color: var(--vscode-textLink-foreground); border: none; padding: 0; text-decoration: underline; }
    button.linkish:hover { background: transparent; color: var(--vscode-textLink-activeForeground, var(--vscode-textLink-foreground)); }
    svg { display: block; width: 100%; height: auto; }
    /* SVG presentation attributes don't resolve CSS var(); set chart colors via CSS
       so bars and the baseline are themable and visible on dark themes. */
    #chart rect { fill: var(--vscode-progressBar-background, #3794ff); }
    #chart line { stroke: var(--vscode-widget-border, rgba(127,127,127,.4)); }
    .chart-cap { display:flex; justify-content: space-between; align-items: center; font-size: 11px; opacity: .7; margin-top: 4px; }
    .empty { font-style: italic; opacity: .7; font-size: 12px; }
    .flint-wrap { margin-top: 10px; }
    #flint-status { font-size: 12px; margin-top: 8px; padding: 8px 10px; border-radius: 6px;
      background: var(--vscode-inputValidation-infoBackground, rgba(100,150,255,.10));
      border: 1px solid var(--vscode-inputValidation-infoBorder, var(--vscode-widget-border, transparent)); }
    #flint-img { width: 100%; height: auto; border-radius: 6px; background: #ffffff; margin-top: 8px; }
    [hidden] { display: none !important; }
  </style>
</head>
<body>
  <h1>🎓 LearningOS</h1>
  <div class="btns">
    <button id="btn-onboard">Onboard</button>
    <button id="btn-resume" class="secondary">Resume</button>
    <button id="btn-refresh" class="secondary">Refresh</button>
    <button id="btn-profile" class="secondary">Open profile.md</button>
  </div>

  <h2>Objective</h2>
  <div id="profile" class="card"></div>

  <h2>Streak &amp; momentum</h2>
  <div id="momentum" class="stats3"></div>

  <h2>Activity (last 30 days)</h2>
  <div class="card">
    <div id="chart"></div>
    <div class="chart-cap"><span id="chart-from"></span><span id="chart-to">today</span></div>
    <div class="flint-wrap">
      <button id="btn-flint" class="secondary">✨ Render with Flint-Chart (local)</button>
      <div id="flint-status" hidden></div>
      <div id="flint-out" hidden>
        <img id="flint-img" alt="Activity chart rendered locally by flint-chart-mcp" />
        <div class="chart-cap"><span id="flint-cap">Rendered locally by flint-chart-mcp</span><button id="btn-flint-hide" class="linkish">Show built-in chart</button></div>
      </div>
    </div>
  </div>

  <h2>Topics by area</h2>
  <div id="topics" class="card"></div>

  <h2>Commands &amp; tools used</h2>
  <div id="commands" class="card"></div>

  <h2>Languages practiced</h2>
  <div id="languages" class="card"></div>

  <h2>Reviews due</h2>
  <div id="reviews" class="card"></div>

  <h2>Recent history</h2>
  <div class="card"><ul id="history" class="hist"></ul></div>

  <script nonce="${nonce}">
    const vscodeApi = acquireVsCodeApi();
    const INITIAL = ${safeJson(data)};

    const CMD_LABELS = {
      learn: "/learn", plan: "/plan", interview: "/interview", resume: "/resume",
      charts: "/charts", chat: "Chat (no command)", "run-code": "Run code", fetch: "Fetch page"
    };

    function esc(s) {
      return String(s == null ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
    function dayKey(d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return y + "-" + m + "-" + day;
    }
    function lastNDays(n) {
      const out = [];
      const today = new Date();
      for (let i = n - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        out.push(dayKey(d));
      }
      return out;
    }
    function sortedEntries(obj, limit) {
      const entries = Object.keys(obj || {}).map(function (k) { return [k, obj[k]]; });
      entries.sort(function (a, b) { return b[1] - a[1]; });
      return typeof limit === "number" ? entries.slice(0, limit) : entries;
    }

    function renderProfile(p) {
      const el = document.getElementById("profile");
      const has = p && (p.goal || p.level || (p.stack && p.stack.length) || p.name || p.nextStep);
      if (!has) {
        el.innerHTML = '<div class="empty">No objective yet. Click <b>Onboard</b> and Drona will help you set a goal, level and stack.</div>';
        return;
      }
      const stack = p.stack && p.stack.length ? esc(p.stack.join(", ")) : '<span class="muted">not set</span>';
      el.innerHTML =
        (p.name ? '<div class="row"><b>Name:</b>&nbsp;' + esc(p.name) + '</div>' : '') +
        '<div class="row"><b>Goal:</b>&nbsp;' + (p.goal ? esc(p.goal) : '<span class="muted">not set</span>') + '</div>' +
        '<div class="row"><b>Level:</b>&nbsp;' + (p.level ? esc(p.level) : '<span class="muted">not set</span>') + '</div>' +
        '<div class="row"><b>Stack:</b>&nbsp;' + stack + '</div>' +
        (p.nextStep ? '<div class="row"><b>Next step:</b>&nbsp;' + esc(p.nextStep) + '</div>' : '');
    }

    function renderMomentum(prog) {
      const el = document.getElementById("momentum");
      const activeDays = Object.keys((prog && prog.perDay) || {}).length;
      const cells = [
        [prog.streakDays || 0, "current streak (days)"],
        [prog.longestStreak || 0, "longest streak"],
        [prog.totalSessions || 0, "total sessions"],
        [activeDays, "active days (30d)"],
        [prog.distinctTopics || 0, "distinct topics"],
        [prog.lastActive || "—", "last active"],
      ];
      el.innerHTML = cells.map(function (c) {
        return '<div class="stat"><div class="n">' + esc(c[0]) + '</div><div class="l">' + esc(c[1]) + '</div></div>';
      }).join("");
    }

    function renderChart(perDay) {
      const days = lastNDays(30);
      const counts = days.map(function (d) { return (perDay && perDay[d]) || 0; });
      const max = Math.max(1, Math.max.apply(null, counts));
      const W = 320, H = 100, pad = 4;
      const n = days.length;
      const bw = (W - pad * 2) / n;
      const barW = Math.max(3, bw - 2);
      let bars = "";
      for (let i = 0; i < n; i++) {
        const h = counts[i] === 0 ? 2 : Math.round((counts[i] / max) * (H - 24));
        const x = pad + i * bw + (bw - barW) / 2;
        const y = H - 16 - h;
        const op = counts[i] === 0 ? 0.25 : 1;
        // Fill color comes from the #chart rect CSS rule (var() isn't honored in
        // SVG presentation attributes); fill-opacity is a plain number so it's fine.
        bars += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW.toFixed(1) +
          '" height="' + h + '" rx="1.5" fill-opacity="' + op + '">' +
          '<title>' + esc(days[i]) + ': ' + counts[i] + '</title></rect>';
      }
      // Stroke color comes from the #chart line CSS rule.
      const baseline = '<line x1="' + pad + '" y1="' + (H - 15) + '" x2="' + (W - pad) + '" y2="' + (H - 15) +
        '" stroke-width="1"/>';
      document.getElementById("chart").innerHTML =
        '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Daily activity for the last 30 days">' +
        baseline + bars + '</svg>';
      document.getElementById("chart-from").textContent = days[0];
      const total = counts.reduce(function (a, b) { return a + b; }, 0);
      document.getElementById("chart-to").textContent = "today · " + total + " turns · peak " + max + "/day";
    }

    function renderBars(containerId, entries, emptyMsg, labelFn) {
      const el = document.getElementById(containerId);
      if (!entries || !entries.length) {
        el.innerHTML = '<div class="empty">' + emptyMsg + '</div>';
        return;
      }
      const max = Math.max.apply(null, entries.map(function (e) { return e[1]; }));
      el.innerHTML = entries.map(function (e) {
        const label = labelFn ? labelFn(e[0]) : e[0];
        const pct = max > 0 ? Math.round((e[1] / max) * 100) : 0;
        return '<div class="row"><span class="label" title="' + esc(label) + '">' + esc(label) + '</span>' +
          '<span class="bar-track"><span class="bar" style="width:' + pct + '%"></span></span>' +
          '<span class="count">' + e[1] + '</span></div>';
      }).join("");
    }

    function renderTopics(topics) {
      renderBars("topics", sortedEntries(topics, 8),
        "No topics yet — ask <b>@drona</b> to teach you something.");
    }

    function renderCommands(commandCounts) {
      renderBars("commands", sortedEntries(commandCounts, 10),
        "No commands used yet — try <b>@drona /learn</b>, <b>#run</b> or <b>#fetch</b>.",
        function (k) { return CMD_LABELS[k] || k; });
    }

    function renderLanguages(languageRuns) {
      renderBars("languages", sortedEntries(languageRuns, 12),
        "No code run yet — ask <b>@drona</b> to run a snippet (uses <b>#run</b>).");
    }

    function renderReviews(history) {
      const el = document.getElementById("reviews");
      const last = {};
      (history || []).forEach(function (h) {
        if (!h || !h.topic) { return; }
        const t = h.topic;
        const d = new Date(h.ts).getTime();
        if (!isNaN(d) && (!(t in last) || d > last[t])) { last[t] = d; }
      });
      const topics = Object.keys(last);
      if (!topics.length) {
        el.innerHTML = '<div class="empty">No topics studied yet — nothing to review.</div>';
        return;
      }
      const now = Date.now();
      const DAY = 86400000;
      const due = topics
        .map(function (t) { return { t: t, days: Math.floor((now - last[t]) / DAY) }; })
        .filter(function (x) { return x.days >= 3; })
        .sort(function (a, b) { return b.days - a.days; })
        .slice(0, 6);
      if (!due.length) {
        el.innerHTML = '<div class="empty">✅ You\\'re all caught up — no topics are due for review.</div>';
        return;
      }
      el.innerHTML = due.map(function (x) {
        return '<div class="row"><span class="label" title="' + esc(x.t) + '">' + esc(x.t) + '</span>' +
          '<span class="due">' + x.days + 'd ago</span></div>';
      }).join("") + '<div class="btns"><button id="btn-review">Review the most overdue</button></div>';
      const b = document.getElementById("btn-review");
      if (b) {
        b.addEventListener("click", function () { vscodeApi.postMessage({ type: "review", topic: due[0].t }); });
      }
    }

    function localDay(ts) {
      if (!ts) { return ""; }
      const d = new Date(ts);
      return isNaN(d.getTime()) ? String(ts).slice(0, 10) : dayKey(d);
    }

    function renderHistory(history) {
      const el = document.getElementById("history");
      const items = (history || []).slice(-10).reverse();
      if (!items.length) {
        el.innerHTML = '<li class="empty">No activity recorded yet.</li>';
        return;
      }
      el.innerHTML = items.map(function (h) {
        const when = localDay(h.ts);
        const cmd = h.command ? '/' + esc(h.command) + ' ' : '';
        return '<li><div class="top">' + esc(h.topic || "Session") + '</div>' +
          '<div class="meta">' + esc(when) + ' · ' + cmd + '</div>' +
          '<div class="sum">' + esc(h.summary || "") + '</div></li>';
      }).join("");
    }

    // --- Flint-Chart toggle -------------------------------------------------
    const btnFlint = document.getElementById("btn-flint");
    function setFlintStatus(text) {
      const el = document.getElementById("flint-status");
      if (!text) { el.hidden = true; el.innerHTML = ""; return; }
      el.hidden = false;
      el.innerHTML = text;
    }
    function showBuiltinChart() {
      document.getElementById("flint-out").hidden = true;
      document.getElementById("chart").hidden = false;
    }
    btnFlint.addEventListener("click", function () {
      btnFlint.disabled = true;
      showBuiltinChart();
      setFlintStatus("Rendering locally with flint-chart-mcp… (first render downloads it via npx)");
      vscodeApi.postMessage({ type: "flint", chart: "activity" });
    });
    document.getElementById("btn-flint-hide").addEventListener("click", showBuiltinChart);

    function onFlintResult(m) {
      btnFlint.disabled = false;
      if (m && m.ok && m.dataUri) {
        setFlintStatus("");
        const img = document.getElementById("flint-img");
        img.src = m.dataUri; // data: URI only — allowed by CSP img-src, no scripts run
        document.getElementById("flint-cap").textContent = "Rendered locally by " + (m.tool ? m.tool : "flint-chart-mcp");
        document.getElementById("flint-out").hidden = false;
        document.getElementById("chart").hidden = true; // replace built-in with the flint render
        return;
      }
      showBuiltinChart();
      let html = esc((m && m.message) || "Flint-Chart is unavailable.");
      if (m && m.notAvailable) {
        html += ' <button id="btn-enable-charts" class="linkish">Enable charts</button>';
      }
      setFlintStatus(html);
      const enable = document.getElementById("btn-enable-charts");
      if (enable) {
        enable.addEventListener("click", function () { vscodeApi.postMessage({ type: "setupCharts" }); });
      }
    }

    function renderApp(data) {
      data = data || {};
      const prog = data.progress || {};
      renderProfile(data.profile || {});
      renderMomentum(prog);
      renderChart(prog.perDay || {});
      renderTopics(data.topics || {});
      renderCommands(data.commandCounts || {});
      renderLanguages(data.languageRuns || {});
      renderReviews(data.history || []);
      renderHistory(data.history || []);
    }

    document.getElementById("btn-onboard").addEventListener("click", function () { vscodeApi.postMessage({ type: "onboard" }); });
    document.getElementById("btn-resume").addEventListener("click", function () { vscodeApi.postMessage({ type: "resume" }); });
    document.getElementById("btn-refresh").addEventListener("click", function () { vscodeApi.postMessage({ type: "refresh" }); });
    document.getElementById("btn-profile").addEventListener("click", function () { vscodeApi.postMessage({ type: "openProfile" }); });

    window.addEventListener("message", function (e) {
      const m = e.data;
      if (!m) { return; }
      if (m.type === "data") { renderApp(m.data); }
      else if (m.type === "flintResult") { onFlintResult(m); }
    });

    renderApp(INITIAL);
  </script>
</body>
</html>`;
  }
}

// --- Flint-Chart MCP integration (host side) --------------------------------------

/**
 * Find the Flint-Chart render tool among all registered LM tools. MCP tool names
 * are namespaced by VS Code (e.g. `mcp_flint-chart_render_chart`), so we DISCOVER
 * by matching name/description/tags against /flint|chart/ and prefer the one whose
 * name mentions "render" (render_chart returns an inline SVG/PNG) rather than
 * hardcoding a name.
 */
function findFlintRenderTool(): vscode.LanguageModelToolInformation | undefined {
  const tools = vscode.lm.tools;
  const flint = tools.filter((t) => /flint|chart/i.test(`${t.name} ${t.description} ${(t.tags ?? []).join(" ")}`));
  return (
    flint.find((t) => /render/i.test(t.name)) ??
    flint.find((t) => /render/i.test(t.description)) ??
    flint[0]
  );
}

/** Local-day key (YYYY-MM-DD) for the last `n` days, oldest first. */
function lastNDaysHost(n: number): string[] {
  const out: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(dayKey(d));
  }
  return out;
}

/**
 * Build a flat Flint-Chart `render_chart` argument object (a `ChartAssemblyInput`
 * plus backend/format) from the learner's own persisted data. We request SVG from
 * the Vega-Lite backend so the image comes back as extractable text, and omit
 * `semantic_types` so Flint infers them (avoids guessing invalid type names).
 * Returns undefined when there isn't enough data to chart.
 */
function buildFlintSpec(chart: string, data: LearningData): Record<string, unknown> | undefined {
  const common = { backend: "vegalite", format: "svg", background: "#ffffff" };

  if (chart === "topics") {
    const entries = Object.entries(data.topics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    if (!entries.length) {
      return undefined;
    }
    const values = entries.map(([topic, sessions]) => ({ topic, sessions }));
    return {
      data: { values },
      chart_spec: {
        chartType: "Bar Chart",
        encodings: { x: { field: "sessions" }, y: { field: "topic" } },
        baseSize: { width: 640, height: 340 },
      },
      ...common,
    };
  }

  if (chart === "languages") {
    const entries = Object.entries(data.languageRuns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
    if (!entries.length) {
      return undefined;
    }
    const values = entries.map(([language, runs]) => ({ language, runs }));
    return {
      data: { values },
      chart_spec: {
        chartType: "Bar Chart",
        encodings: { x: { field: "runs" }, y: { field: "language" } },
        baseSize: { width: 640, height: 300 },
      },
      ...common,
    };
  }

  // Default: activity over the last 30 days.
  const days = lastNDaysHost(30);
  const perDay = data.progress.perDay ?? {};
  const values = days.map((day) => ({ day, sessions: perDay[day] ?? 0 }));
  if (values.every((v) => v.sessions === 0)) {
    return undefined;
  }
  return {
    data: { values },
    chart_spec: {
      chartType: "Bar Chart",
      encodings: { x: { field: "day" }, y: { field: "sessions" } },
      baseSize: { width: 680, height: 260 },
    },
    ...common,
  };
}

/**
 * Build the `{ rows, chartSpec }` for the self-spawned flint-chart-mcp render from the
 * learner's persisted data (the PRIMARY path; mirrors buildFlintSpec, which feeds the
 * secondary LM-tool path). Activity days are labelled `MM-DD` for a compact x-axis.
 * Returns undefined when there isn't enough data to chart.
 */
function buildSelfSpawnChart(
  chart: string,
  data: LearningData
): { rows: Array<Record<string, unknown>>; chartSpec: FlintChartSpec } | undefined {
  if (chart === "topics") {
    const entries = Object.entries(data.topics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    if (!entries.length) {
      return undefined;
    }
    return {
      rows: entries.map(([topic, sessions]) => ({ topic, sessions })),
      chartSpec: {
        chartType: "Bar Chart",
        encodings: { x: { field: "sessions" }, y: { field: "topic" } },
        baseSize: { width: 640, height: 340 },
      },
    };
  }

  if (chart === "languages") {
    const entries = Object.entries(data.languageRuns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
    if (!entries.length) {
      return undefined;
    }
    return {
      rows: entries.map(([language, runs]) => ({ language, runs })),
      chartSpec: {
        chartType: "Bar Chart",
        encodings: { x: { field: "runs" }, y: { field: "language" } },
        baseSize: { width: 640, height: 300 },
      },
    };
  }

  // Default: activity over the last 30 days, labelled MM-DD.
  const days = lastNDaysHost(30);
  const perDay = data.progress.perDay ?? {};
  const rows = days.map((day) => ({ day: day.slice(5), runs: perDay[day] ?? 0 }));
  if (rows.every((r) => r.runs === 0)) {
    return undefined;
  }
  return {
    rows,
    chartSpec: {
      chartType: "Bar Chart",
      encodings: { x: { field: "day" }, y: { field: "runs" } },
      baseSize: { width: 680, height: 260 },
    },
  };
}

/**
 * Pull a chart image out of a tool result. Flint's render_chart returns SVG as a
 * text part (plus a short note text part); other/newer parts may carry a binary
 * image with a mimeType. Returns the SVG string or an image data: URI.
 */
function extractImageFromToolResult(
  result: vscode.LanguageModelToolResult
): { svg?: string; dataUri?: string } | undefined {
  const parts = (result?.content ?? []) as unknown[];
  let svg: string | undefined;
  let dataUri: string | undefined;

  const consumeString = (raw: string): void => {
    const s = raw.trim();
    if (!svg && /<svg[\s>]/i.test(s)) {
      svg = s;
    } else if (!dataUri && /^data:image\//i.test(s)) {
      dataUri = s;
    }
  };

  for (const part of parts) {
    if (part instanceof vscode.LanguageModelTextPart) {
      consumeString(part.value);
      continue;
    }
    const anyPart = part as {
      value?: unknown;
      data?: unknown;
      mimeType?: unknown;
      mediaType?: unknown;
      mime?: unknown;
    };
    if (typeof anyPart?.value === "string") {
      consumeString(anyPart.value);
      continue;
    }
    const holder = (anyPart?.value && typeof anyPart.value === "object" ? anyPart.value : anyPart) as {
      data?: unknown;
      mimeType?: unknown;
      mediaType?: unknown;
      mime?: unknown;
    };
    const mime = [holder.mimeType, holder.mediaType, holder.mime].find((m) => typeof m === "string") as
      | string
      | undefined;
    const rawData = holder.data;
    if (mime && /^image\//i.test(mime) && rawData != null && !dataUri) {
      let b64: string | undefined;
      if (typeof rawData === "string") {
        b64 = rawData.replace(/^data:[^,]*,/, "");
      } else {
        try {
          b64 = Buffer.from(rawData as Uint8Array).toString("base64");
        } catch {
          b64 = undefined;
        }
      }
      if (b64) {
        dataUri = `data:${mime};base64,${b64}`;
      }
    }
  }

  if (svg) {
    return { svg };
  }
  if (dataUri) {
    return { dataUri };
  }
  return undefined;
}
