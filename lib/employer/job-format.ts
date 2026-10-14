import type { Job } from "@/lib/employer/jobs-api";

export function shortComp(v: string): string {
  const n = Number(v.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n)) return v;
  return n >= 1000 ? `${Math.round(n / 1000)}k` : String(n);
}

export function formatJobComp(
  j: Pick<Job, "compMin" | "compMax" | "compType">,
): string {
  if (!j.compMin && !j.compMax) return "—";
  const unit = j.compType === "Hourly" ? "/hr" : "";
  const lo = j.compMin ? shortComp(j.compMin) : null;
  const hi = j.compMax ? shortComp(j.compMax) : null;
  const range = lo && hi ? `${lo}–${hi}` : (lo ?? hi);
  return `$${range}${unit}`;
}

export function postedAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (Number.isNaN(days)) return "—";
  if (days <= 0) return "today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}
