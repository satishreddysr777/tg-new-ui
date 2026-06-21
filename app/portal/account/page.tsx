"use client";

import { useState } from "react";
import { Topbar } from "@/components/portal/Topbar";
import { Icon } from "@/components/portal/icons";
import { useMe } from "@/lib/portal/me-context";
import { authApi, ApiError } from "@/lib/auth-api";

type Status = "idle" | "sending" | "sent" | "error";

export default function AccountPage() {
  const me = useMe();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>();

  async function sendResetLink() {
    if (status === "sending") return;
    setError(undefined);
    setStatus("sending");
    try {
      await authApi.requestReset({ email: me.email });
      setStatus("sent");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't send the reset link. Try again.",
      );
      setStatus("error");
    }
  }

  const facts: [string, string][] = [
    ["Name", me.name],
    ["Email", me.email],
    ["Employee code", me.employeeCode ?? "—"],
    ["Role", me.title ?? "Employee"],
  ];

  return (
    <>
      <Topbar
        kicker={`Account · ${me.employeeCode ?? "Employee"}`}
        title="Account & security"
        sub="Manage your sign-in details"
      />
      <div className="content">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, alignItems: "start", maxWidth: 920 }}>
          {/* profile */}
          <div className="card">
            <span className="eyebrow">
              <span className="tick" />
              Profile
            </span>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 13, fontSize: 13 }}>
              {facts.map(([k, v]) => (
                <div key={k} className="between" style={{ alignItems: "baseline", gap: 12 }}>
                  <span className="eyebrow" style={{ gap: 0 }}>{k}</span>
                  <span style={{ fontWeight: 500, textAlign: "right", wordBreak: "break-word" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* password */}
          <div className="card">
            <span className="eyebrow">
              <span className="tick" />
              Password
            </span>
            <div style={{ display: "flex", gap: 13, alignItems: "flex-start", marginTop: 16 }}>
              <span
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  background: "var(--copper-soft)",
                  color: "var(--copper-deep)",
                  display: "grid",
                  placeItems: "center",
                  flex: "none",
                }}
              >
                <Icon name="key" size={20} />
              </span>
              <div>
                <h3 style={{ fontSize: 17 }}>Change your password</h3>
                <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, lineHeight: 1.6 }}>
                  For your security, password changes go through a verified email
                  link. We&apos;ll send a secure reset link to{" "}
                  <strong style={{ color: "var(--ink)" }}>{me.email}</strong> —
                  it expires in 30 minutes.
                </p>
              </div>
            </div>

            {status === "sent" ? (
              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  padding: "13px 15px",
                  borderRadius: "var(--r-sm)",
                  background: "var(--ok-soft)",
                  color: "var(--ok)",
                  fontSize: 13,
                  lineHeight: 1.55,
                }}
              >
                <Icon name="check" size={16} style={{ marginTop: 2, flex: "none" }} />
                <span>
                  Check your inbox — we sent a reset link to{" "}
                  <strong>{me.email}</strong>. Open it to choose a new password.
                </span>
              </div>
            ) : (
              <>
                {error && (
                  <p className="err" role="alert" style={{ marginTop: 14 }}>
                    {error}
                  </p>
                )}
                <button
                  className="btn"
                  onClick={sendResetLink}
                  disabled={status === "sending"}
                  style={{ marginTop: 18 }}
                >
                  <Icon name="mail" size={15} />
                  {status === "sending" ? "Sending…" : "Email me a reset link"}
                </button>
              </>
            )}

            {status === "sent" && (
              <button
                className="link-muted"
                onClick={() => setStatus("idle")}
                style={{ marginTop: 14 }}
              >
                Didn&apos;t get it? Send again
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
