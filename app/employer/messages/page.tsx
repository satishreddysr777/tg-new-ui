"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Topbar } from "@/components/portal/Topbar";
import { Icon, initials } from "@/components/portal/icons";
import { ApiError } from "@/lib/auth-api";
import {
  messagesApi,
  type ContactMessage,
  type ContactStatus,
} from "@/lib/employer/messages-api";

/** "2026-01-13T06:00:00Z" → "Jan 13, 2026 · 6:00 AM". */
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

const statusTag: Record<ContactStatus, { label: string; cls: string }> = {
  NEW: { label: "New", cls: "tag tag-copper" },
  READ: { label: "Read", cls: "tag" },
  ARCHIVED: { label: "Archived", cls: "tag" },
};

type Filter = "ALL" | ContactStatus;
const FILTERS: { key: Filter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "NEW", label: "New" },
  { key: "READ", label: "Read" },
  { key: "ARCHIVED", label: "Archived" },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [openId, setOpenId] = useState<string>();
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
  const visible = useMemo(
    () =>
      filter === "ALL"
        ? messages
        : messages.filter((m) => m.status === filter),
    [messages, filter],
  );
  const open = messages.find((m) => m.id === openId) ?? null;

  // Optimistically patch one row in place so the UI stays snappy.
  function patchLocal(id: string, status: ContactStatus) {
    setMessages((rows) =>
      rows.map((m) => (m.id === id ? { ...m, status } : m)),
    );
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
      patchLocal(m.id, prev); // revert
      setNotice(
        err instanceof ApiError ? err.message : "Couldn't update the message.",
      );
    } finally {
      setBusyId(undefined);
    }
  }

  // Opening a message marks it read if it was new.
  function openMessage(m: ContactMessage) {
    setOpenId(m.id);
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
      if (openId === m.id) setOpenId(undefined);
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
            : `${messages.length} message${messages.length === 1 ? "" : "s"}${
                newCount ? ` · ${newCount} new` : ""
              }`
        }
        actions={
          <div style={{ display: "flex", gap: 6 }}>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={"btn btn-sm" + (filter === f.key ? "" : " btn-ghost")}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
      />
      <div className="content">
        {open && (
          <div className="card" style={{ marginBottom: 18 }}>
            <div className="between" style={{ alignItems: "flex-start" }}>
              <div>
                <span className="eyebrow" style={{ gap: 0 }}>
                  {open.intent ?? "Contact message"}
                </span>
                <h3 style={{ fontSize: 17, marginTop: 4 }}>{open.name}</h3>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
                  <a className="link" href={`mailto:${open.email}`}>
                    {open.email}
                  </a>
                  {open.phone ? ` · ${open.phone}` : ""}
                  {open.company ? ` · ${open.company}` : ""}
                </div>
              </div>
              <button
                type="button"
                className="link-muted"
                onClick={() => setOpenId(undefined)}
              >
                Close
              </button>
            </div>
            <div className="rule" style={{ margin: "14px 0 16px" }} />
            <p
              style={{
                whiteSpace: "pre-wrap",
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--ink)",
              }}
            >
              {open.message?.trim() || "— No message body —"}
            </p>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 14 }}>
              Received {formatDate(open.createdAt)}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <a
                className="btn btn-sm"
                href={`mailto:${open.email}?subject=${encodeURIComponent(
                  "Re: your message to Technograph",
                )}`}
              >
                <Icon name="mail" size={15} /> Reply
              </a>
              {open.status !== "ARCHIVED" ? (
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={busyId === open.id}
                  onClick={() => setStatus(open, "ARCHIVED")}
                >
                  Archive
                </button>
              ) : (
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={busyId === open.id}
                  onClick={() => setStatus(open, "READ")}
                >
                  Unarchive
                </button>
              )}
              <button
                className="btn btn-ghost btn-sm"
                disabled={busyId === open.id}
                onClick={() => remove(open)}
                style={{ color: "var(--bad)" }}
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {notice && (
          <div
            className="card"
            role="alert"
            style={{
              marginBottom: 18,
              borderColor: "var(--bad)",
              color: "var(--bad)",
              fontSize: 13,
            }}
          >
            {notice}
          </div>
        )}

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {error ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
              {error}{" "}
              <button className="link" onClick={load} style={{ fontSize: 13 }}>
                Retry
              </button>
            </div>
          ) : loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
              Loading…
            </div>
          ) : visible.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
              {messages.length === 0
                ? "No messages yet. Submissions from the public contact form land here."
                : "No messages match this filter."}
            </div>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Intent</th>
                  <th>Message</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {visible.map((m) => {
                  const tag = statusTag[m.status];
                  const unread = m.status === "NEW";
                  return (
                    <tr
                      key={m.id}
                      onClick={() => openMessage(m)}
                      style={{
                        cursor: "pointer",
                        fontWeight: unread ? 600 : undefined,
                      }}
                    >
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                          <span className="av av-sm">{initials(m.name)}</span>
                          <div>
                            <div style={{ fontWeight: 600 }}>{m.name}</div>
                            <div style={{ fontSize: 12, color: "var(--muted)" }}>
                              {m.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 13 }}>{m.intent ?? "—"}</td>
                      <td
                        style={{
                          fontSize: 13,
                          color: "var(--muted)",
                          maxWidth: 320,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {m.message?.trim() || "—"}
                      </td>
                      <td
                        className="num-c"
                        style={{ fontSize: 12, color: "var(--muted)" }}
                      >
                        {formatDate(m.createdAt)}
                      </td>
                      <td>
                        <span className={tag.cls}>{tag.label}</span>
                      </td>
                      <td
                        style={{ textAlign: "right", whiteSpace: "nowrap" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {unread && (
                          <button
                            className="link-muted"
                            onClick={() => setStatus(m, "READ")}
                            disabled={busyId === m.id}
                            style={{ marginRight: 14 }}
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          className="link-muted"
                          onClick={() => openMessage(m)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
