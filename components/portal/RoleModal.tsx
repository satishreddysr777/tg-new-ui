"use client";

import { useState } from "react";
import { ApiError } from "@/lib/auth-api";
import { meApi, type PortalRole } from "@/lib/portal/me-api";
import { formatComp, postedAgo } from "@/lib/portal/format";
import { Facts, Chip, FileInput } from "@/components/console/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export function RoleModal({
  role,
  onClose,
  onApplied,
}: {
  role: PortalRole;
  onClose: () => void;
  onApplied: (code: string) => void;
}) {
  const [summary, setSummary] = useState("");
  const [compAsk, setCompAsk] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [applied, setApplied] = useState(role.applied);

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

  async function apply() {
    if (busy || applied) return;
    setError(undefined);
    setBusy(true);
    try {
      const resumeFields = resume
        ? {
            resumeName: resume.name,
            resumeMime: resume.type || "application/octet-stream",
            resumeData: await fileToBase64(resume),
          }
        : {};
      const res = await meApi.applyToRole(role.jobCode, {
        summary: summary.trim() || undefined,
        compAsk: compAsk.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        ...resumeFields,
      });
      setApplied(true);
      onApplied(res.applicationCode);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't apply. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <p className="font-mono text-xs text-muted-foreground">
          {role.jobCode} ·{" "}
          <span className="text-primary">{role.matchPct}% match</span>
        </p>
        <DialogTitle className="text-xl text-navy">{role.title}</DialogTitle>
        <p className="-mt-2 text-sm text-muted-foreground">
          {[role.clientName, role.location].filter(Boolean).join(" · ") || "—"}
        </p>

        <div className="rounded-md bg-muted/60 p-4">
          <Facts
            cols={3}
            items={[
              ["Client", role.clientName ?? "—"],
              ["Department", role.department ?? "—"],
              ["Engagement", role.engagementType ?? "—"],
              ["Location", role.location ?? "—"],
              ["Compensation", formatComp(role)],
              ["Posted", postedAgo(role.createdAt)],
            ]}
          />
        </div>

        {role.summary && (
          <div>
            <h3 className="text-sm font-semibold text-navy">Summary</h3>
            <p className="mt-1 text-sm text-muted-foreground">{role.summary}</p>
          </div>
        )}

        {role.responsibilities && (
          <div>
            <h3 className="text-sm font-semibold text-navy">Responsibilities</h3>
            <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
              {role.responsibilities.split("\n").map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {role.stack.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-navy">Required stack</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {role.stack.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </div>
        )}

        {applied ? (
          <p className="rounded-md bg-success/10 p-4 text-sm font-medium text-success">
            Application submitted — track it under My applications.
          </p>
        ) : (
          <div className="space-y-3 border-t pt-4">
            <div className="space-y-1.5">
              <Label>Note to the talent team</Label>
              <Textarea
                placeholder="Why you're a fit for this role…"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Comp expectation</Label>
                <Input
                  placeholder="e.g. $120/hr"
                  value={compAsk}
                  onChange={(e) => setCompAsk(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Portfolio / LinkedIn</Label>
                <Input
                  placeholder="(optional)"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Résumé (PDF or Word, up to 4MB)</Label>
              <FileInput file={resume} onChange={onResume} />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">{error}</p>
            )}
            <Button variant="navy" onClick={apply} disabled={busy}>
              {busy ? "Submitting…" : "Submit application →"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
