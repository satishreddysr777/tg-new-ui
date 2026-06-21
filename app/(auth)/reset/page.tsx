"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthAside } from "@/components/auth/AuthAside";
import {
  Field,
  PasswordToggle,
  usePasswordToggle,
} from "@/components/auth/fields";
import { scorePassword } from "@/components/auth/passwordStrength";
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

  const strength = scorePassword(password);

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
    <div className="tg-auth">
      <div className="split">
        <AuthAside />
        <div className="panel">
          <div className="panel-inner">
            <span className="eyebrow">
              <span className="tick" />
              Reset password
            </span>

            {checking && <h2>Checking your link…</h2>}

            {!checking && error && !valid && (
              <>
                <h2>This link can&apos;t be used</h2>
                <p className="sub" style={{ marginTop: 12, lineHeight: 1.6 }}>
                  {error}
                </p>
                <a
                  className="btn btn-ghost"
                  href="/login?screen=forgot"
                  style={{ marginTop: 22, width: "fit-content" }}
                >
                  Request a new link
                </a>
              </>
            )}

            {!checking && valid && done && (
              <>
                <h2>Password updated</h2>
                <p className="sub" style={{ marginTop: 12, lineHeight: 1.6 }}>
                  You can now sign in with your new password.
                </p>
                <a
                  className="btn"
                  href="/login"
                  style={{ marginTop: 22, width: "fit-content" }}
                >
                  Go to sign in
                </a>
              </>
            )}

            {!checking && valid && !done && (
              <form onSubmit={submit} noValidate style={{ marginTop: 4 }}>
                <h2>Choose a new password</h2>
                <p className="sub" style={{ margin: "10px 0 22px" }}>
                  Pick something strong you haven&apos;t used before.
                </p>
                <Field
                  label="New password"
                  type={pw.show ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={setPassword}
                  right={<PasswordToggle show={pw.show} onToggle={pw.toggle} />}
                />
                <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        background:
                          i < strength.score ? "var(--ok)" : "var(--paper-3)",
                      }}
                    />
                  ))}
                </div>

                {error && (
                  <p className="err" role="alert" style={{ marginTop: 14 }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn"
                  style={{ width: "100%", marginTop: 22 }}
                  disabled={busy}
                >
                  {busy ? "Saving…" : "Update password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPage() {
  return (
    <Suspense fallback={null}>
      <ResetInner />
    </Suspense>
  );
}
