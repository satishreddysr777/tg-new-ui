// Client for the staff-only application (candidate) endpoints.
import { ApiError } from "@/lib/auth-api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

async function request<T>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: init.method ?? "GET",
    headers: init.body ? { "Content-Type": "application/json" } : undefined,
    body: init.body ? JSON.stringify(init.body) : undefined,
    credentials: "include",
  });
  const payload = (await res.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  if (!res.ok) {
    throw new ApiError(
      (payload.message as string) ?? "Something went wrong.",
      res.status,
      payload.code as string | undefined,
    );
  }
  return payload as T;
}

export type Stage =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Hired"
  | "Rejected";

export const STAGES: Stage[] = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
];

export interface Experience {
  title: string;
  company: string;
  period: string;
  detail: string;
}

export interface Application {
  id: string;
  applicationCode: string;
  jobId: string;
  name: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  source: string | null;
  years: number | null;
  compAsk: string | null;
  matchPct: number | null;
  stage: Stage;
  summary: string | null;
  skills: string[];
  linkedin: string | null;
  resumeName: string | null;
  experience: Experience[];
  appliedAt: string;
  createdAt: string;
}

export interface CreateApplicationInput {
  name: string;
  stage?: Stage;
  email?: string;
  phone?: string;
  location?: string;
  source?: string;
  years?: number;
  compAsk?: string;
  matchPct?: number;
  summary?: string;
  skills?: string[];
  linkedin?: string;
  experience?: Experience[];
}

export const applicationsApi = {
  listByJob: (jobIdOrCode: string) =>
    request<{ applications: Application[] }>(
      `/jobs/${encodeURIComponent(jobIdOrCode)}/applications`,
    ).then((r) => r.applications),

  create: (jobIdOrCode: string, body: CreateApplicationInput) =>
    request<Application>(
      `/jobs/${encodeURIComponent(jobIdOrCode)}/applications`,
      { method: "POST", body },
    ),

  updateStage: (id: string, stage: Stage) =>
    request<Application>(`/applications/${encodeURIComponent(id)}/stage`, {
      method: "PATCH",
      body: { stage },
    }),
};

/** Relative "applied" label from an ISO date. */
export function appliedAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return "—";
  const h = Math.floor(ms / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "1d ago" : `${d}d ago`;
}

export const stageColor: Record<Stage, string> = {
  Applied: "var(--copper)",
  Screening: "var(--plum)",
  Interview: "var(--teal)",
  Offer: "var(--ok)",
  Hired: "var(--ink)",
  Rejected: "var(--muted-2)",
};
