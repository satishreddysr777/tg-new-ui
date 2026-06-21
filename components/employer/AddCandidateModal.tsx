"use client";

import { useState } from "react";
import { ApiError } from "@/lib/auth-api";
import {
  applicationsApi,
  STAGES,
  type Application,
  type Experience,
  type Stage,
} from "@/lib/employer/applications-api";

const SOURCES = ["Public board", "LinkedIn", "Referral", "Hacker News", "Other"];

const empty: Experience = { title: "", company: "", period: "", detail: "" };

export function AddCandidateModal({
  jobIdOrCode,
  onClose,
  onCreated,
}: {
  jobIdOrCode: string;
  onClose: () => void;
  onCreated: (a: Application) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("Public board");
  const [stage, setStage] = useState<Stage>("Applied");
  const [years, setYears] = useState("");
  const [compAsk, setCompAsk] = useState("");
  const [matchPct, setMatchPct] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillDraft, setSkillDraft] = useState("");
  const [experience, setExperience] = useState<Experience[]>([]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  function addSkill() {
    const v = skillDraft.trim();
    if (v && !skills.includes(v)) setSkills([...skills, v]);
    setSkillDraft("");
  }

  function setExp(i: number, key: keyof Experience, val: string) {
    setExperience((xs) => xs.map((x, k) => (k === i ? { ...x, [key]: val } : x)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    if (!name.trim()) {
      setError("Enter the candidate's name.");
      return;
    }
    setBusy(true);
    try {
      const created = await applicationsApi.create(jobIdOrCode, {
        name: name.trim(),
        stage,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        location: location.trim() || undefined,
        source,
        years: years ? Number(years) : undefined,
        compAsk: compAsk.trim() || undefined,
        matchPct: matchPct ? Number(matchPct) : undefined,
        linkedin: linkedin.trim() || undefined,
        summary: summary.trim() || undefined,
        skills,
        experience: experience
          .filter((x) => x.title.trim() || x.company.trim())
          .map((x) => ({
            title: x.title.trim(),
            company: x.company.trim(),
            period: x.period.trim(),
            detail: x.detail.trim(),
          })),
      });
      onCreated(created);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't add the candidate.");
      setBusy(false);
    }
  }

  const labelled = (label: string, node: React.ReactNode) => (
    <div>
      <label className="field-label">{label}</label>
      {node}
    </div>
  );

  return (
    <div className="modal-bg" onClick={onClose}>
      <form
        className="modal"
        onSubmit={submit}
        noValidate
        style={{ maxWidth: 640, height: "auto", maxHeight: "92%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="between" style={{ padding: "18px 24px", borderBottom: "1px solid var(--line)" }}>
          <h3 style={{ fontSize: 19 }}>Add candidate</h3>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Close ✕
          </button>
        </div>

        <div style={{ padding: 24, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {labelled("Full name", <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />)}
            {labelled("Stage", (
              <select className="select" value={stage} onChange={(e) => setStage(e.target.value as Stage)}>
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            ))}
            {labelled("Email", <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />)}
            {labelled("Phone", <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />)}
            {labelled("Location", <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} />)}
            {labelled("Source", (
              <select className="select" value={source} onChange={(e) => setSource(e.target.value)}>
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            ))}
            {labelled("Years of experience", <input className="input" type="number" min={0} value={years} onChange={(e) => setYears(e.target.value)} />)}
            {labelled("Comp ask", <input className="input" value={compAsk} onChange={(e) => setCompAsk(e.target.value)} />)}
            {labelled("Match %", <input className="input" type="number" min={0} max={100} value={matchPct} onChange={(e) => setMatchPct(e.target.value)} />)}
            {labelled("LinkedIn", <input className="input" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />)}
          </div>

          {labelled("Summary", <textarea className="textarea" rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} />)}

          {labelled("Skills", (
            <div className="input" style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", minHeight: 44 }}>
              {skills.map((s) => (
                <span key={s} className="tag tag-copper" style={{ cursor: "pointer" }} onClick={() => setSkills(skills.filter((x) => x !== s))}>
                  {s} ✕
                </span>
              ))}
              <input
                value={skillDraft}
                onChange={(e) => setSkillDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                onBlur={addSkill}
                style={{ flex: 1, minWidth: 120, border: 0, outline: 0, background: "transparent", fontSize: 13.5, color: "var(--ink)" }}
              />
            </div>
          ))}

          <div>
            <div className="between" style={{ marginBottom: 6 }}>
              <label className="field-label" style={{ marginBottom: 0 }}>Experience</label>
              <button type="button" className="link" style={{ fontSize: 12.5 }} onClick={() => setExperience([...experience, { ...empty }])}>
                + Add row
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {experience.map((x, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8 }}>
                  <input className="input" placeholder="" value={x.title} onChange={(e) => setExp(i, "title", e.target.value)} aria-label="Title" />
                  <input className="input" value={x.company} onChange={(e) => setExp(i, "company", e.target.value)} aria-label="Company" />
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setExperience(experience.filter((_, k) => k !== i))}>✕</button>
                  <input className="input" value={x.period} onChange={(e) => setExp(i, "period", e.target.value)} aria-label="Period" />
                  <input className="input" style={{ gridColumn: "2 / 4" }} value={x.detail} onChange={(e) => setExp(i, "detail", e.target.value)} aria-label="Detail" />
                </div>
              ))}
            </div>
          </div>

          {error && <p className="err" role="alert">{error}</p>}

          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button type="submit" className="btn btn-sm" disabled={busy}>
              {busy ? "Adding…" : "Add candidate"}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
