"use client";

import { useCallback, useEffect, useState } from "react";
import { Topbar } from "@/components/portal/Topbar";
import { Icon, initials } from "@/components/portal/icons";
import { ApiError } from "@/lib/auth-api";
import { employerApi, type ClientRow } from "@/lib/employer/invites-api";

/** "2026-01-13T06:00:00Z" → "Jan 13, 2026". */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

type FormState = { mode: "add" } | { mode: "edit"; client: ClientRow };

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();

  const [form, setForm] = useState<FormState | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [deletingId, setDeletingId] = useState<string>();

  const load = useCallback(() => {
    setLoading(true);
    employerApi
      .listClients()
      .then((rows) => {
        setClients(rows);
        setError(undefined);
      })
      .catch(() => setError("Couldn't load clients."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setForm({ mode: "add" });
    setName("");
    setLocation("");
    setFormError(undefined);
    setNotice(undefined);
  }

  function openEdit(client: ClientRow) {
    setForm({ mode: "edit", client });
    setName(client.name);
    setLocation(client.location ?? "");
    setFormError(undefined);
    setNotice(undefined);
  }

  function closeForm() {
    setForm(null);
    setFormError(undefined);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setFormError(undefined);
    if (!name.trim()) {
      setFormError("Enter the client's name.");
      return;
    }
    setBusy(true);
    try {
      if (form.mode === "add") {
        await employerApi.createClient({
          name: name.trim(),
          location: location.trim() || undefined,
        });
      } else {
        await employerApi.updateClient(form.client.id, {
          name: name.trim(),
          location: location.trim() || undefined,
        });
      }
      closeForm();
      load();
    } catch (err) {
      setFormError(
        err instanceof ApiError && err.status === 403
          ? "Only an admin can manage clients."
          : err instanceof ApiError
            ? err.message
            : "Couldn't save the client.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(client: ClientRow) {
    setNotice(undefined);
    if (client.employeeCount > 0) return; // guarded in UI and API
    if (
      !window.confirm(
        `Delete ${client.name}? This can't be undone.`,
      )
    )
      return;
    setDeletingId(client.id);
    try {
      await employerApi.deleteClient(client.id);
      if (form?.mode === "edit" && form.client.id === client.id) closeForm();
      load();
    } catch (err) {
      setNotice(
        err instanceof ApiError ? err.message : "Couldn't delete the client.",
      );
    } finally {
      setDeletingId(undefined);
    }
  }

  return (
    <>
      <Topbar
        kicker="Admin · Clients"
        title="Clients"
        sub={
          loading
            ? "Loading clients…"
            : `${clients.length} client ${clients.length === 1 ? "company" : "companies"} on record`
        }
        actions={
          !form && (
            <button className="btn btn-sm" onClick={openAdd}>
              <Icon name="plus" size={15} /> Add client
            </button>
          )
        }
      />
      <div className="content">
        {form && (
          <form
            onSubmit={submit}
            noValidate
            className="card"
            style={{ marginBottom: 18 }}
          >
            <div className="between" style={{ alignItems: "flex-start" }}>
              <div>
                <span className="eyebrow" style={{ gap: 0 }}>
                  {form.mode === "add" ? "New client" : "Edit client"}
                </span>
                <h3 style={{ fontSize: 17, marginTop: 4 }}>
                  {form.mode === "add" ? "Add a client" : form.client.name}
                </h3>
              </div>
            </div>
            <div className="rule" style={{ margin: "16px 0 18px" }} />
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
            >
              <div>
                <label className="field-label">Client name</label>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="field-label">Location</label>
                <input
                  className="input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            {formError && (
              <p className="err" role="alert">
                {formError}
              </p>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button type="submit" className="btn btn-sm" disabled={busy}>
                {busy
                  ? "Saving…"
                  : form.mode === "add"
                    ? "Save client"
                    : "Save changes"}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={closeForm}
              >
                Cancel
              </button>
            </div>
          </form>
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
          ) : clients.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
              No clients yet. Click <strong>Add client</strong> to create one.
            </div>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Location</th>
                  <th>Employees</th>
                  <th>Added</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => {
                  const locked = c.employeeCount > 0;
                  return (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                          <span className="av av-sm">{initials(c.name)}</span>
                          <div style={{ fontWeight: 600 }}>{c.name}</div>
                        </div>
                      </td>
                      <td>{c.location ?? "—"}</td>
                      <td>
                        <span className={"tag" + (locked ? " tag-copper" : "")}>
                          {c.employeeCount}
                        </span>
                      </td>
                      <td
                        className="num-c"
                        style={{ fontSize: 12, color: "var(--muted)" }}
                      >
                        {formatDate(c.createdAt)}
                      </td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <button
                          className="link-muted"
                          onClick={() => openEdit(c)}
                          style={{ marginRight: 14 }}
                        >
                          Edit
                        </button>
                        <button
                          className="link-muted"
                          onClick={() => remove(c)}
                          disabled={locked || deletingId === c.id}
                          title={
                            locked
                              ? "Reassign or remove employees before deleting"
                              : "Delete client"
                          }
                          style={{
                            color: locked ? "var(--muted-2)" : "var(--bad)",
                            cursor: locked ? "not-allowed" : "pointer",
                          }}
                        >
                          {deletingId === c.id ? "Deleting…" : "Delete"}
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
