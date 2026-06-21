// Public client for the marketing contact form — no auth required.
import { ApiError } from "@/lib/auth-api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

export interface ContactInput {
  intent?: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
}

export const contactApi = {
  async submit(body: ContactInput): Promise<{ ok: boolean }> {
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
    return payload as { ok: boolean };
  },
};
