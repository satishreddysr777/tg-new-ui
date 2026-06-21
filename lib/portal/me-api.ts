// Client for the signed-in employee's own profile (Employee Console).
// Same-origin; the httpOnly session cookie authorizes each request.
import { ApiError, type Role } from "@/lib/auth-api";

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

export type EmployeeStatus = "Active" | "Onboarding" | "On bench";

/** The signed-in user's full profile, as returned by GET /me. */
export interface MeProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  phoneHint: string;
  clientId: string | null;
  clientName: string | null;
  employeeCode: string | null;
  title: string | null;
  employmentType: string | null;
  status: EmployeeStatus | null;
  billRate: string | null;
  payRate: string | null;
  managerName: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  stack: string[];
  createdAt: string;
}

export interface CompleteOnboardingInput {
  name: string;
  phone: string;
  location: string;
  stack: string[];
}

/** A published role as shown in the portal, scored against the employee. */
export interface PortalRole {
  jobCode: string;
  title: string;
  clientName: string | null;
  department: string | null;
  engagementType: string | null;
  location: string | null;
  compType: string | null;
  compMin: string | null;
  compMax: string | null;
  stack: string[];
  summary: string | null;
  responsibilities: string | null;
  matchPct: number;
  applied: boolean;
  createdAt: string;
}

export interface ApplyToRoleInput {
  summary?: string;
  compAsk?: string;
  linkedin?: string;
  // Optional résumé (base64-encoded).
  resumeName?: string;
  resumeMime?: string;
  resumeData?: string;
}

/** Inline résumé URL for one of the employee's own applications. */
export function resumeUrl(applicationId: string): string {
  return `${API_BASE}/me/applications/${encodeURIComponent(applicationId)}/resume`;
}

export interface ApplicationExperience {
  title: string;
  company: string;
  period: string;
  detail: string;
}

export type ApplicationStage =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Hired"
  | "Rejected";

/** One of the employee's own applications, joined with its job. */
export interface PortalApplication {
  id: string;
  applicationCode: string;
  jobId: string;
  jobCode: string;
  jobTitle: string;
  jobClientName: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  source: string | null;
  years: number | null;
  compAsk: string | null;
  matchPct: number | null;
  stage: ApplicationStage;
  summary: string | null;
  skills: string[];
  linkedin: string | null;
  resumeName: string | null;
  experience: ApplicationExperience[];
  appliedAt: string;
  createdAt: string;
}

export const meApi = {
  get: () => request<MeProfile>("/me"),

  completeOnboarding: (body: CompleteOnboardingInput) =>
    request<MeProfile>("/me/onboarding", { method: "PATCH", body }),

  roles: () =>
    request<{ roles: PortalRole[] }>("/me/roles").then((r) => r.roles),

  applyToRole: (code: string, body: ApplyToRoleInput = {}) =>
    request<{ ok: boolean; applicationCode: string }>(
      `/me/roles/${encodeURIComponent(code)}/apply`,
      { method: "POST", body },
    ),

  applications: () =>
    request<{ applications: PortalApplication[] }>("/me/applications").then(
      (r) => r.applications,
    ),
};

export const STAGES: ApplicationStage[] = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
];

export const stageColor: Record<ApplicationStage, string> = {
  Applied: "var(--copper)",
  Screening: "var(--plum)",
  Interview: "var(--teal)",
  Offer: "var(--ok)",
  Hired: "var(--ink)",
  Rejected: "var(--muted-2)",
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
