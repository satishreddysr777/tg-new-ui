// Shared formatting + engagement-math helpers for the Employee Console.

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** "2026-08-22T…" → "Aug 22, 2026". */
export function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export interface EngagementProgress {
  week: number; // current week, 1-based
  total: number; // total weeks in the engagement
  remaining: number; // weeks left (never negative)
  pct: number; // 0–100 elapsed
}

/** Derive week N / total and percent-elapsed from the placement dates. */
export function engagementProgress(
  start: string | null,
  end: string | null,
): EngagementProgress | null {
  if (!start || !end) return null;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e) || e <= s) return null;

  const now = Date.now();
  const total = Math.max(1, Math.round((e - s) / WEEK_MS));
  const elapsed = Math.min(Math.max(0, now - s), e - s);
  const pct = Math.round((elapsed / (e - s)) * 100);
  const week = Math.min(total, Math.max(1, Math.ceil(elapsed / WEEK_MS) || 1));
  const remaining = Math.max(0, Math.ceil((e - now) / WEEK_MS));
  return { week, total, remaining, pct };
}

/** "185000" → "185k"; "150" → "150". */
function short(v: string): string {
  const n = Number(v.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n)) return v;
  return n >= 1000 ? `${Math.round(n / 1000)}k` : String(n);
}

/** Format a comp range like "$150–185k/yr" or "$80/hr". */
export function formatComp(c: {
  compType: string | null;
  compMin: string | null;
  compMax: string | null;
}): string {
  if (!c.compMin && !c.compMax) return "—";
  const unit = c.compType === "Hourly" ? "/hr" : c.compType === "Yearly" ? "/yr" : "";
  const lo = c.compMin ? short(c.compMin) : null;
  const hi = c.compMax ? short(c.compMax) : null;
  const range = lo && hi ? `${lo}–${hi}` : (lo ?? hi);
  return `$${range}${unit}`;
}

/** Relative "posted" label from an ISO date. */
export function postedAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (Number.isNaN(days)) return "—";
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}
