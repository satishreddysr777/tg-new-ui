"use client";

import { useCallback, useEffect, useState } from "react";
import { Topbar } from "@/components/portal/Topbar";
import { Body, Panel, Table, td } from "@/components/console/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/auth-api";
import { employerApi, type ClientRow } from "@/lib/employer/invites-api";

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
    if (client.employeeCount > 0) return;
    if (!window.confirm(`Delete ${client.name}? This can't be undone.`)) return;
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
          !form ? (
            <Button variant="navy" onClick={openAdd}>Add client</Button>
          ) : undefined
        }
      />
      <Body>
        {form && (
          <Panel title={form.mode === "add" ? "New client" : "Edit client"}>
            <p className="mb-4 text-sm text-muted-foreground">
              {form.mode === "add"
                ? "Add a client company to your directory."
                : "Update this client's details."}
            </p>
            <form onSubmit={submit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Client name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </div>
              {formError && <p className="mt-3 text-sm text-destructive">{formError}</p>}
              <div className="mt-4 flex gap-2">
                <Button type="submit" variant="navy" disabled={busy}>
                  {busy
                    ? "Saving…"
                    : form.mode === "add"
                      ? "Save client"
                      : "Save changes"}
                </Button>
                <Button type="button" variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </Panel>
        )}

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
          <Table head={["Client", "Location", "Employees", "Added", ""]}>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No clients yet. Click Add client to create one.
                </td>
              </tr>
            ) : (
              clients.map((c) => {
                const locked = c.employeeCount > 0;
                return (
                  <tr key={c.id}>
                    <td className={td + " font-medium text-navy"}>{c.name}</td>
                    <td className={td}>{c.location ?? "—"}</td>
                    <td className={td}>{c.employeeCount}</td>
                    <td className={td}>{formatDate(c.createdAt)}</td>
                    <td className={td + " text-right"}>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(c)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        disabled={locked || deletingId === c.id}
                        title={
                          locked
                            ? "Reassign or remove employees before deleting"
                            : "Delete client"
                        }
                        onClick={() => remove(c)}
                      >
                        {deletingId === c.id ? "Deleting…" : "Delete"}
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </Table>
        )}
      </Body>
    </>
  );
}
