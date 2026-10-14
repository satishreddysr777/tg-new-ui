"use client";

import { useState } from "react";
import { MailCheck } from "lucide-react";
import { authApi, ApiError } from "@/lib/auth-api";
import { AuthHead } from "../AuthChrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GoFn, AuthContext } from "../types";

export function Forgot({ go, ctx }: { go: GoFn; ctx: AuthContext }) {
  const [email, setEmail] = useState(ctx.email || "");
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
        setSent(true);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="mb-6 text-sm font-medium text-muted-foreground hover:text-foreground"
        onClick={() => go("signin", { email })}
      >
        ← Back to sign in
      </button>

      {sent ? (
        <div className="text-center">
          <MailCheck className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-5 text-2xl font-semibold text-navy">Check your inbox</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a secure reset link to{" "}
            <strong className="text-foreground">{email}</strong>. It expires in 30 minutes.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-6 w-full"
            onClick={() => go("signin", { email })}
          >
            Back to sign in
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Didn&apos;t get it?{" "}
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => setSent(false)}
            >
              Resend
            </button>
          </p>
        </div>
      ) : (
        <>
          <AuthHead
            eyebrow="Account recovery"
            title="Reset your password"
            sub="Enter your work email and we'll send a secure link."
          />
          <form onSubmit={submit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label>Work email</Label>
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" variant="navy" size="lg" className="w-full" disabled={busy}>
              {busy ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        </>
      )}
    </>
  );
}
