"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthChrome, AuthHead } from "@/components/auth/AuthChrome";
import { Button } from "@/components/ui/button";
import { SignUp } from "@/components/auth/screens/SignUp";
import { authApi, ApiError, type InvitePrefill } from "@/lib/auth-api";

function OnboardInner() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [prefill, setPrefill] = useState<InvitePrefill | null>(null);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!token) {
      setError("This onboarding link is missing its token.");
      setLoading(false);
      return;
    }
    authApi
      .getInvite(token)
      .then((p) => {
        if (active) setPrefill(p);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof ApiError
              ? err.message
              : "This invite link is invalid or has expired.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <AuthChrome>
      {loading && (
        <AuthHead eyebrow="Onboarding" title="Checking your invite…" />
      )}

      {!loading && error && (
        <>
          <AuthHead
            eyebrow="Onboarding"
            title="This link can't be used"
            sub={`${error} Ask your administrator to send a fresh invite.`}
          />
          <Button asChild variant="outline" className="mt-6">
            <a href="/login">Back to sign in</a>
          </Button>
        </>
      )}

      {!loading && !error && prefill && <SignUp token={token} prefill={prefill} />}
    </AuthChrome>
  );
}

export default function OnboardPage() {
  return (
    <Suspense fallback={null}>
      <OnboardInner />
    </Suspense>
  );
}
