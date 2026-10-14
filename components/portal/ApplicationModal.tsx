"use client";

import {
  STAGES,
  resumeUrl,
  appliedAgo,
  type PortalApplication,
} from "@/lib/portal/me-api";
import { Facts, Chip } from "@/components/console/ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ApplicationModal({
  application,
  onClose,
}: {
  application: PortalApplication;
  onClose: () => void;
}) {
  const a = application;
  const url = resumeUrl(a.id);
  const isPdf = (a.resumeName ?? "").toLowerCase().endsWith(".pdf");

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <p className="font-mono text-xs text-muted-foreground">
          {a.jobCode} · {a.applicationCode}
        </p>
        <DialogTitle className="text-xl text-navy">{a.jobTitle}</DialogTitle>
        <p className="-mt-2 text-sm text-muted-foreground">
          {a.jobClientName ?? "Technograph"} · Applied {appliedAgo(a.appliedAt)}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-dashed p-3 text-sm">
          {a.resumeName ? (
            <>
              <span className="truncate">{a.resumeName}</span>
              <span className="flex gap-2">
                <Button asChild size="sm" variant="outline">
                  <a href={url} target="_blank" rel="noreferrer">Open ↗</a>
                </Button>
                <Button asChild size="sm" variant="navy">
                  <a href={url} download={a.resumeName}>Download ↓</a>
                </Button>
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">
              No résumé attached to this application.
            </span>
          )}
        </div>

        {a.resumeName && isPdf && (
          <iframe
            title="Résumé preview"
            src={`${url}#view=FitH`}
            className="h-64 w-full rounded-md border bg-white"
          />
        )}

        <ol className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {STAGES.map((s) => (
            <li
              key={s}
              className={cn(
                "rounded-md border px-2 py-2 text-center text-xs",
                s === a.stage
                  ? "border-primary bg-primary/10 font-semibold text-primary"
                  : "text-muted-foreground",
              )}
            >
              {s}
              {s === a.stage && (
                <span className="block font-mono text-[0.6rem]">CURRENT</span>
              )}
            </li>
          ))}
        </ol>

        <Facts
          cols={3}
          items={[
            ["Role", a.jobTitle],
            ["Client", a.jobClientName ?? "—"],
            ["Source", a.source ?? "—"],
            ["Comp ask", a.compAsk ?? "—"],
            ["Match", a.matchPct != null ? `${a.matchPct}%` : "—"],
            ["Applied", appliedAgo(a.appliedAt)],
            ["Reference", a.applicationCode],
          ]}
        />

        <div>
          <h3 className="text-sm font-semibold text-navy">Your note</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {a.summary || "—"}
          </p>
        </div>

        {a.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-navy">Skills submitted</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {a.skills.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
