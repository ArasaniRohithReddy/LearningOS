// SSRF guard (ported from the LearningOS extension's fetch tool).
// Rejects hosts that resolve to loopback / private / link-local / cloud-metadata
// ranges, plus classic numeric-encoding bypasses. Validates the hostname only
// (no DNS resolution) — a public name that later resolves to a private IP can
// still slip through, which is out of scope for a dependency-free guard.

import * as net from "node:net";

function isBlockedIPv4(host: string): boolean {
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) {
    return true;
  }
  const o = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
  if (o.some((n) => n > 255)) {
    return true;
  }
  const [a, b] = o;
  if (a === 0) return true;
  if (a === 127) return true;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

function parseNumericPart(part: string): number | undefined {
  if (/^0x[0-9a-f]+$/i.test(part)) return parseInt(part.slice(2), 16);
  if (/^0[0-7]+$/.test(part)) return parseInt(part, 8);
  if (/^(0|[1-9]\d*)$/.test(part)) return parseInt(part, 10);
  return undefined;
}

function canonicalizeToIPv4(host: string): string | undefined {
  const parts = host.split(".");
  if (parts.length === 0 || parts.length > 4) return undefined;
  const nums: number[] = [];
  for (const part of parts) {
    const n = parseNumericPart(part);
    if (n === undefined || n < 0) return undefined;
    nums.push(n);
  }
  let value: number;
  const n = nums.length;
  if (n === 1) {
    value = nums[0];
  } else {
    for (let i = 0; i < n - 1; i++) if (nums[i] > 255) return undefined;
    const lastBytes = 4 - (n - 1);
    if (nums[n - 1] >= Math.pow(256, lastBytes)) return undefined;
    value = nums[n - 1];
    for (let i = 0; i < n - 1; i++) value += nums[i] * Math.pow(256, 3 - i);
  }
  if (value < 0 || value > 0xffffffff) return undefined;
  const a = Math.floor(value / 0x1000000) & 0xff;
  const b = Math.floor(value / 0x10000) & 0xff;
  const c = Math.floor(value / 0x100) & 0xff;
  const d = value & 0xff;
  return `${a}.${b}.${c}.${d}`;
}

function ipv6ToHextets(input: string): number[] | undefined {
  let s = input;
  const v4 = s.match(/(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const o = [Number(v4[1]), Number(v4[2]), Number(v4[3]), Number(v4[4])];
    if (o.some((x) => x > 255)) return undefined;
    const g1 = ((o[0] << 8) | o[1]).toString(16);
    const g2 = ((o[2] << 8) | o[3]).toString(16);
    s = s.slice(0, s.length - v4[0].length) + g1 + ":" + g2;
  }
  let groups: string[];
  if (s.includes("::")) {
    const halves = s.split("::");
    if (halves.length > 2) return undefined;
    const head = halves[0] ? halves[0].split(":") : [];
    const tail = halves[1] ? halves[1].split(":") : [];
    const missing = 8 - head.length - tail.length;
    if (missing < 0) return undefined;
    groups = [...head, ...Array(missing).fill("0"), ...tail];
  } else {
    groups = s.split(":");
  }
  if (groups.length !== 8) return undefined;
  const nums = groups.map((g) => (g === "" ? NaN : parseInt(g, 16)));
  if (nums.some((x) => Number.isNaN(x) || x < 0 || x > 0xffff)) return undefined;
  return nums;
}

function isBlockedIPv6(host: string): boolean {
  const g = ipv6ToHextets(host);
  if (!g) return true;
  const firstSevenZero = g.slice(0, 7).every((x) => x === 0);
  if (firstSevenZero && (g[7] === 0 || g[7] === 1)) return true;
  if (g[0] >= 0xfc00 && g[0] <= 0xfdff) return true;
  if (g[0] >= 0xfe80 && g[0] <= 0xfebf) return true;
  const firstFiveZero = g.slice(0, 5).every((x) => x === 0);
  if (firstFiveZero && (g[5] === 0xffff || g[5] === 0) && !(g[5] === 0 && g[6] === 0 && (g[7] === 0 || g[7] === 1))) {
    const a = g[6] >> 8;
    const b = g[6] & 0xff;
    const c = g[7] >> 8;
    const d = g[7] & 0xff;
    return isBlockedIPv4(`${a}.${b}.${c}.${d}`);
  }
  return false;
}

/** Returns true when the host must NOT be fetched. */
export function isBlockedHost(hostname: string | undefined): boolean {
  let host = (hostname ?? "").trim().toLowerCase();
  if (!host) return true;
  if (host.startsWith("[") && host.endsWith("]")) host = host.slice(1, -1);
  const zone = host.indexOf("%");
  if (zone !== -1) host = host.slice(0, zone);
  if (host.length > 1 && host.endsWith(".")) host = host.slice(0, -1);
  if (!host) return true;
  if (host === "localhost" || host === "local" || host.endsWith(".local")) return true;
  const ver = net.isIP(host);
  if (ver === 4) return isBlockedIPv4(host);
  if (ver === 6) return isBlockedIPv6(host);
  const canonical = canonicalizeToIPv4(host);
  if (canonical) return isBlockedIPv4(canonical);
  return false;
}
