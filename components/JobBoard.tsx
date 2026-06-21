"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { careersApi, type PublicJob } from "@/lib/careers-api";

export default function JobBoard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    careersApi
      .listJobs()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  // Department pills come from whatever published roles exist.
  const teams = useMemo(() => {
    const set = new Set(
      jobs.map((j) => j.department).filter((d): d is string => Boolean(d)),
    );
    return ["all", ...Array.from(set).sort()];
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      const matchTeam = team === "all" || j.department === team;
      const hay = `${j.title} ${j.department ?? ""} ${j.location ?? ""} ${j.engagementType ?? ""}`;
      return matchTeam && (!q || hay.toLowerCase().includes(q));
    });
  }, [jobs, team, query]);

  const count = filtered.length;

  return (
    <>
      <div className="board-head reveal">
        <div style={{ maxWidth: "560px" }}>
          <span className="eyebrow">
            <span className="tick"></span>Open roles
          </span>
          <h2 style={{ marginTop: "18px" }}>Find your next role.</h2>
        </div>
        <span className="job-count">
          {loading
            ? "Loading…"
            : `${count} ${count === 1 ? "open role" : "open roles"}`}
        </span>
      </div>

      <div className="filters reveal">
        <div className="chips">
          {teams.map((t) => (
            <button
              key={t}
              className={`chip${t === team ? " active" : ""}`}
              onClick={() => setTeam(t)}
            >
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>
        <div className="search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="7" cy="7" r="5" />
            <path d="M11 11l3 3" />
          </svg>
          <input
            type="text"
            aria-label="Search roles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="jobs">
        {filtered.map((j) => (
          <div
            className="job"
            key={j.jobCode}
            onClick={() => router.push(`/careers/${j.jobCode}`)}
          >
            <div>
              <div className="title">{j.title}</div>
              <div className="dept">{j.department ?? "—"}</div>
            </div>
            <div className="meta">{j.location ?? "—"}</div>
            <div className="meta">{j.engagementType ?? "—"}</div>
            <span className="apply">Apply →</span>
          </div>
        ))}
      </div>
      {!loading && count === 0 && (
        <div className="no-results">
          {jobs.length === 0
            ? "No open roles right now. Check back soon — or send us your résumé below."
            : "No roles match that search. Try a different keyword."}
        </div>
      )}
    </>
  );
}
