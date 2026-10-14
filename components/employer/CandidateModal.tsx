"use client";

import { useState } from "react";
import { ApiError } from "@/lib/auth-api";
import {
  applicationsApi,
  STAGES,
  type Application,
  type Stage,
} from "@/lib/employer/applications-api";
import { Facts, Chip } from "@/components/console/ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const RESUME_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function CandidateModal({
  application,
  jobTitle,
  onClose,
  onUpdated,
}: {
  application: Application;
  jobTitle: string;
  onClose: () => void;
  onUpdated: (a: Application) => void;
}) {
  const [a, setA] = useState(application);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function move(stage: Stage) {
    if (stage === a.stage || busy) return;
    setError(undefined);
    setBusy(true);
    try {
      const updated = await applicationsApi.updateStage(a.id, stage);
      setA(updated);
      onUpdated(updated);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't move candidate.",
      );
    } finally {
      setBusy(false);
    }
  }

  const resumeUrl = `${RESUME_BASE}/applications/${a.id}/resume`;
  const isPdf = (a.resumeName ?? "").toLowerCase().endsWith(".pdf");
  const linkedinHref = a.linkedin
    ? a.linkedin.startsWith("http")
      ? a.linkedin
      : `https://${a.linkedin}`
    : null;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <p className="font-mono text-xs text-muted-foreground">
          {jobTitle} · {a.applicationCode}
        </p>
        <DialogTitle className="text-xl text-navy">{a.name}</DialogTitle>

        {a.resumeName && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-dashed p-3 text-sm">
            <span className="truncate">{a.resumeName}</span>
            <span className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <a href={resumeUrl} target="_blank" rel="noreferrer">
                  Open ↗
                </a>
              </Button>
              <Button asChild size="sm" variant="navy">
                <a href={resumeUrl} download={a.resumeName}>
                  Download ↓
                </a>
              </Button>
            </span>
          </div>
        )}

        {a.resumeName && isPdf && (
          <iframe
            title="Résumé preview"
            src={`${resumeUrl}#view=FitH`}
            className="h-64 w-full rounded-md border bg-white md:h-80"
          />
        )}

        <div className="flex flex-wrap gap-1.5">
          {STAGES.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={a.stage === s ? "navy" : "outline"}
              disabled={busy}
              onClick={() => move(s)}
            >
              {s}
            </Button>
          ))}
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">{error}</p>
        )}

        <Facts
          cols={3}
          items={[
            ["Email", a.email ?? "—"],
            ["Phone", a.phone ?? "—"],
            ["Location", a.location ?? "—"],
            ["Years", a.years != null ? String(a.years) : "—"],
            [
              "LinkedIn",
              linkedinHref ? (
                <a
                  href={linkedinHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  View ↗
                </a>
              ) : (
                "—"
              ),
            ],
            ["Source", a.source ?? "—"],
            ["Comp ask", a.compAsk ?? "—"],
            ["Match", a.matchPct != null ? `${a.matchPct}%` : "—"],
            ["Applied", fmtDate(a.appliedAt)],
            ["Reference", a.applicationCode],
          ]}
        />

        <div>
          <h3 className="text-sm font-semibold text-navy">Summary</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {a.summary || "—"}
          </p>
        </div>

        {a.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-navy">Skills</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {a.skills.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </div>
        )}

        {a.experience.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-navy">Experience</h3>
            <ul className="mt-2 space-y-3">
              {a.experience.map((x, i) => (
                <li
                  key={i}
                  className="border-l-2 border-primary pl-3 text-sm"
                >
                  <p className="font-medium">
                    {x.title} · {x.company}
                  </p>
                  <p className="text-xs text-muted-foreground">{x.period}</p>
                  {x.detail && (
                    <p className="mt-1 text-muted-foreground">{x.detail}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
