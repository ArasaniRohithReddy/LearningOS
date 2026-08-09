// OPT-IN Azure authentication for the LearningOS MCP server.
//
// The server works fully WITHOUT Azure — this module is only used when the user
// explicitly opts in (LEARNINGOS_AZURE_AUTH=1) and a tool needs an authenticated
// backend. It reuses the user's EXISTING `az login` session via the Azure CLI:
//   * we store no credentials of our own;
//   * tokens are resource/audience-scoped and short-lived;
//   * tokens are NEVER logged, persisted, or returned to the model;
//   * if `az` is missing or the user is not logged in, every call degrades to null
//     and the rest of the server keeps working.
//
// No extra npm dependency — this shells out to the Azure CLI the user already has.

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const pexecFile = promisify(execFile);

/** True only when the user has explicitly opted in to Azure-authenticated features. */
export function isAzureAuthEnabled(): boolean {
  const v = (process.env.LEARNINGOS_AZURE_AUTH ?? "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

/** The default resource/audience to request tokens for (set by opt-in scenarios). */
export function configuredResource(): string | undefined {
  const r = process.env.LEARNINGOS_AZURE_RESOURCE?.trim();
  return r ? r : undefined;
}

export interface AzureToken {
  /** The raw bearer token. Handle as a secret: never log or return it to the model. */
  token: string;
  /** Expiry as epoch milliseconds. */
  expiresOn: number;
}

const tokenCache = new Map<string, AzureToken>();
const SKEW_MS = 120_000; // refresh 2 minutes before expiry

function isAzNotFound(err: unknown): boolean {
  return (err as NodeJS.ErrnoException | undefined)?.code === "ENOENT";
}

/**
 * Silently obtain an access token for `resource` from the user's Azure CLI session.
 * Returns null (never throws) if `az` is missing, the user is not logged in, or the
 * scope is refused — callers MUST degrade gracefully. Cached until shortly before
 * expiry. The token is NEVER logged.
 */
export async function getAzureToken(resource: string): Promise<AzureToken | null> {
  const cached = tokenCache.get(resource);
  if (cached && cached.expiresOn - SKEW_MS > Date.now()) return cached;
  try {
    const { stdout } = await pexecFile(
      "az",
      ["account", "get-access-token", "--resource", resource, "--output", "json"],
      { timeout: 20_000, windowsHide: true, maxBuffer: 1024 * 1024 },
    );
    const parsed = JSON.parse(stdout) as {
      accessToken?: string;
      expiresOn?: string;
      expires_on?: number;
    };
    if (!parsed.accessToken) return null;
    // az may emit a local-time string (`expiresOn`) and/or an epoch (`expires_on`).
    let expiresOn: number;
    if (typeof parsed.expires_on === "number") {
      expiresOn = parsed.expires_on * 1000;
    } else if (parsed.expiresOn) {
      const t = Date.parse(parsed.expiresOn);
      expiresOn = Number.isNaN(t) ? Date.now() + 55 * 60_000 : t;
    } else {
      expiresOn = Date.now() + 55 * 60_000;
    }
    const tok: AzureToken = { token: parsed.accessToken, expiresOn };
    tokenCache.set(resource, tok);
    return tok;
  } catch {
    // az not installed, not logged in, or scope refused — degrade silently.
    return null;
  }
}

export interface AzureIdentity {
  authenticated: boolean;
  user?: string;
  tenantId?: string;
  subscription?: string;
  cloud?: string;
  reason?: string;
}

/**
 * Non-sensitive "who am I" from the Azure CLI. NEVER returns a token — only the
 * user's own account identity, so a user can confirm the server can authenticate
 * on their behalf. Returns { authenticated:false, reason } on any failure.
 */
export async function getAzureIdentity(): Promise<AzureIdentity> {
  try {
    const { stdout } = await pexecFile(
      "az",
      ["account", "show", "--output", "json"],
      { timeout: 15_000, windowsHide: true, maxBuffer: 1024 * 1024 },
    );
    const a = JSON.parse(stdout) as {
      user?: { name?: string };
      tenantId?: string;
      name?: string;
      environmentName?: string;
    };
    return {
      authenticated: true,
      user: a.user?.name,
      tenantId: a.tenantId,
      subscription: a.name,
      cloud: a.environmentName,
    };
  } catch (err) {
    const reason = isAzNotFound(err)
      ? "Azure CLI (az) is not installed or not on PATH."
      : "Not signed in — run `az login` (or the Azure CLI call failed).";
    return { authenticated: false, reason };
  }
}
