"use client";

import { createContext, useContext } from "react";
import type { MeProfile } from "@/lib/portal/me-api";

/**
 * The signed-in employee's profile, fetched once by PortalGate and shared with
 * the sidebar and every console page so they render real data without each
 * issuing their own /me request.
 */
const MeContext = createContext<MeProfile | null>(null);

export function MeProvider({
  value,
  children,
}: {
  value: MeProfile;
  children: React.ReactNode;
}) {
  return <MeContext.Provider value={value}>{children}</MeContext.Provider>;
}

/** Read the signed-in employee. Throws if used outside the portal shell. */
export function useMe(): MeProfile {
  const me = useContext(MeContext);
  if (!me) {
    throw new Error("useMe must be used within the portal shell.");
  }
  return me;
}

/** First name for greetings, e.g. "Renee Boateng" → "Renee". */
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}
