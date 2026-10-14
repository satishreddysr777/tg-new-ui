"use client";

import { useState } from "react";
import { Topbar } from "@/components/portal/Topbar";
import { Body, Panel, Facts } from "@/components/console/ui";
import { Button } from "@/components/ui/button";
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

  return (
    <>
      <Topbar
        kicker={`Account · ${me.employeeCode ?? "Employee"}`}
        title="Account & security"
        sub="Manage your sign-in details"
      />
      <Body className="max-w-3xl">
        <Panel title="Profile">
          <Facts
            items={[
              ["Name", me.name],
              ["Email", me.email],
              ["Employee code", me.employeeCode ?? "—"],
              ["Role", me.title ?? "Employee"],
            ]}
          />
        </Panel>
        <Panel title="Password">
          <h3 className="font-semibold text-navy">Change your password</h3>
          {status === "sent" ? (
            <>
              <p className="mt-2 text-sm text-muted-foreground">
                Check your inbox — we sent a reset link to{" "}
                <b className="text-foreground">{me.email}</b>. Open it to choose
                a new password.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-3 text-sm font-medium text-primary hover:underline"
              >
                Didn&apos;t get it? Send again
              </button>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted-foreground">
                For your security, password changes go through a verified email
                link. We&apos;ll send a secure reset link to{" "}
                <b className="text-foreground">{me.email}</b> — it expires in 30
                minutes.
              </p>
              {error && (
                <p className="mt-2 text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
              <Button
                variant="navy"
                className="mt-4"
                onClick={sendResetLink}
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Email me a reset link"}
              </Button>
            </>
          )}
        </Panel>
      </Body>
    </>
  );
}
