// Client for the admin-only invite + client endpoints (Employer Console).
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

export type InviteStatus = "PENDING" | "ACCEPTED" | "REVOKED";

export interface Invite {
  id: string;
  email: string;
  role: Role;
  clientId: string | null;
  name: string | null;
  invitedBy: string | null;
  status: InviteStatus;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  location: string | null;
  contactEmail: string | null;
  createdAt: string;
}

/** A client in the directory list, with its placed-employee count. */
export interface ClientRow extends Client {
  employeeCount: number;
}

export interface CreateClientInput {
  name: string;
  location?: string;
  contactEmail?: string;
}

export interface UpdateClientInput {
  name?: string;
  location?: string;
  contactEmail?: string;
}

export type EmploymentType = "W-2" | "1099";

export interface CreateInviteInput {
  email: string;
  role: Role;
  clientId?: string;
  name?: string;
  // Placement + compensation (employee invites only).
  title?: string;
  employmentType?: EmploymentType;
  managerName?: string;
  billRate?: string;
  payRate?: string;
  location?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export interface Manager {
  id: string;
  name: string;
  role: Role;
}

/** The signed-in staff member (subset of GET /me). */
export interface StaffProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export const employerApi = {
  me: () => request<StaffProfile>("/me"),

  listClients: () =>
    request<{ clients: ClientRow[] }>("/clients").then((r) => r.clients),

  listManagers: () =>
    request<{ managers: Manager[] }>("/managers").then((r) => r.managers),

  createClient: (body: CreateClientInput) =>
    request<Client>("/clients", { method: "POST", body }),

  updateClient: (id: string, body: UpdateClientInput) =>
    request<Client>(`/clients/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body,
    }),

  deleteClient: (id: string) =>
    request<{ ok: boolean }>(`/clients/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  listInvites: (status?: InviteStatus) =>
    request<{ invites: Invite[] }>(
      `/invites${status ? `?status=${status}` : ""}`,
    ).then((r) => r.invites),

  createInvite: (body: CreateInviteInput) =>
    request<{ invite: Invite; link: string }>("/invites", {
      method: "POST",
      body,
    }),

  revokeInvite: (id: string) =>
    request<{ ok: boolean }>(
      `/invites/${encodeURIComponent(id)}/revoke`,
      { method: "POST" },
    ),
};
