"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/portal/Sidebar";
import { meApi, type MeProfile } from "@/lib/portal/me-api";
import { MeProvider } from "@/lib/portal/me-context";

const ONBOARDING_PATH = "/portal/onboarding";

/**
 * Gates the Employee Console on onboarding completion. New hires (status
 * "Onboarding") are forced onto the onboarding screen before they can reach the
 * rest of the portal; once active, the onboarding route bounces back home.
 * Renders the full-screen onboarding flow without the sidebar chrome.
 */
export function PortalGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [me, setMe] = useState<MeProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    meApi
      .get()
      .then((p) => active && setMe(p))
      .catch(() => active && setMe(null))
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, []);

  const onboarding = me?.status === "Onboarding";
  const onOnboardingRoute = pathname === ONBOARDING_PATH;

  useEffect(() => {
    if (!loaded || !me) return;
    if (onboarding && !onOnboardingRoute) {
      router.replace(ONBOARDING_PATH);
    } else if (!onboarding && onOnboardingRoute) {
      router.replace("/portal");
    }
  }, [loaded, me, onboarding, onOnboardingRoute, router]);

  // Loading, or a redirect is pending — show a calm placeholder rather than
  // flashing the wrong screen.
  const redirecting =
    loaded && me && ((onboarding && !onOnboardingRoute) || (!onboarding && onOnboardingRoute));
  if (!loaded || redirecting) {
    return (
      <div
        style={{
          height: "100%",
          display: "grid",
          placeItems: "center",
          color: "var(--muted)",
        }}
      >
        Loading your workspace…
      </div>
    );
  }

  // Onboarding screen renders full-bleed, without the portal sidebar.
  if (onboarding && onOnboardingRoute) {
    return <>{children}</>;
  }

  // `me` is guaranteed non-null here: the loading/redirect guards above return
  // early while it resolves.
  if (!me) return null;

  return (
    <MeProvider value={me}>
      <div className="app">
        <Sidebar />
        <div className="main">{children}</div>
      </div>
    </MeProvider>
  );
}
