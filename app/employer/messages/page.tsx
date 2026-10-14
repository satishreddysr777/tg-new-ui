"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Topbar } from "@/components/portal/Topbar";
import { Body, Panel, Table, td, StatusBadge, Segmented } from "@/components/console/ui";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/auth-api";
import {
  messagesApi,
  type ContactMessage,
  type ContactStatus,
} from "@/lib/employer/messages-api";
import { cn } from "@/lib/utils";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const FILTERS = ["All", "New", "Read", "Archived"] as const;
type Filter = (typeof FILTERS)[number];

function toApiStatus(f: Filter): ContactStatus | null {
  if (f === "All") return null;
  if (f === "New") return "NEW";
  if (f === "Read") return "READ";
  return "ARCHIVED";
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [filter, setFilter] = useState<Filter>("All");
  const [selId, setSelId] = useState<string>();
  const [busyId, setBusyId] = useState<string>();

  const load = useCallback(() => {
    setLoading(true);
    messagesApi
      .list()
      .then((rows) => {
        setMessages(rows);
        setError(undefined);
      })
      .catch(() => setError("Couldn't load messages."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const newCount = useMemo(
    () => messages.filter((m) => m.status === "NEW").length,
    [messages],
  );

  const apiFilter = toApiStatus(filter);
  const list = useMemo(
    () =>
      apiFilter === null ? messages : messages.filter((m) => m.status === apiFilter),
    [messages, apiFilter],
  );

  const sel = messages.find((m) => m.id === selId) ?? null;

  function patchLocal(id: string, status: ContactStatus) {
    setMessages((rows) => rows.map((m) => (m.id === id ? { ...m, status } : m)));
  }

  async function setStatus(m: ContactMessage, status: ContactStatus) {
    if (m.status === status) return;
    setNotice(undefined);
    setBusyId(m.id);
    const prev = m.status;
    patchLocal(m.id, status);
    try {
      await messagesApi.setStatus(m.id, status);
    } catch (err) {
      patchLocal(m.id, prev);
      setNotice(
        err instanceof ApiError ? err.message : "Couldn't update the message.",
      );
    } finally {
      setBusyId(undefined);
    }
  }

  function openMessage(m: ContactMessage) {
    setSelId(m.id);
    setNotice(undefined);
    if (m.status === "NEW") void setStatus(m, "READ");
  }

  async function remove(m: ContactMessage) {
    setNotice(undefined);
    if (!window.confirm(`Delete the message from ${m.name}? This can't be undone.`))
      return;
    setBusyId(m.id);
    try {
      await messagesApi.remove(m.id);
      if (selId === m.id) setSelId(undefined);
      setMessages((rows) => rows.filter((r) => r.id !== m.id));
    } catch (err) {
      setNotice(
        err instanceof ApiError && err.status === 403
          ? "Only an admin can delete messages."
          : err instanceof ApiError
            ? err.message
            : "Couldn't delete the message.",
      );
    } finally {
      setBusyId(undefined);
    }
  }

  return (
    <>
      <Topbar
        kicker="Admin · Messages"
        title="Messages"
        sub={
          loading
            ? "Loading messages…"
            : `${messages.length} message${messages.length === 1 ? "" : "s"} · ${newCount} new`
        }
      />
      <Body>
        <Segmented value={filter} options={FILTERS} onChange={setFilter} />
        {notice && <p className="text-sm text-destructive">{notice}</p>}
        {error ? (
          <p className="text-center text-muted-foreground">
            {error}{" "}
            <button type="button" className="text-primary underline" onClick={load}>
              Retry
            </button>
          </p>
        ) : loading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <Table head={["From", "Intent", "Message", "Received", "Status", ""]}>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    {messages.length
                      ? "No messages match this filter."
                      : "No messages yet. Submissions from the public contact form land here."}
                  </td>
                </tr>
              ) : (
                list.map((m) => (
                  <tr
                    key={m.id}
                    className={cn(
                      "cursor-pointer hover:bg-muted/50",
                      selId === m.id && "bg-accent/50",
                    )}
                    onClick={() => openMessage(m)}
                  >
                    <td className={td}>
                      <p
                        className={cn(
                          "text-navy",
                          m.status === "NEW" && "font-semibold",
                        )}
                      >
                        {m.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{m.company ?? m.email}</p>
                    </td>
                    <td className={td}>{m.intent ?? "—"}</td>
                    <td className={cn(td, "max-w-48 truncate text-muted-foreground")}>
                      {m.message?.trim() || "—"}
                    </td>
                    <td className={cn(td, "whitespace-nowrap text-xs")}>
                      {formatDate(m.createdAt)}
                    </td>
                    <td className={td}>
                      <StatusBadge status={m.status} />
                    </td>
                    <td
                      className={cn(td, "whitespace-nowrap text-right")}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {m.status === "NEW" && (
                        <button
                          type="button"
                          className="mr-3 text-xs font-medium text-primary"
                          onClick={() => setStatus(m, "READ")}
                          disabled={busyId === m.id}
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        type="button"
                        className="text-xs font-medium text-primary"
                        onClick={() => openMessage(m)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </Table>
            {sel ? (
              <Panel title={sel.intent ?? "Contact message"}>
                <p className="text-lg font-semibold text-navy">{sel.name}</p>
                <div className="mt-2 space-y-0.5 text-sm text-muted-foreground">
                  <p>
                    <a href={`mailto:${sel.email}`} className="text-primary hover:underline">
                      {sel.email}
                    </a>
                  </p>
                  {sel.phone && <p>{sel.phone}</p>}
                  {sel.company && <p>{sel.company}</p>}
                </div>
                <p className="mt-5 whitespace-pre-wrap rounded-md bg-muted/60 p-4 text-sm">
                  {sel.message?.trim() || "— No message body —"}
                </p>
                <p className="mt-3 font-mono text-xs text-muted-foreground">
                  Received {formatDate(sel.createdAt)}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild variant="navy">
                    <a
                      href={`mailto:${sel.email}?subject=${encodeURIComponent(
                        "Re: your message to Technograph",
                      )}`}
                    >
                      Reply
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busyId === sel.id}
                    onClick={() =>
                      setStatus(sel, sel.status === "ARCHIVED" ? "READ" : "ARCHIVED")
                    }
                  >
                    {sel.status === "ARCHIVED" ? "Unarchive" : "Archive"}
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-destructive"
                    disabled={busyId === sel.id}
                    onClick={() => remove(sel)}
                  >
                    Delete
                  </Button>
                </div>
              </Panel>
            ) : (
              <div className="hidden rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground xl:block">
                Select a message to read it.
              </div>
            )}
          </div>
        )}
      </Body>
    </>
  );
}
