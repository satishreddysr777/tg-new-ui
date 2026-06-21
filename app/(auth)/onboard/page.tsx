"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthAside } from "@/components/auth/AuthAside";
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
    <div className="tg-auth">
      <div className="split">
        <AuthAside />
        <div className="panel">
          {loading && (
            <div className="panel-inner">
              <span className="eyebrow">
                <span className="tick" />
                Onboarding
              </span>
              <h2>Checking your invite…</h2>
            </div>
          )}

          {!loading && error && (
            <div className="panel-inner">
              <span className="eyebrow">
                <span className="tick" />
                Onboarding
              </span>
              <h2>This link can&apos;t be used</h2>
              <p className="sub" style={{ marginTop: 12, lineHeight: 1.6 }}>
                {error} Ask your administrator to send a fresh invite.
              </p>
              <a
                className="btn btn-ghost"
                href="/login"
                style={{ marginTop: 22, width: "fit-content" }}
              >
                Back to sign in
              </a>
            </div>
          )}

          {!loading && !error && prefill && (
            <SignUp token={token} prefill={prefill} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardPage() {
  return (
    <Suspense fallback={null}>
      <OnboardInner />
    </Suspense>
  );
}
