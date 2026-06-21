// Client-side session helpers. The access token lives in an httpOnly cookie
// set by tg-api (proxied same-origin), so there's nothing to store here — these
// helpers only handle role-based routing and logout.
import { authApi, type Role, type SessionUser } from "@/lib/auth-api";

/** Where a user lands after authenticating, by role. */
export function redirectForRole(role: Role): string {
  return role === "EMPLOYEE" ? "/portal" : "/employer";
}

/** Navigate to the post-login destination for the authenticated user. */
export function completeLogin(user: SessionUser): void {
  window.location.assign(redirectForRole(user.role));
}

/** Clear the server session cookie, then return to the sign-in screen. */
export function logout(): void {
  void authApi
    .logout()
    .catch(() => {
      // Even if the request fails, send the user back to /login.
    })
    .finally(() => {
      window.location.assign("/login");
    });
}
