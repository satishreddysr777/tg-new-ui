// Client for the staff-only employee directory endpoints.
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

export type Role = "EMPLOYEE" | "EMPLOYER" | "ADMIN";
export type EmploymentType = "W-2" | "1099";
export type EmployeeStatus = "Active" | "Onboarding" | "On bench";

export interface Employee {
  id: string;
  employeeCode: string | null;
  name: string;
  email: string;
  role: Role;
  title: string | null;
  employmentType: EmploymentType | null;
  status: EmployeeStatus | null;
  billRate: string | null;
  payRate: string | null;
  managerName: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  stack: string[];
  clientId: string | null;
  clientName: string | null;
  createdAt: string;
}

export interface EngagementHistory {
  id: string;
  employeeId: string | null;
  clientId: string | null;
  clientName: string;
  title: string | null;
  startDate: string | null;
  endDate: string;
  billRate: string | null;
  payRate: string | null;
  reason: string | null;
  createdAt: string;
}

export const employeesApi = {
  list: () =>
    request<{ employees: Employee[] }>("/employees").then((r) => r.employees),

  get: (idOrCode: string) =>
    request<Employee>(`/employees/${encodeURIComponent(idOrCode)}`),

  engagements: (idOrCode: string) =>
    request<{ engagements: EngagementHistory[] }>(
      `/employees/${encodeURIComponent(idOrCode)}/engagements`,
    ).then((r) => r.engagements),

  endEngagement: (
    idOrCode: string,
    body: { endDate: string; reason?: string },
  ) =>
    request<Employee>(
      `/employees/${encodeURIComponent(idOrCode)}/end-engagement`,
      { method: "PATCH", body },
    ),

  remove: (idOrCode: string) =>
    request<{ ok: boolean }>(`/employees/${encodeURIComponent(idOrCode)}`, {
      method: "DELETE",
    }),
};

/** "2026-01-13T06:00:00Z" → "Jan 13, 2026"; null → "—". */
export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export const displayClient = (e: Pick<Employee, "clientName" | "status">) =>
  e.clientName ?? (e.status === "On bench" ? "— On bench" : "—");
