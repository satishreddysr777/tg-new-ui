"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initials } from "@/components/portal/icons";
import { ApiError } from "@/lib/auth-api";
import { meApi, type MeProfile } from "@/lib/portal/me-api";

/**
 * First-run onboarding for a new hire. The admin has already set up the
 * placement + compensation; here the employee confirms their name and fills in
 * the personal details only they know. Submitting flips their status to Active,
 * after which the portal gate lets them into the rest of the console.
 */
export default function OnboardingPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [stack, setStack] = useState<string[]>([]);
  const [skillDraft, setSkillDraft] = useState("");

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

  function addSkill() {
    const s = skillDraft.trim();
    if (s && !stack.includes(s)) setStack([...stack, s]);
    setSkillDraft("");
  }

  function onSkillKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    } else if (e.key === "Backspace" && !skillDraft && stack.length) {
      setStack(stack.slice(0, -1));
    }
  }

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
    <div
      style={{
        height: "100dvh",
        overflow: "auto",
        background: "var(--paper)",
        display: "grid",
        placeItems: "start center",
        padding: "48px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 640 }}>
        <span className="eyebrow">
          <span className="tick" />
          Welcome to Technograph
        </span>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 30,
            marginTop: 10,
          }}
        >
          Let&apos;s finish setting up your profile
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 8 }}>
          Your placement is already set up. Add a few personal details to
          activate your account.
        </p>

        {loading ? (
          <div
            className="card"
            style={{ marginTop: 24, textAlign: "center", color: "var(--muted)" }}
          >
            Loading…
          </div>
        ) : (
          <>
            {me && (
              <div
                className="card"
                style={{
                  marginTop: 22,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <span className="av av-lg">{initials(me.name)}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{context}</div>
                  <div
                    className="mono"
                    style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 3 }}
                  >
                    {me.employeeCode ?? "—"} ·{" "}
                    {me.employmentType ?? "—"} · Manager:{" "}
                    {me.managerName ?? "—"}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={submit} noValidate className="card" style={{ marginTop: 18 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
                  <label className="field-label">Full name</label>
                  <input
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">Contact phone</label>
                  <input
                    className="input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label className="field-label">Where are you based?</label>
                  <input
                    className="input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label className="field-label">Your skills</label>
                  <div
                    className="input"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      alignItems: "center",
                      cursor: "text",
                      minHeight: 44,
                    }}
                  >
                    {stack.map((s) => (
                      <span
                        key={s}
                        className="tag tag-copper"
                        style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
                      >
                        {s}
                        <button
                          type="button"
                          aria-label={`Remove ${s}`}
                          onClick={() => setStack(stack.filter((x) => x !== s))}
                          style={{
                            border: 0,
                            background: "none",
                            cursor: "pointer",
                            color: "inherit",
                            display: "inline-flex",
                            fontSize: 13,
                            lineHeight: 1,
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      value={skillDraft}
                      onChange={(e) => setSkillDraft(e.target.value)}
                      onKeyDown={onSkillKey}
                      onBlur={addSkill}
                      style={{
                        flex: 1,
                        minWidth: 140,
                        border: 0,
                        outline: 0,
                        background: "transparent",
                        fontSize: 13.5,
                        color: "var(--ink)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p className="err" role="alert" style={{ marginTop: 14 }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn"
                style={{ width: "100%", marginTop: 20 }}
                disabled={busy}
              >
                {busy ? "Saving…" : "Complete setup →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
