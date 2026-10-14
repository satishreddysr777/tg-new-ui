"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, MapPin, Briefcase } from "lucide-react";
import { ApiError } from "@/lib/auth-api";
import { careersApi, type PublicJob } from "@/lib/careers-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileInput } from "@/components/console/ui";
import { Chip } from "@/components/console/ui";

function F({ l, children }: { l: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{l}</Label>
      {children}
    </div>
  );
}

export default function CareerApplyPage() {
  const params = useParams<{ id: string }>();
  const [job, setJob] = useState<PublicJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [years, setYears] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [done, setDone] = useState<string>();

  useEffect(() => {
    careersApi
      .getJob(params.id)
      .then(setJob)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setMissing(true);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const MAX_RESUME = 4 * 1024 * 1024;

  function onResume(file: File | null) {
    if (file && file.size > MAX_RESUME) {
      setError("Résumé must be under 4MB.");
      return;
    }
    setError(undefined);
    setResume(file);
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
      reader.onerror = () => reject(new Error("Couldn't read the file."));
      reader.readAsDataURL(file);
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("Please add your first name, last name, and email.");
      return;
    }
    setBusy(true);
    try {
      const resumeFields = resume
        ? {
            resumeName: resume.name,
            resumeMime: resume.type || "application/octet-stream",
            resumeData: await fileToBase64(resume),
          }
        : {};
      const res = await careersApi.apply(params.id, {
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        phone: phone.trim() || undefined,
        location: location.trim() || undefined,
        years: years ? Number(years) : undefined,
        linkedin: linkedin.trim() || undefined,
        ...resumeFields,
      });
      setDone(res.applicationCode);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't submit. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <section className="container-x py-32">
        <p className="text-muted-foreground">Loading role…</p>
      </section>
    );
  }

  if (missing || !job) {
    return (
      <section className="container-x py-32 text-center">
        <p className="eyebrow">Careers</p>
        <h1 className="mt-4 text-4xl font-semibold text-navy">This role isn&apos;t open.</h1>
        <p className="mt-3 text-muted-foreground">It may have been filled or closed.</p>
        <Button asChild variant="navy" className="mt-8">
          <Link href="/careers#openings">← See all open roles</Link>
        </Button>
      </section>
    );
  }

  const responsibilities = job.responsibilities
    ? job.responsibilities.split("\n").filter(Boolean)
    : [];

  return (
    <section className="container-x py-14">
      <Link
        href="/careers#openings"
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        ← All roles
      </Link>
      <div className="mt-8 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="eyebrow">{job.department ?? "Open role"}</p>
          <h1 className="mt-3 text-4xl font-semibold text-navy md:text-5xl">{job.title}</h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {job.location && (
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-sm">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
            )}
            {job.engagementType && (
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-sm">
                <Briefcase className="h-3.5 w-3.5" />
                {job.engagementType}
              </span>
            )}
          </div>
          {job.summary && (
            <p className="mt-8 text-lg text-muted-foreground">{job.summary}</p>
          )}
          {responsibilities.length > 0 && (
            <>
              <h2 className="mt-10 text-xl font-semibold text-navy">What you&apos;ll do</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
                {responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </>
          )}
          {job.stack.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {job.stack.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          )}
        </div>
        <div className="h-fit rounded-xl border bg-card p-7 shadow-card lg:sticky lg:top-24">
          {done ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto h-11 w-11 text-success" />
              <h2 className="mt-4 text-xl font-semibold text-navy">Application received.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Thanks for applying to <b className="text-foreground">{job.title}</b>. Your
                reference is <b className="font-mono text-foreground">{done}</b>. Our talent team
                will be in touch.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/careers#openings">← Back to roles</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4" noValidate>
              <div>
                <p className="eyebrow">Apply for this role</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  No account needed — just tell us about yourself.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <F l="First name">
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </F>
                <F l="Last name">
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </F>
              </div>
              <F l="Email">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </F>
              <F l="Phone (optional)">
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </F>
              <div className="grid grid-cols-2 gap-3">
                <F l="Location">
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                </F>
                <F l="Years of experience">
                  <Input
                    type="number"
                    min={0}
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  />
                </F>
              </div>
              <F l="LinkedIn / portfolio">
                <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
              </F>
              <F l="Résumé (PDF or Word, up to 4MB)">
                <FileInput file={resume} onChange={onResume} />
              </F>
              {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
              <Button type="submit" variant="navy" className="w-full" disabled={busy}>
                {busy ? "Submitting…" : "Submit application →"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
