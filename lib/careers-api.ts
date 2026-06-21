// Public client for the careers board — no auth required.
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

export interface PublicJob {
  jobCode: string;
  title: string;
  department: string | null;
  engagementType: string | null;
  location: string | null;
  summary: string | null;
  responsibilities: string | null;
  stack: string[];
}

export interface ApplyInput {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  years?: number;
  linkedin?: string;
  // Optional résumé (base64-encoded).
  resumeName?: string;
  resumeMime?: string;
  resumeData?: string;
}

export const careersApi = {
  listJobs: () =>
    request<{ jobs: PublicJob[] }>("/careers/jobs").then((r) => r.jobs),

  getJob: (code: string) =>
    request<PublicJob>(`/careers/jobs/${encodeURIComponent(code)}`),

  apply: (code: string, body: ApplyInput) =>
    request<{ ok: boolean; applicationCode: string }>(
      `/careers/jobs/${encodeURIComponent(code)}/apply`,
      { method: "POST", body },
    ),
};
