"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authApi, ApiError, isAuthenticated } from "@/lib/auth-api";
import { completeLogin } from "@/lib/session";
import { AuthHead } from "../AuthChrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { GoFn } from "../types";

export function SignIn({ go }: { go: GoFn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
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
    <>
      <AuthHead
        eyebrow="Welcome back"
        title="Sign in to Technograph"
        sub="Use your work email to access the portal."
      />
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label>Work email</Label>
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <Checkbox checked={keep} onCheckedChange={(v) => setKeep(v === true)} />
            Keep me signed in
          </label>
          <button
            type="button"
            className="font-medium text-primary hover:underline"
            onClick={() => go("forgot", { email })}
          >
            Forgot password?
          </button>
        </div>
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        <Button type="submit" variant="navy" size="lg" className="w-full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-xs text-muted-foreground">
        Technograph accounts are created by invitation. Check your email for an onboarding
        link, or contact your administrator.
      </p>
    </>
  );
}
