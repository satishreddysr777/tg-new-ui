"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthChrome, AuthHead, StrengthMeter } from "@/components/auth/AuthChrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordToggle, usePasswordToggle } from "@/components/auth/fields";
import { authApi, ApiError } from "@/lib/auth-api";

function ResetInner() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const pw = usePasswordToggle();

  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    if (!token) {
      setChecking(false);
      setError("This reset link is missing its token.");
      return;
    }
    authApi
      .validateReset(token)
      .then(() => active && setValid(true))
      .catch((err) =>
        active &&
        setError(
          err instanceof ApiError
            ? err.message
            : "This reset link is invalid or has expired.",
        ),
      )
      .finally(() => active && setChecking(false));
    return () => {
      active = false;
    };
  }, [token]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      await authApi.resetPassword({ token, password });
      setDone(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't reset the password.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthChrome>
      {checking && <AuthHead eyebrow="Reset password" title="Checking your link…" />}

      {!checking && error && !valid && (
        <>
          <AuthHead eyebrow="Reset password" title="This link can't be used" sub={error} />
          <Button asChild variant="outline" className="mt-6">
            <a href="/login?screen=forgot">Request a new link</a>
          </Button>
        </>
      )}

      {!checking && valid && done && (
        <>
          <AuthHead
            eyebrow="Reset password"
            title="Password updated"
            sub="You can now sign in with your new password."
          />
          <Button asChild variant="navy" className="mt-6">
            <a href="/login">Go to sign in</a>
          </Button>
        </>
      )}

      {!checking && valid && !done && (
        <>
          <AuthHead
            eyebrow="Reset password"
            title="Choose a new password"
            sub="Pick something strong you haven't used before."
          />
          <form onSubmit={submit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label>New password</Label>
              <div className="relative">
                <Input
                  type={pw.show ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <PasswordToggle show={pw.show} onToggle={pw.toggle} />
                </div>
              </div>
              <StrengthMeter pw={password} />
            </div>
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            <Button type="submit" variant="navy" size="lg" className="w-full" disabled={busy}>
              {busy ? "Saving…" : "Update password"}
            </Button>
          </form>
        </>
      )}
    </AuthChrome>
  );
}

export default function ResetPage() {
  return (
    <Suspense fallback={null}>
      <ResetInner />
    </Suspense>
  );
}
