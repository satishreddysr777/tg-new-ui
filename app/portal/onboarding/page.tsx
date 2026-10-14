"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TagInput } from "@/components/console/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/auth-api";
import { meApi, type MeProfile } from "@/lib/portal/me-api";

export default function OnboardingPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [stack, setStack] = useState<string[]>([]);

  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    meApi
      .get()
      .then((p) => {
        if (!active) return;
        setMe(p);
        setName(p.name);
        setLocation(p.location ?? "");
        setStack(p.stack ?? []);
      })
      .catch(() => active && setError("Couldn't load your profile."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    if (!name.trim()) return setError("Please enter your full name.");
    if (phone.replace(/\D/g, "").length < 4)
      return setError("Please enter a contact phone number.");
    if (!location.trim()) return setError("Please tell us where you're based.");
    setBusy(true);
    try {
      await meApi.completeOnboarding({
        name: name.trim(),
        phone: phone.trim(),
        location: location.trim(),
        stack,
      });
      router.replace("/portal");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't save your profile. Try again.",
      );
      setBusy(false);
    }
  }

  const context = me?.title ?? "New hire";

  return (
    <div className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-xl">
        <p className="eyebrow">Welcome to Technograph</p>
        <h1 className="mt-3 text-3xl font-semibold text-navy">
          Let&apos;s finish setting up your profile
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your placement is already set up. Add a few personal details to
          activate your account.
        </p>

        {loading ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Loading…
          </p>
        ) : (
          <>
            {me && (
              <div className="mt-8 rounded-lg bg-navy-gradient p-5 text-navy-foreground">
                <p className="font-semibold">{context}</p>
                <p className="mt-1 font-mono text-xs text-navy-muted">
                  {me.employeeCode ?? "—"} · {me.employmentType ?? "—"} ·
                  Manager: {me.managerName ?? "—"}
                </p>
              </div>
            )}

            <form
              onSubmit={submit}
              noValidate
              className="mt-8 space-y-5 rounded-lg border bg-card p-6 shadow-card"
            >
              <div className="space-y-2">
                <Label>Full name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Contact phone</Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Where are you based?</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Your skills</Label>
                <TagInput value={stack} onChange={setStack} />
              </div>
              {error && (
                <p className="text-sm text-destructive" role="alert">{error}</p>
              )}
              <Button
                type="submit"
                variant="navy"
                size="lg"
                className="w-full"
                disabled={busy}
              >
                {busy ? "Saving…" : "Complete setup →"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
