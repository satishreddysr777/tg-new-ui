"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authApi, ApiError, type InvitePrefill } from "@/lib/auth-api";
import { completeLogin } from "@/lib/session";
import { AuthHead, StrengthMeter } from "../AuthChrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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

export function SignUp({
  token,
  prefill,
}: {
  token: string;
  prefill: InvitePrefill;
}) {
  const [showPw, setShowPw] = useState(false);
  const [firstName, setFirstName] = useState(prefill.firstName ?? "");
  const [lastName, setLastName] = useState(prefill.lastName ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(true);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

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
    <>
      <AuthHead
        eyebrow="Activate your profile"
        title="Create your account"
        sub={
          <>
            You&apos;ve been invited as{" "}
            <strong className="text-foreground">
              {roleLabel[prefill.role] ?? prefill.role}
            </strong>
            {prefill.role === "EMPLOYEE" && prefill.clientName
              ? ` · ${prefill.clientName}`
              : null}
          </>
        }
      />

      <div className="mb-6 flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 font-mono text-sm font-medium text-primary">
          {initials(prefill.name ?? prefill.email)}
        </span>
        <div className="min-w-0 text-sm">
          <p className="truncate font-medium text-navy">{context}</p>
          <p className="font-mono text-xs text-muted-foreground">{prefill.email}</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>First name</Label>
            <Input
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Last name</Label>
            <Input
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Work email</Label>
          <Input
            type="email"
            value={prefill.email}
            readOnly
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-2">
          <Label>Create password</Label>
          <div className="relative">
            <Input
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <StrengthMeter pw={password} />
        </div>

        <div className="space-y-2">
          <Label>Confirm password</Label>
          <Input
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={
              confirmPassword && password !== confirmPassword ? true : undefined
            }
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-sm text-destructive">Passwords don&apos;t match.</p>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
          <Checkbox
            checked={agree}
            onCheckedChange={(v) => setAgree(v === true)}
            className="mt-0.5"
          />
          <span>
            I agree to the{" "}
            <a href="#" className="font-medium text-primary hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        {error && (
          <p className="text-sm text-destructive" role="alert">{error}</p>
        )}

        <Button type="submit" variant="navy" size="lg" className="w-full" disabled={busy}>
          {busy ? "Creating…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
