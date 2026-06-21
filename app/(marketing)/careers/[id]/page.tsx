"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ApiError } from "@/lib/auth-api";
import { careersApi, type PublicJob } from "@/lib/careers-api";

export default function CareerApplyPage() {
  const params = useParams<{ id: string }>();
  const [job, setJob] = useState<PublicJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  // form
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
  const [done, setDone] = useState<string>(); // application code

  useEffect(() => {
    careersApi
      .getJob(params.id)
      .then(setJob)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setMissing(true);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const MAX_RESUME = 4 * 1024 * 1024; // 4MB

  function onResume(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_RESUME) {
      setError("Résumé must be under 4MB.");
      e.target.value = "";
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
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <section className="section">
        <div className="wrap">
          <p className="lead">Loading role…</p>
        </div>
      </section>
    );
  }

  if (missing || !job) {
    return (
      <section className="section">
        <div className="wrap">
          <span className="eyebrow">
            <span className="tick"></span>Careers
          </span>
          <h1 className="display" style={{ marginTop: 16 }}>
            This role isn&apos;t open.
          </h1>
          <p className="lead" style={{ marginTop: 14 }}>
            It may have been filled or closed.
          </p>
          <Link href="/careers" className="btn btn-dark" style={{ marginTop: 24 }}>
            ← See all open roles
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 860 }}>
        <Link href="/careers" className="link-arrow" style={{ marginBottom: 18, display: "inline-flex" }}>
          ← All roles
        </Link>
        <span className="eyebrow" style={{ marginTop: 10 }}>
          <span className="tick"></span>
          {job.department ?? "Open role"}
        </span>
        <h1 className="display" style={{ marginTop: 14 }}>
          {job.title}
        </h1>
        <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 10 }}>
          {[job.location, job.engagementType]
            .filter(Boolean)
            .map((t) => (
              <span key={t as string} className="chip" style={{ cursor: "default" }}>
                {t}
              </span>
            ))}
        </div>

        {job.summary && (
          <p className="lead" style={{ marginTop: 28 }}>
            {job.summary}
          </p>
        )}

        {job.responsibilities && (
          <div style={{ marginTop: 28 }}>
            <span className="eyebrow">
              <span className="tick"></span>What you&apos;ll do
            </span>
            <pre
              style={{
                marginTop: 14,
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
                fontSize: 16,
                lineHeight: 1.75,
                color: "var(--ink-2)",
              }}
            >
              {job.responsibilities}
            </pre>
          </div>
        )}

        {job.stack.length > 0 && (
          <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {job.stack.map((s) => (
              <span key={s} className="chip" style={{ cursor: "default" }}>
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="hr" style={{ margin: "44px 0" }} />

        {done ? (
          <div className="form-success show">
            <div className="badge">
              <svg viewBox="0 0 22 22" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 11.5l4.5 4.5L18 6" />
              </svg>
            </div>
            <h3>Application received.</h3>
            <p className="body" style={{ marginTop: 10 }}>
              Thanks for applying to <strong>{job.title}</strong>. Your reference
              is <strong>{done}</strong>. Our talent team will be in touch.
            </p>
            <Link href="/careers" className="btn btn-dark" style={{ marginTop: 22 }}>
              ← Back to roles
            </Link>
          </div>
        ) : (
          <>
            <span className="eyebrow">
              <span className="tick"></span>Apply for this role
            </span>
            <p className="body" style={{ marginTop: 8, color: "var(--muted)" }}>
              No account needed — just tell us about yourself.
            </p>
            <form className="form" onSubmit={submit} noValidate style={{ marginTop: 22 }}>
              <div className="field">
                <label htmlFor="firstName">First name</label>
                <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="lastName">Last name</label>
                <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone <span style={{ textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="location">Location</label>
                <input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="years">Years of experience</label>
                <input id="years" type="number" min={0} value={years} onChange={(e) => setYears(e.target.value)} />
              </div>
              <div className="field full">
                <label htmlFor="linkedin">LinkedIn / portfolio</label>
                <input id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
              </div>
              <div className="field full">
                <label htmlFor="resume">Résumé <span style={{ textTransform: "none", letterSpacing: 0 }}>(PDF or Word, up to 4MB)</span></label>
                <label
                  htmlFor="resume"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 16px",
                    border: "1.5px dashed var(--line)",
                    borderRadius: "var(--r-sm, 10px)",
                    cursor: "pointer",
                    background: "var(--paper-2)",
                    fontSize: 14,
                  }}
                >
                  <span className="btn btn-dark" style={{ pointerEvents: "none", padding: "8px 14px", fontSize: 13 }}>
                    Choose file
                  </span>
                  <span style={{ color: resume ? "var(--ink)" : "var(--muted)" }}>
                    {resume ? resume.name : "No file selected"}
                  </span>
                </label>
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={onResume}
                  style={{ display: "none" }}
                />
              </div>
              {error && (
                <div className="field full">
                  <p style={{ color: "var(--bad)", fontSize: 14 }} role="alert">{error}</p>
                </div>
              )}
              <div className="field full">
                <button type="submit" className="btn btn-dark" style={{ justifySelf: "start" }} disabled={busy}>
                  {busy ? "Submitting…" : "Submit application →"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
