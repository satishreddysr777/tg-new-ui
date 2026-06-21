// Client for the staff-facing contact-message inbox (Employer Console).
// Same-origin; the httpOnly session cookie authorizes each request.
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

export type ContactStatus = "NEW" | "READ" | "ARCHIVED";

export interface ContactMessage {
  id: string;
  intent: string | null;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string | null;
  status: ContactStatus;
  createdAt: string;
}

export const messagesApi = {
  list: () =>
    request<{ messages: ContactMessage[] }>("/contact/messages").then(
      (r) => r.messages,
    ),

  setStatus: (id: string, status: ContactStatus) =>
    request<ContactMessage>(`/contact/messages/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: { status },
    }),

  remove: (id: string) =>
    request<{ ok: boolean }>(`/contact/messages/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};
