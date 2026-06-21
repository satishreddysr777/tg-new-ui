"use client";

import { useState } from "react";
import { authApi, ApiError, isAuthenticated } from "@/lib/auth-api";
import { completeLogin } from "@/lib/session";
import { Field, PasswordToggle, usePasswordToggle } from "../fields";
import type { GoFn } from "../types";

export function SignIn({ go }: { go: GoFn }) {
  const pw = usePasswordToggle();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keep, setKeep] = useState(true);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    if (!email || !password) {
      setError("Enter your work email and password.");
      return;
    }
    setBusy(true);
    try {
      const res = await authApi.signIn({ email, password });
      // MFA off → session cookie set straight away; otherwise do the 2FA step.
      if (isAuthenticated(res)) {
        completeLogin(res.user);
        return;
      }
      go("verify", { email, challengeId: res.challengeId, hint: res.hint });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't reach the server. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="panel-inner" onSubmit={submit} noValidate>
      <span className="eyebrow">
        <span className="tick" />
        Welcome back
      </span>
      <h2>Sign in to Technograph</h2>
      <p className="sub" style={{ marginBottom: 26 }}>
        Use your work email to access the portal.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field
          label="Work email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <Field
          label="Password"
          type={pw.show ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          right={<PasswordToggle show={pw.show} onToggle={pw.toggle} />}
        />
        <div className="between">
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12.5,
              color: "var(--ink-2)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={keep}
              onChange={(e) => setKeep(e.target.checked)}
              style={{ accentColor: "var(--copper)", width: 15, height: 15 }}
            />
            Keep me signed in
          </label>
          <button
            type="button"
            className="link"
            style={{ fontSize: 12.5 }}
            onClick={() => go("forgot", { email })}
          >
            Forgot password?
          </button>
        </div>
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
        {busy ? "Signing in…" : "Sign in"}
      </button>

      <p
        style={{
          textAlign: "center",
          fontSize: 12.5,
          color: "var(--muted-2)",
          marginTop: 24,
          lineHeight: 1.5,
        }}
      >
        Technograph accounts are created by invitation. Check your email for an
        onboarding link, or contact your administrator.
      </p>
    </form>
  );
}
