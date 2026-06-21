// Client for the staff-only job (requisition) endpoints.
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

export type JobStatus = "Draft" | "Published";

export interface Job {
  id: string;
  jobCode: string;
  title: string;
  clientId: string | null;
  clientName: string | null;
  hiringManager: string | null;
  department: string | null;
  engagementType: string | null;
  location: string | null;
  headcount: number;
  compType: string | null;
  compMin: string | null;
  compMax: string | null;
  stack: string[];
  summary: string | null;
  responsibilities: string | null;
  status: string;
  createdAt: string;
}

export interface CreateJobInput {
  title: string;
  status: JobStatus;
  clientId?: string;
  hiringManager?: string;
  department?: string;
  engagementType?: string;
  location?: string;
  headcount?: number;
  compType?: string;
  compMin?: string;
  compMax?: string;
  stack?: string[];
  summary?: string;
  responsibilities?: string;
}

export type UpdateJobInput = Partial<CreateJobInput>;

export const jobsApi = {
  list: () => request<{ jobs: Job[] }>("/jobs").then((r) => r.jobs),

  get: (idOrCode: string) =>
    request<Job>(`/jobs/${encodeURIComponent(idOrCode)}`),

  nextCode: () =>
    request<{ code: string }>("/jobs/next-code").then((r) => r.code),

  create: (body: CreateJobInput) =>
    request<Job>("/jobs", { method: "POST", body }),

  update: (idOrCode: string, body: UpdateJobInput) =>
    request<Job>(`/jobs/${encodeURIComponent(idOrCode)}`, {
      method: "PATCH",
      body,
    }),
};
