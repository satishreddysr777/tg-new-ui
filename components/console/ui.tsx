"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Stage, EmpStatus } from "@/lib/pipeline-types";

export function FileInput({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-center gap-3 rounded-md border border-dashed border-input px-3 py-2">
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="rounded-sm bg-secondary px-3 py-1 text-xs font-medium hover:bg-accent"
      >
        Choose file
      </button>
      <span className="truncate text-xs text-muted-foreground">
        {file ? file.name : "No file selected"}
      </span>
      <input
        ref={ref}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  sub,
  actions,
}: {
  kicker: string;
  title: ReactNode;
  sub?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b bg-card px-6 py-6 md:flex-row md:items-end md:px-10">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h1 className="mt-2 text-2xl font-semibold text-navy md:text-3xl">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Body({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("space-y-6 px-6 py-8 md:px-10", className)}>{children}</div>;
}

export function Panel({
  title,
  children,
  className,
  action,
}: {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={cn("rounded-lg border bg-card shadow-card", className)}>
      {title && (
        <div className="flex items-center justify-between border-b px-5 py-3.5">
          <h2 className="text-sm font-semibold text-navy">{title}</h2>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Tile({
  label,
  big,
  small,
  to,
  icon,
}: {
  label: string;
  big: ReactNode;
  small: ReactNode;
  to?: string;
  icon?: ReactNode;
}) {
  const inner = (
    <div className="h-full rounded-lg border bg-card p-5 shadow-card transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[0.68rem] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <span className="text-primary">{icon}</span>
      </div>
      <p className="mt-4 text-2xl font-semibold text-navy">{big}</p>
      <p className="mt-1 text-sm text-muted-foreground">{small}</p>
    </div>
  );
  return to ? <Link href={to}>{inner}</Link> : inner;
}

const stageCls: Record<Stage, string> = {
  Applied: "bg-secondary text-secondary-foreground",
  Screening: "bg-accent text-accent-foreground",
  Interview: "bg-primary/12 text-primary",
  Offer: "bg-warning/20 text-foreground",
  Hired: "bg-success/15 text-success",
  Rejected: "bg-destructive/10 text-destructive",
};
export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span
      className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", stageCls[stage])}
    >
      {stage}
    </span>
  );
}

const statusCls: Record<string, string> = {
  Active: "bg-success/15 text-success",
  Onboarding: "bg-primary/12 text-primary",
  "On bench": "bg-warning/20 text-foreground",
  Published: "bg-success/15 text-success",
  Draft: "bg-secondary text-muted-foreground",
  Pending: "bg-primary/12 text-primary",
  PENDING: "bg-primary/12 text-primary",
  Accepted: "bg-success/15 text-success",
  ACCEPTED: "bg-success/15 text-success",
  Revoked: "bg-secondary text-muted-foreground",
  REVOKED: "bg-secondary text-muted-foreground",
  New: "bg-primary/12 text-primary",
  NEW: "bg-primary/12 text-primary",
  Read: "bg-secondary text-muted-foreground",
  READ: "bg-secondary text-muted-foreground",
  Archived: "bg-secondary text-muted-foreground",
  ARCHIVED: "bg-secondary text-muted-foreground",
};
export function StatusBadge({ status }: { status: EmpStatus | string }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusCls[status] ?? "bg-secondary",
      )}
    >
      {status}
    </span>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-sm bg-accent px-2 py-0.5 font-mono text-[0.7rem] text-accent-foreground">
      {children}
    </span>
  );
}

export function Facts({
  items,
  cols = 2,
}: {
  items: [string, ReactNode][];
  cols?: number;
}) {
  return (
    <dl className={cn("grid gap-x-6 gap-y-4", cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
      {items.map(([k, v]) => (
        <div key={k}>
          <dt className="font-mono text-[0.68rem] uppercase tracking-widest text-muted-foreground">
            {k}
          </dt>
          <dd className="mt-1 text-sm font-medium text-foreground">{v || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed bg-card px-6 py-14 text-center">
      <p className="font-semibold text-navy">{title}</p>
      {children && (
        <div className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{children}</div>
      )}
    </div>
  );
}

export function Placeholder({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div className="rounded-lg border border-dashed bg-card px-6 py-20 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent font-mono text-primary">
        ··
      </div>
      <p className="mt-5 text-lg font-semibold text-navy">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{blurb}</p>
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card shadow-card">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/60">
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="whitespace-nowrap px-4 py-3 text-left font-mono text-[0.68rem] font-medium uppercase tracking-widest text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  );
}
export const td = "px-4 py-3 align-middle";

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-md border bg-card p-0.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={cn(
            "rounded-sm px-3 py-1.5 text-xs font-medium",
            value === o ? "bg-navy text-navy-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1.5">
      {value.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 rounded-sm bg-accent px-2 py-0.5 text-xs text-accent-foreground"
        >
          {t}
          <button
            type="button"
            onClick={() => onChange(value.filter((x) => x !== t))}
            aria-label={`Remove ${t}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="min-w-24 flex-1 bg-transparent text-sm outline-none"
        placeholder={placeholder ?? "Type and press Enter"}
        onKeyDown={(e) => {
          const v = e.currentTarget.value.trim();
          if ((e.key === "Enter" || e.key === ",") && v) {
            e.preventDefault();
            if (!value.includes(v)) onChange([...value, v]);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}
