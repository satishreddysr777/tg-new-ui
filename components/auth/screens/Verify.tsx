"use client";

import { useState } from "react";
import { authApi, ApiError } from "@/lib/auth-api";
import { completeLogin } from "@/lib/session";
import { AuthHead } from "../AuthChrome";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import type { GoFn, AuthContext } from "../types";

const LEN = 6;

export function Verify({ go, ctx }: { go: GoFn; ctx: AuthContext }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const hint = ctx.hint ?? "···· ·· 0163";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (value.length !== LEN) return;
    setError(undefined);
    setBusy(true);
    try {
      if (ctx.challengeId) {
        const res = await authApi.verify({
          challengeId: ctx.challengeId,
          code: value,
        });
        completeLogin(res.user);
        return;
      }
      go("signin", {});
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "That code didn't match. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <button
        type="button"
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
        onClick={() => go("signin")}
      >
        ← Back
      </button>
      <AuthHead
        eyebrow="Two-factor"
        title="Verify it's you"
        sub={
          <>
            Enter the 6-digit code we texted to{" "}
            <strong className="text-foreground">{hint}</strong>.
          </>
        }
      />
      <InputOTP maxLength={LEN} value={value} onChange={setValue}>
        <InputOTPGroup>
          {Array.from({ length: LEN }).map((_, i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      <Button
        type="submit"
        variant="navy"
        size="lg"
        className="w-full"
        disabled={value.length !== LEN || busy}
      >
        {busy ? "Verifying…" : "Verify & continue"}
      </Button>
    </form>
  );
}
