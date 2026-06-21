"use client";

import { useState } from "react";
import {
  authApi,
  ApiError,
  type InvitePrefill,
} from "@/lib/auth-api";
import { completeLogin } from "@/lib/session";
import { Field, PasswordToggle, usePasswordToggle } from "../fields";
import { scorePassword } from "../passwordStrength";

const roleLabel: Record<string, string> = {
  EMPLOYEE: "Employee",
  EMPLOYER: "Talent team",
  ADMIN: "Admin",
};

function initials(name: string) {
  return (
    name
      .split(" ")
      .map((p) => p[0] ?? "")
      .slice(0, 2)
      .join("")
      .toUpperCase() || "TG"
  );
}

/**
 * Invite onboarding form. Reached only via a valid magic-link token; the email
 * is fixed by the invite and the account's role/client are shown read-only.
 */
export function SignUp({
  token,
  prefill,
}: {
  token: string;
  prefill: InvitePrefill;
}) {
  const pw = usePasswordToggle();
  const [firstName, setFirstName] = useState(prefill.firstName ?? "");
  const [lastName, setLastName] = useState(prefill.lastName ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(true);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const strength = scorePassword(password);
  const context =
    prefill.role === "EMPLOYEE" && prefill.clientName
      ? prefill.clientName
      : roleLabel[prefill.role] ?? prefill.role;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    if (!firstName.trim() || !lastName.trim() || !password || !confirmPassword) {
      setError("Please complete every field.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (!agree) {
      setError("Please accept the Terms and Privacy Policy.");
      return;
    }
    setBusy(true);
    try {
      const res = await authApi.acceptInvite({
        token,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password,
      });
      completeLogin(res.user);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't reach the server. Try again.",
      );
      setBusy(false);
    }
  }

  return (
    <form className="panel-inner" onSubmit={submit} noValidate>
      <span className="eyebrow">
        <span className="tick" />
        Activate your profile
      </span>
      <h2>Create your account</h2>

      <div className="invite">
        <span className="av av-sm">{initials(prefill.name ?? prefill.email)}</span>
        <div
          style={{ fontSize: 12.5, color: "var(--copper-deep)", lineHeight: 1.4 }}
        >
          You&apos;ve been invited to{" "}
          <strong>{context}</strong>
          <br />
          <span className="mono" style={{ fontSize: 10.5 }}>
            {roleLabel[prefill.role]?.toUpperCase() ?? prefill.role}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Field
              label="First name"
              autoComplete="given-name"
              value={firstName}
              onChange={setFirstName}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Field
              label="Last name"
              autoComplete="family-name"
              value={lastName}
              onChange={setLastName}
            />
          </div>
        </div>
        <div>
          <label className="field-label">Work email</label>
          <input
            className="input"
            type="email"
            value={prefill.email}
            readOnly
            aria-readonly="true"
            style={{ opacity: 0.7, cursor: "not-allowed" }}
          />
        </div>
        <Field
          label="Create password"
          type={pw.show ? "text" : "password"}
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          right={<PasswordToggle show={pw.show} onToggle={pw.toggle} />}
        />
        <Field
          label="Confirm password"
          type={pw.show ? "text" : "password"}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={
            confirmPassword && password !== confirmPassword
              ? "Passwords don't match."
              : undefined
          }
        />

        <div>
          <div className="between" style={{ marginBottom: 6 }}>
            <span
              className="mono"
              style={{ fontSize: 9.5, letterSpacing: "0.08em", color: "var(--muted)" }}
            >
              STRENGTH
            </span>
            <span
              className="mono"
              style={{
                fontSize: 9.5,
                letterSpacing: "0.08em",
                color: strength.score >= 3 ? "var(--ok)" : "var(--muted)",
              }}
            >
              {strength.label}
            </span>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: i < strength.score ? "var(--ok)" : "var(--paper-3)",
                }}
              />
            ))}
          </div>
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 9,
            fontSize: 12.5,
            color: "var(--ink-2)",
            cursor: "pointer",
            lineHeight: 1.45,
          }}
        >
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            style={{
              accentColor: "var(--copper)",
              width: 15,
              height: 15,
              marginTop: 1,
              flex: "none",
            }}
          />
          <span>
            I agree to the{" "}
            <a className="link" style={{ fontSize: 12.5 }} href="#">
              Terms
            </a>{" "}
            and{" "}
            <a className="link" style={{ fontSize: 12.5 }} href="#">
              Privacy Policy
            </a>
            .
          </span>
        </label>
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
        {busy ? "Creating…" : "Create account"}
      </button>

      <p
        style={{
          textAlign: "center",
          fontSize: 13,
          color: "var(--muted)",
          marginTop: 22,
        }}
      >
        Already have an account?{" "}
        <a className="link" style={{ fontSize: 13, display: "inline-flex" }} href="/login">
          Sign in
        </a>
      </p>
    </form>
  );
}
