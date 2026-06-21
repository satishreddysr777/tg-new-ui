import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "tg_session";
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-only-insecure-change-me-please";
const secret = new TextEncoder().encode(JWT_SECRET);

type Role = "EMPLOYEE" | "EMPLOYER" | "ADMIN";

const homeForRole = (role: Role) =>
  role === "EMPLOYEE" ? "/portal" : "/employer";

/** Verify the session cookie and return the role, or null if absent/invalid. */
async function roleFromRequest(req: NextRequest): Promise<Role | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role;
    if (role === "EMPLOYEE" || role === "EMPLOYER" || role === "ADMIN") {
      return role;
    }
    return null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = await roleFromRequest(req);

  // Not signed in → bounce to login, preserving the intended destination.
  if (!role) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  const isEmployerArea = pathname.startsWith("/employer");
  const isPortalArea = pathname.startsWith("/portal");

  // Staff areas: ADMIN + EMPLOYER only.
  if (isEmployerArea && role === "EMPLOYEE") {
    return NextResponse.redirect(new URL(homeForRole(role), req.url));
  }
  // Employee portal: EMPLOYEE (ADMIN allowed for support); EMPLOYER is staff.
  if (isPortalArea && role === "EMPLOYER") {
    return NextResponse.redirect(new URL(homeForRole(role), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/employer/:path*"],
};
