"use client";

import { useState } from "react";
import { authApi, ApiError } from "@/lib/auth-api";
import { Field } from "../fields";
import { Icon } from "../Icon";
import type { GoFn, AuthContext } from "../types";

export function Forgot({ go, ctx }: { go: GoFn; ctx: AuthContext }) {
  const [email, setEmail] = useState(ctx.email || "renee.boateng@technograph.io");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    if (!email) {
      setError("Enter your work email.");
      return;
    }
    setBusy(true);
    try {
      await authApi.requestReset({ email });
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        // We always confirm — never disclose whether an account exists.
        setSent(true);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel-inner">
      <button
        type="button"
        className="link"
        style={{ fontSize: 12.5, marginBottom: 20 }}
        onClick={() => go("signin", { email })}
      >
        ← Back to sign in
      </button>

      {sent ? (
        <>
          <span className="success-badge">
            <Icon name="check" size={24} />
          </span>
          <h2 style={{ fontSize: 28 }}>Check your inbox</h2>
          <p className="sub" style={{ marginTop: 8, lineHeight: 1.6 }}>
            We sent a secure reset link to{" "}
            <strong style={{ color: "var(--ink)" }}>{email}</strong>. It expires
            in 30 minutes.
          </p>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ width: "100%", marginTop: 24 }}
            onClick={() => go("signin", { email })}
          >
            Back to sign in
          </button>
          <p
            style={{
              textAlign: "center",
              fontSize: 12.5,
              color: "var(--muted)",
              marginTop: 18,
            }}
          >
            Didn&apos;t get it?{" "}
            <button
              type="button"
              className="link"
              style={{ fontSize: 12.5, display: "inline-flex" }}
              onClick={() => setSent(false)}
            >
              Resend
            </button>
          </p>
        </>
      ) : (
        <form onSubmit={submit} noValidate>
          <span className="eyebrow">
            <span className="tick" />
            Account recovery
          </span>
          <h2>Reset your password</h2>
          <p className="sub" style={{ marginBottom: 26 }}>
            Enter your work email and we&apos;ll send a secure link.
          </p>
          <Field
            label="Work email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
            error={error}
          />
          <button
            type="submit"
            className="btn"
            style={{ width: "100%", marginTop: 22 }}
            disabled={busy}
          >
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </div>
  );
}
