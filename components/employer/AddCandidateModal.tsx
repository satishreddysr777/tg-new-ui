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
import { TagInput } from "@/components/console/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const SOURCES = ["Public board", "LinkedIn", "Referral", "Hacker News", "Other"];

const empty: Experience = { title: "", company: "", period: "", detail: "" };
const sel = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm";

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
  const [experience, setExperience] = useState<Experience[]>([]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  function setExp(i: number, key: keyof Experience, val: string) {
    setExperience((xs) =>
      xs.map((x, k) => (k === i ? { ...x, [key]: val } : x)),
    );
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
      setError(
        err instanceof ApiError ? err.message : "Couldn't add the candidate.",
      );
      setBusy(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogTitle className="text-navy">Add candidate</DialogTitle>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Full name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Stage</Label>
              <select
                className={sel}
                value={stage}
                onChange={(e) => setStage(e.target.value as Stage)}
              >
                {STAGES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Source</Label>
              <select
                className={sel}
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                {SOURCES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Years of experience</Label>
              <Input
                type="number"
                min={0}
                value={years}
                onChange={(e) => setYears(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Comp ask</Label>
              <Input value={compAsk} onChange={(e) => setCompAsk(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Match %</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={matchPct}
                onChange={(e) => setMatchPct(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">LinkedIn</Label>
              <Input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Summary</Label>
            <Textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Skills</Label>
            <TagInput value={skills} onChange={setSkills} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Experience</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setExperience([...experience, { ...empty }])}
              >
                + Add row
              </Button>
            </div>
            {experience.map((x, i) => (
              <div
                key={i}
                className="grid gap-2 rounded-md border p-3 sm:grid-cols-3"
              >
                <Input
                  placeholder="Title"
                  value={x.title}
                  onChange={(e) => setExp(i, "title", e.target.value)}
                />
                <Input
                  placeholder="Company"
                  value={x.company}
                  onChange={(e) => setExp(i, "company", e.target.value)}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setExperience(experience.filter((_, k) => k !== i))
                  }
                >
                  Remove
                </Button>
                <Input
                  placeholder="Period"
                  value={x.period}
                  onChange={(e) => setExp(i, "period", e.target.value)}
                />
                <Input
                  className="sm:col-span-2"
                  placeholder="Detail"
                  value={x.detail}
                  onChange={(e) => setExp(i, "detail", e.target.value)}
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="navy" disabled={busy}>
              {busy ? "Adding…" : "Add candidate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
