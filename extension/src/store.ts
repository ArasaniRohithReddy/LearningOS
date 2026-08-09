// Cross-session persistence for Drona's learner profile, history and progress.
//
// Everything lives in `context.globalState`, which survives across sessions AND
// workspaces (unlike workspaceState). We keep the data small and self-healing:
// unknown/older shapes are normalised on read so the extension never crashes on
// stale data. A human-readable profile Markdown file can be exported on demand
// (see `writeProfile`) to a NON-colliding path (`.learningos/profile.md`) so it
// never clobbers the LearningOS skills' hand-maintained `learning-profile.md`.
//
// All globalState mutations go through a single async mutex (`runExclusive`) so
// overlapping @drona turns can't clobber each other (last-writer-wins races).

import * as vscode from "vscode";

/** Storage key for the single JSON blob we keep in globalState. */
const DATA_KEY = "learningos.data";
/** Bump when the persisted shape changes in a breaking way. */
const DATA_VERSION = 1;
/** Keep history bounded so globalState stays small. */
const MAX_HISTORY = 200;
/** Keep per-day activity for charting to a rolling window. */
const MAX_DAYS = 30;
/** Cap the distinct-topics map so globalState can't grow without bound. */
const MAX_TOPICS = 200;
/**
 * Cap the "topics ever seen" set used purely for accurate distinct-topic counting.
 * It's kept far larger than MAX_TOPICS (which only feeds the chart) so the lifetime
 * count stays exact for any realistic learner; see `distinctTopics` for the residual
 * limitation once more than this many distinct topics are studied.
 */
const MAX_SEEN = 1_000;
/** Cap the slash-command / tool usage map so globalState stays bounded. */
const MAX_COMMANDS = 50;
/** Cap the per-language run-count map so globalState stays bounded. */
const MAX_LANGUAGES = 100;

export interface LearnerProfile {
  name?: string;
  /** The learner's stated goal / objective, filled opportunistically. */
  goal?: string;
  /** Beginner | Intermediate | Advanced (free-form, best-effort). */
  level?: string;
  /** Technologies the learner is working with. */
  stack?: string[];
  /** The single agreed next step for the learner. */
  nextStep?: string;
  /** How the learner likes to learn — e.g. "diagram-heavy", "hands-on", "worked examples", "concise text". */
  learningStyle?: string;
}

export interface HistoryEntry {
  /** ISO timestamp of the turn. */
  ts: string;
  /** The slash command used, if any (learn/plan/interview/resume/charts). */
  command?: string;
  /** Short topic/title derived from the prompt. */
  topic: string;
  /** One-line summary derived from the prompt/response. */
  summary: string;
}

export interface Progress {
  totalSessions: number;
  /** Current streak in consecutive active days. */
  streakDays: number;
  /** Longest streak of consecutive active days ever reached (monotonic). */
  longestStreak: number;
  /** Last active day as YYYY-MM-DD (local time). */
  lastActive?: string;
  /**
   * Lifetime count of distinct topics ever studied (monotonic; never decreases).
   * Backed by the bounded `seen` set below so a topic evicted from the capped
   * `topics` chart map and later revisited is NOT recounted. Residual limitation:
   * once more than MAX_SEEN distinct topics have ever been studied, keys evicted
   * from `seen` may be recounted if revisited — far beyond realistic single-learner
   * usage, so the dashboard stat is accurate in practice.
   */
  distinctTopics: number;
  /** Rolling map of YYYY-MM-DD -> number of turns that day (last ~30 days). */
  perDay: Record<string, number>;
}

export interface LearningData {
  version: number;
  profile: LearnerProfile;
  history: HistoryEntry[];
  progress: Progress;
  /** topic -> times studied, powering "distinct topics" and the topics chart. */
  topics: Record<string, number>;
  /**
   * topic key -> last-seen sequence number (the totalSessions value at that turn).
   * A bounded set of every topic ever seen, used ONLY to count distinct topics
   * accurately across evictions from the capped `topics` map. Capped at MAX_SEEN.
   */
  seen: Record<string, number>;
  /**
   * slash-command / tool key -> times used (learn, plan, interview, resume,
   * charts, chat, run-code, fetch). Powers the "commands & tools used" chart.
   * Bounded to MAX_COMMANDS keys.
   */
  commandCounts: Record<string, number>;
  /**
   * language name -> times code was run in it via the run-code tool. Powers the
   * "languages practiced" chart. Bounded to MAX_LANGUAGES keys.
   */
  languageRuns: Record<string, number>;
}

/** A fresh, empty data object. */
function emptyData(): LearningData {
  return {
    version: DATA_VERSION,
    profile: {},
    history: [],
    progress: { totalSessions: 0, streakDays: 0, longestStreak: 0, distinctTopics: 0, perDay: {} },
    topics: {},
    seen: {},
    commandCounts: {},
    languageRuns: {},
  };
}

/** Local-time day key (YYYY-MM-DD). Charts/streaks are day-granular by design. */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Local calendar day (YYYY-MM-DD) for a stored ISO timestamp, tolerant of bad input. */
export function localDayFromTs(ts: string | undefined): string {
  if (!ts) {
    return "";
  }
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? ts.slice(0, 10) : dayKey(d);
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Read + normalise the persisted data, tolerating missing/older/corrupt shapes. */
export function getData(context: vscode.ExtensionContext): LearningData {
  const raw = context.globalState.get<unknown>(DATA_KEY);
  const base = emptyData();
  if (!isPlainObject(raw)) {
    return base;
  }
  const profile = isPlainObject(raw.profile) ? (raw.profile as LearnerProfile) : {};
  const history = Array.isArray(raw.history)
    ? (raw.history as HistoryEntry[]).filter((h) => h && typeof h.ts === "string").slice(-MAX_HISTORY)
    : [];
  const progressIn = isPlainObject(raw.progress) ? raw.progress : {};
  const perDay = isPlainObject(progressIn.perDay) ? (progressIn.perDay as Record<string, number>) : {};
  const topics = isPlainObject(raw.topics) ? (raw.topics as Record<string, number>) : {};
  // Usage maps for the richer dashboard charts (bounded, positive-count entries only).
  const commandCounts = normalizeCountMap(raw.commandCounts);
  const languageRuns = normalizeCountMap(raw.languageRuns);
  // The "ever seen" set backs the accurate distinct-topic count. For data written
  // before this set existed, seed it from the known topic keys so those already
  // count as seen (and won't be recounted on their next visit).
  let seen: Record<string, number>;
  if (isPlainObject(raw.seen)) {
    seen = {};
    for (const [k, v] of Object.entries(raw.seen as Record<string, unknown>)) {
      seen[k] = Number(v) || 0;
    }
  } else {
    seen = {};
    for (const k of Object.keys(topics)) {
      seen[k] = 0;
    }
  }
  const streakDays = Number(progressIn.streakDays) || 0;
  const progress: Progress = {
    totalSessions: Number(progressIn.totalSessions) || 0,
    streakDays,
    // Older data may lack longestStreak; seed it from the current streak so it's
    // never below what we already know, then it grows monotonically in recordTurn.
    longestStreak: Math.max(Number(progressIn.longestStreak) || 0, streakDays),
    lastActive: typeof progressIn.lastActive === "string" ? progressIn.lastActive : undefined,
    distinctTopics: Number(progressIn.distinctTopics) || Object.keys(seen).length,
    perDay,
  };
  return { version: DATA_VERSION, profile, history, progress, topics, seen, commandCounts, languageRuns };
}

/** Coerce an unknown value into a bounded map of positive integer counts. */
function normalizeCountMap(v: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (!isPlainObject(v)) {
    return out;
  }
  for (const [k, val] of Object.entries(v)) {
    const n = Number(val);
    if (typeof k === "string" && k && Number.isFinite(n) && n > 0) {
      out[k] = Math.floor(n);
    }
  }
  return out;
}

/** Persist the given data verbatim. */
export async function saveData(context: vscode.ExtensionContext, data: LearningData): Promise<void> {
  await context.globalState.update(DATA_KEY, data);
}

// --- write serialization (async mutex) --------------------------------------------
// recordTurn/updateProfile do read-modify-write on globalState. Overlapping @drona
// turns could otherwise read the same snapshot and clobber each other on save
// (last-writer-wins drops a history entry / miscounts sessions). We funnel every
// read-modify-write through a single promise chain so each task observes the state
// committed by the previous one.
let writeQueue: Promise<unknown> = Promise.resolve();

/** Run `task` exclusively, after any previously queued write has committed. */
function runExclusive<T>(task: () => Promise<T>): Promise<T> {
  const result = writeQueue.then(task, task);
  // Advance the queue, swallowing errors so one failure can't wedge the chain.
  writeQueue = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}

/**
 * Cap the distinct-topics map so globalState can't grow forever. Keeps the
 * strongest MAX_TOPICS entries (by study count, ties broken by most-recent), and
 * preserves insertion (recency) order in the result.
 */
function capTopics(topics: Record<string, number>): Record<string, number> {
  const keys = Object.keys(topics);
  if (keys.length <= MAX_TOPICS) {
    return topics;
  }
  const ranked = keys.map((k, order) => ({ k, count: topics[k], order }));
  ranked.sort((a, b) => b.count - a.count || b.order - a.order);
  const keep = new Set(ranked.slice(0, MAX_TOPICS).map((r) => r.k));
  const out: Record<string, number> = {};
  for (const k of keys) {
    if (keep.has(k)) {
      out[k] = topics[k];
    }
  }
  return out;
}

/**
 * Cap the "ever seen" set so globalState can't grow forever. Keeps the MAX_SEEN
 * most-recently-seen keys (by their last-seen sequence value). The set only needs
 * membership for distinct-topic counting, so evicting the oldest keys is safe.
 */
function capSeen(seen: Record<string, number>): Record<string, number> {
  const keys = Object.keys(seen);
  if (keys.length <= MAX_SEEN) {
    return seen;
  }
  const ranked = keys.map((k) => ({ k, seq: seen[k] }));
  ranked.sort((a, b) => b.seq - a.seq);
  const out: Record<string, number> = {};
  for (const r of ranked.slice(0, MAX_SEEN)) {
    out[r.k] = seen[r.k];
  }
  return out;
}

/**
 * Cap a usage count-map (command/tool or language) to `max` keys, keeping the
 * highest-count entries. Only membership + counts matter for the charts, so
 * evicting the smallest counts is safe.
 */
function capCountMap(map: Record<string, number>, max: number): Record<string, number> {
  const keys = Object.keys(map);
  if (keys.length <= max) {
    return map;
  }
  const ranked = keys.map((k) => ({ k, n: map[k] }));
  ranked.sort((a, b) => b.n - a.n);
  const out: Record<string, number> = {};
  for (const r of ranked.slice(0, max)) {
    out[r.k] = map[r.k];
  }
  return out;
}

/** Normalise a turn's slash-command into a stable key ("chat" when none was used). */
function normalizeCommandKey(command: string | undefined): string {
  const c = (command ?? "").trim().toLowerCase();
  return c || "chat";
}

/** Prune per-day counts to the last MAX_DAYS days. */
function prunePerDay(perDay: Record<string, number>): Record<string, number> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (MAX_DAYS - 1));
  const cutoffKey = dayKey(cutoff);
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(perDay)) {
    if (k >= cutoffKey) {
      out[k] = v;
    }
  }
  return out;
}

/** Is `b` exactly one calendar day after `a`? Both are YYYY-MM-DD keys. */
function isNextDay(a: string, b: string): boolean {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  const diff = db.getTime() - da.getTime();
  return diff > 0 && diff <= 1000 * 60 * 60 * 24 * 1.5; // tolerate DST wobble
}

/** Turn a raw prompt into a short, human topic/title (best-effort, no model). */
export function deriveTopic(prompt: string | undefined, command: string | undefined): string {
  const cleaned = (prompt ?? "")
    .replace(/[`*_#>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) {
    return command ? command.charAt(0).toUpperCase() + command.slice(1) : "General";
  }
  // First clause (up to sentence punctuation), capped to a handful of words.
  const firstClause = cleaned.split(/[.!?;\n]/)[0].trim();
  const words = firstClause.split(" ").slice(0, 8).join(" ");
  const topic = words.length > 60 ? words.slice(0, 57).trimEnd() + "…" : words;
  return topic || "General";
}

/** One-line summary from prompt (and optional response snippet). */
export function deriveSummary(prompt: string | undefined, response?: string): string {
  const src = (response && response.trim()) || prompt || "";
  const flat = src
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|]/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const firstSentence = flat.split(/(?<=[.!?])\s/)[0] ?? flat;
  return firstSentence.length > 140 ? firstSentence.slice(0, 137).trimEnd() + "…" : firstSentence;
}

export interface RecordTurnInput {
  command?: string;
  prompt: string;
  /** Optional assistant response text, used for a better summary. */
  response?: string;
}

/**
 * Append a history entry and update progress for one @drona turn.
 * Returns the updated data (already persisted).
 */
export async function recordTurn(
  context: vscode.ExtensionContext,
  input: RecordTurnInput
): Promise<LearningData> {
  return runExclusive(async () => {
    const data = getData(context);
    const now = new Date();
    const today = dayKey(now);

    const topic = deriveTopic(input.prompt, input.command);
    const entry: HistoryEntry = {
      ts: now.toISOString(),
      command: input.command,
      topic,
      summary: deriveSummary(input.prompt, input.response),
    };
    data.history.push(entry);
    if (data.history.length > MAX_HISTORY) {
      data.history = data.history.slice(-MAX_HISTORY);
    }

    // Topics chart map: re-insert the current topic so the map's key order reflects
    // recency, then cap it to keep globalState bounded. This map feeds the chart only.
    const topicKey = topic.toLowerCase();
    // Distinct-topic counting uses the separate, larger `seen` set (not the capped
    // chart map) so an evicted-then-revisited topic isn't recounted as new.
    const wasSeen = topicKey in data.seen;
    const prevCount = data.topics[topicKey] ?? 0;
    delete data.topics[topicKey];
    data.topics[topicKey] = prevCount + 1;
    data.topics = capTopics(data.topics);

    // Progress metrics.
    const p = data.progress;
    p.totalSessions += 1;
    p.perDay[today] = (p.perDay[today] ?? 0) + 1;
    p.perDay = prunePerDay(p.perDay);
    // distinctTopics is a lifetime monotonic counter; increment only for a
    // genuinely-first-ever topic (per the bounded `seen` set).
    if (!wasSeen) {
      p.distinctTopics += 1;
    }
    // Record/refresh this topic in the "ever seen" set (sequence = totalSessions).
    data.seen[topicKey] = p.totalSessions;
    data.seen = capSeen(data.seen);

    if (!p.lastActive) {
      p.streakDays = 1;
    } else if (p.lastActive === today) {
      p.streakDays = Math.max(1, p.streakDays);
    } else if (isNextDay(p.lastActive, today)) {
      p.streakDays += 1;
    } else {
      p.streakDays = 1; // gap in activity resets the streak
    }
    p.lastActive = today;
    // Longest streak is a lifetime high-water mark that never decreases.
    p.longestStreak = Math.max(p.longestStreak ?? 0, p.streakDays);

    // Commands & tools used chart: count this turn's slash-command ("chat" when none).
    const cmdKey = normalizeCommandKey(input.command);
    data.commandCounts[cmdKey] = (data.commandCounts[cmdKey] ?? 0) + 1;
    data.commandCounts = capCountMap(data.commandCounts, MAX_COMMANDS);

    await saveData(context, data);
    return data;
  });
}

/**
 * Record one remote code run of `language` for the "languages practiced" chart,
 * and count the run-code tool in the "commands & tools used" chart. Mutex-guarded,
 * bounded, and safe to call before any @drona turn has run. Best-effort — callers
 * should not let a persistence failure break the tool.
 */
export function recordCodeRun(context: vscode.ExtensionContext, language: string | undefined): Promise<void> {
  return runExclusive(async () => {
    const data = getData(context);
    const key = (language ?? "").toString().trim().toLowerCase() || "unknown";
    data.languageRuns[key] = (data.languageRuns[key] ?? 0) + 1;
    data.languageRuns = capCountMap(data.languageRuns, MAX_LANGUAGES);
    data.commandCounts["run-code"] = (data.commandCounts["run-code"] ?? 0) + 1;
    data.commandCounts = capCountMap(data.commandCounts, MAX_COMMANDS);
    await saveData(context, data);
  });
}

/**
 * Record one use of a slash-command / tool `key` (e.g. "fetch") for the
 * "commands & tools used" chart. Mutex-guarded, bounded, first-run-safe.
 */
export function recordCommand(context: vscode.ExtensionContext, key: string | undefined): Promise<void> {
  const k = (key ?? "").toString().trim().toLowerCase();
  if (!k) {
    return Promise.resolve();
  }
  return runExclusive(async () => {
    const data = getData(context);
    data.commandCounts[k] = (data.commandCounts[k] ?? 0) + 1;
    data.commandCounts = capCountMap(data.commandCounts, MAX_COMMANDS);
    await saveData(context, data);
  });
}

/** Opportunistically enrich the profile (never overwrites with empty values). */
export async function updateProfile(
  context: vscode.ExtensionContext,
  patch: Partial<LearnerProfile>
): Promise<LearningData> {
  return runExclusive(async () => {
    const data = getData(context);
    const prof = data.profile;
    if (patch.name) {
      prof.name = patch.name;
    }
    if (patch.goal) {
      prof.goal = patch.goal;
    }
    if (patch.level) {
      prof.level = patch.level;
    }
    if (patch.stack && patch.stack.length) {
      prof.stack = patch.stack;
    }
    if (patch.nextStep) {
      prof.nextStep = patch.nextStep;
    }
    if (patch.learningStyle) {
      prof.learningStyle = patch.learningStyle;
    }
    await saveData(context, data);
    return data;
  });
}

/**
 * Build a compact, model-facing summary of the learner's persisted memory:
 * goal / level / stack (when set), current streak & totals, the last few distinct
 * topics, and the recorded next step. Injected into Drona's system prompt each turn
 * so answers are personalized and `@drona /resume` actually works.
 */
export function renderMemorySummary(data: LearningData): string {
  const { profile, progress, history } = data;
  const lines: string[] = [];
  if (profile.goal) {
    lines.push(`- Goal / target: ${profile.goal}`);
  }
  if (profile.level) {
    lines.push(`- Level: ${profile.level}`);
  }
  if (profile.stack && profile.stack.length) {
    lines.push(`- Stack: ${profile.stack.join(", ")}`);
  }
  if (profile.learningStyle) {
    lines.push(`- Learning style / visual preference (match every answer to this): ${profile.learningStyle}`);
  }
  lines.push(
    `- Current streak: ${progress.streakDays} day(s) (longest ${progress.longestStreak}); ` +
      `total sessions: ${progress.totalSessions}`
  );

  const recentTopics: string[] = [];
  for (let i = history.length - 1; i >= 0 && recentTopics.length < 5; i--) {
    const t = history[i]?.topic;
    if (t && !recentTopics.includes(t)) {
      recentTopics.push(t);
    }
  }
  if (recentTopics.length) {
    lines.push(`- Recent topics: ${recentTopics.join("; ")}`);
  }
  const langs = topEntries(data.languageRuns, 4).map(([k]) => k);
  if (langs.length) {
    lines.push(`- Languages practiced (remote code runs): ${langs.join(", ")}`);
  }
  if (profile.nextStep) {
    lines.push(`- Agreed next step: ${profile.nextStep}`);
  }
  return lines.join("\n");
}

/** Return the top-N [key, count] entries of a count-map, highest count first. */
function topEntries(map: Record<string, number>, n: number): Array<[string, number]> {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

/** Render the profile as human-readable Markdown. */
export function renderProfileMarkdown(data: LearningData): string {
  const { profile, progress, history, topics } = data;
  const lines: string[] = [];
  lines.push("# LearningOS — Learner Profile");
  lines.push("");
  lines.push("_Maintained automatically by Drona. Exported for your reference._");
  lines.push("");
  lines.push("## Profile");
  lines.push(`- **Name:** ${profile.name ?? "_(not set)_"}`);
  lines.push(`- **Goal:** ${profile.goal ?? "_(not set — tell Drona your objective)_"}`);
  lines.push(`- **Level:** ${profile.level ?? "_(not set)_"}`);
  lines.push(`- **Stack:** ${profile.stack && profile.stack.length ? profile.stack.join(", ") : "_(not set)_"}`);
  lines.push(`- **Learning style:** ${profile.learningStyle ?? "_(not set — tell Drona how you like to learn)_"}`);
  lines.push(`- **Next step:** ${profile.nextStep ?? "_(not set)_"}`);
  lines.push("");
  lines.push("## Progress");
  lines.push(`- **Total sessions:** ${progress.totalSessions}`);
  lines.push(`- **Current streak:** ${progress.streakDays} day(s)`);
  lines.push(`- **Longest streak:** ${progress.longestStreak} day(s)`);
  lines.push(`- **Distinct topics:** ${progress.distinctTopics}`);
  lines.push(`- **Last active:** ${progress.lastActive ?? "_(never)_"}`);
  lines.push("");

  const langs = topEntries(data.languageRuns, 10);
  if (langs.length) {
    lines.push("## Languages practiced (remote code runs)");
    for (const [lang, n] of langs) {
      lines.push(`- ${lang} — ${n}`);
    }
    lines.push("");
  }

  const topTopics = Object.entries(topics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  if (topTopics.length) {
    lines.push("## Top topics");
    for (const [t, n] of topTopics) {
      lines.push(`- ${t} — ${n}`);
    }
    lines.push("");
  }

  const recent = history.slice(-15).reverse();
  if (recent.length) {
    lines.push("## Recent activity");
    for (const h of recent) {
      // Display the LOCAL calendar day (consistent with the streak/activity chart),
      // not the UTC date from the ISO timestamp.
      const when = localDayFromTs(h.ts);
      const cmd = h.command ? `/${h.command} ` : "";
      lines.push(`- **${when}** — ${cmd}${h.topic}: ${h.summary}`);
    }
    lines.push("");
  }

  lines.push("---");
  lines.push(`_Last updated ${new Date().toISOString()}._`);
  lines.push("");
  return lines.join("\n");
}

/**
 * Resolve where the on-demand human-readable profile export lives:
 * `.learningos/profile.md` (config: `learningos.profilePath`) in the first
 * workspace folder if one is open, else the extension's private global storage.
 * Deliberately NOT `learning-profile.md` in the workspace root, so it never
 * clobbers the LearningOS skills' hand-maintained profile of that name.
 */
export function profileUri(context: vscode.ExtensionContext): vscode.Uri {
  const folder = vscode.workspace.workspaceFolders?.[0];
  const rel = vscode.workspace
    .getConfiguration("learningos")
    .get<string>("profilePath", ".learningos/profile.md");
  if (folder) {
    return vscode.Uri.joinPath(folder.uri, rel);
  }
  return vscode.Uri.joinPath(context.globalStorageUri, "learning-profile.md");
}

/** Write the Markdown profile to disk, returning its Uri (or undefined on failure). */
export async function writeProfile(
  context: vscode.ExtensionContext,
  data?: LearningData
): Promise<vscode.Uri | undefined> {
  // Read the freshest committed state (under the write mutex) unless given data.
  const d = data ?? (await runExclusive(async () => getData(context)));
  const uri = profileUri(context);
  try {
    // Ensure the parent directory exists (needed for globalStorage on first use).
    await vscode.workspace.fs.createDirectory(vscode.Uri.joinPath(uri, ".."));
  } catch {
    /* directory may already exist */
  }
  try {
    const bytes = Buffer.from(renderProfileMarkdown(d), "utf8");
    await vscode.workspace.fs.writeFile(uri, bytes);
    return uri;
  } catch {
    return undefined;
  }
}

// --- `learningos_remember` language model tool ------------------------------------
// Lets the model persist durable facts the learner states (goal/target, level,
// stack, next step) so future sessions are personalized. Its whole job is to feed
// `updateProfile`, which is what makes `data.profile` non-empty and the injected
// memory summary meaningful.

/** Input for the remember tool. `stack` is a comma-separated list (per the schema). */
export interface RememberInput {
  goal?: string;
  level?: string;
  stack?: string;
  nextStep?: string;
  learningStyle?: string;
}

/** Must match `contributes.languageModelTools[].name` in package.json. */
export const REMEMBER_TOOL_NAME = "learningos_remember";

export class LearningRememberTool implements vscode.LanguageModelTool<RememberInput> {
  constructor(private readonly context: vscode.ExtensionContext) {}

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<RememberInput>,
    _token: vscode.CancellationToken
  ): Promise<vscode.PreparedToolInvocation> {
    const fields = Object.keys(options.input ?? {}).filter(
      (k) => typeof (options.input as Record<string, unknown>)?.[k] === "string"
    );
    const what = fields.length ? fields.join(", ") : "profile";
    return { invocationMessage: `Remembering your ${what}…` };
  }

  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<RememberInput>,
    _token: vscode.CancellationToken
  ): Promise<vscode.LanguageModelToolResult> {
    const input = options.input ?? {};
    const patch: Partial<LearnerProfile> = {};
    const saved: string[] = [];

    if (typeof input.goal === "string" && input.goal.trim()) {
      patch.goal = input.goal.trim();
      saved.push("goal");
    }
    if (typeof input.level === "string" && input.level.trim()) {
      patch.level = input.level.trim();
      saved.push("level");
    }
    if (typeof input.stack === "string" && input.stack.trim()) {
      const stack = input.stack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (stack.length) {
        patch.stack = stack;
        saved.push("stack");
      }
    }
    if (typeof input.nextStep === "string" && input.nextStep.trim()) {
      patch.nextStep = input.nextStep.trim();
      saved.push("next step");
    }
    if (typeof input.learningStyle === "string" && input.learningStyle.trim()) {
      patch.learningStyle = input.learningStyle.trim();
      saved.push("learning style");
    }

    if (!saved.length) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(
          "Nothing was saved — provide at least one of goal, level, stack, nextStep, or learningStyle."
        ),
      ]);
    }

    try {
      await updateProfile(this.context, patch);
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(`Could not save the learner profile: ${reason}.`),
      ]);
    }

    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(
        `Saved to the learner's cross-session profile: ${saved.join(", ")}.`
      ),
    ]);
  }
}

/** Register the remember tool; safe to call once on activation. */
export function registerRememberTool(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.lm.registerTool<RememberInput>(REMEMBER_TOOL_NAME, new LearningRememberTool(context))
  );
}
