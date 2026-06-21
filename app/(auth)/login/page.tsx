import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import type { Screen } from "@/components/auth/types";

export const metadata: Metadata = {
  title: "Sign in · Technograph Employee Portal",
  description:
    "Sign in to the Technograph employee portal to log time, track pay, and line up your next engagement.",
};

const SCREENS: Screen[] = ["signin", "forgot", "verify"];

export default function LoginPage({
  searchParams,
}: {
  searchParams: { screen?: string };
}) {
  const requested = searchParams.screen as Screen | undefined;
  const initial: Screen =
    requested && SCREENS.includes(requested) ? requested : "signin";
  return <AuthShell initial={initial} />;
}
