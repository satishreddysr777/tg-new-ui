// Thin client for the tg-api auth endpoints.
// Calls are same-origin (proxied to tg-api via next.config rewrites) so the
// httpOnly session cookie is first-party; every request includes credentials.
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

export type Role = "EMPLOYEE" | "EMPLOYER" | "ADMIN";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

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
      (payload.message as string) ?? "Something went wrong. Please try again.",
      res.status,
      payload.code as string | undefined,
    );
  }
  return payload as T;
}

/** The user behind an established session (token lives in an httpOnly cookie). */
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  clientId: string | null;
}

/** Pending 2FA — login needs a follow-up code before a session is granted. */
export interface ChallengeResult {
  challengeId: string;
  method: "sms" | "email";
  hint: string;
}

/** A session was established — the cookie is set; the user is returned. */
export interface SessionResult {
  user: SessionUser;
}

/** login / verify may return either, depending on whether MFA is enabled. */
export type AuthOutcome = ChallengeResult | SessionResult;

export function isAuthenticated(o: AuthOutcome): o is SessionResult {
  return "user" in o;
}

/** Onboarding prefill resolved from a magic-link invite token. */
export interface InvitePrefill {
  email: string;
  role: Role;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  clientName: string | null;
}

export const authApi = {
  signIn: (input: { email: string; password: string }) =>
    request<AuthOutcome>("/auth/login", { method: "POST", body: input }),

  verify: (input: { challengeId: string; code: string }) =>
    request<SessionResult>("/auth/verify", { method: "POST", body: input }),

  requestReset: (input: { email: string }) =>
    request<{ sent: boolean }>("/auth/forgot-password", {
      method: "POST",
      body: input,
    }),

  validateReset: (token: string) =>
    request<{ ok: boolean }>(`/auth/reset/${encodeURIComponent(token)}`),

  resetPassword: (input: { token: string; password: string }) =>
    request<{ ok: boolean }>("/auth/reset-password", {
      method: "POST",
      body: input,
    }),

  logout: () => request<{ ok: boolean }>("/auth/logout", { method: "POST" }),

  getInvite: (token: string) =>
    request<InvitePrefill>(`/auth/invite/${encodeURIComponent(token)}`),

  acceptInvite: (input: {
    token: string;
    firstName: string;
    lastName: string;
    password: string;
  }) =>
    request<SessionResult>("/auth/accept-invite", {
      method: "POST",
      body: input,
    }),
};
