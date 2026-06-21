import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import JobBoard from "@/components/JobBoard";

export const metadata: Metadata = {
  title: "Careers at Technograph | Build What's Next",
  description:
    "Join Technograph — a remote-first IT staffing and consulting firm. Work alongside elite engineers, consultants, and technologists on the problems that define modern enterprise tech.",
};

type Perk = { icon: ReactNode; title: string; desc: string };

const perks: Perk[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
      </svg>
    ),
    title: "Remote-first",
    desc: "Work from anywhere in the US. We're built for distributed teams, not mandatory desks.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4l8 4-8 4-8-4 8-4z" />
        <path d="M6 10v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
      </svg>
    ),
    title: "Learn from the best",
    desc: "Sit alongside senior architects and consultants on Fortune-class problems every day.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V8M10 20V4M16 20v-7M22 20H2" />
      </svg>
    ),
    title: "Real growth paths",
    desc: "Certifications, mentorship, and clear ladders — we invest in where you're headed.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 11c0 5.5-7 10-7 10z" />
      </svg>
    ),
    title: "Benefits that matter",
    desc: "Full medical, 401(k) match, generous PTO, and a learning stipend that's actually usable.",
  },
];

export default function CareersPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">
            <span className="tick"></span>Careers
          </span>
          <h1 className="display">
            Build a career that builds the <span className="accent">future.</span>
          </h1>
          <p className="lead">
            We&apos;re a team of former engineers, consultants, and technologists
            who solve real business problems. If you want to work on the
            technology that defines the modern enterprise — with people who take
            the craft seriously — you&apos;ll fit right in.
          </p>
          <Link href="#openings" className="btn btn-dark" style={{ marginTop: "30px" }}>
            See open roles →
          </Link>
        </div>
        <div className="wrap page-hero-media reveal">
          <div className="ph" data-label="Life at Technograph · team"></div>
        </div>
      </section>

      {/* ============ LIFE / PERKS ============ */}
      <section className="section">
        <div className="wrap">
          <div style={{ maxWidth: "640px" }} className="reveal">
            <span className="eyebrow">
              <span className="tick"></span>Life at Technograph
            </span>
            <h2 style={{ marginTop: "18px" }}>
              Work that respects your craft — and your life.
            </h2>
          </div>
          <div className="perks-grid" style={{ marginTop: "50px" }}>
            {perks.map((p, i) => (
              <div className={`perk reveal${i ? ` d${i}` : ""}`} key={p.title}>
                <div className="icon-chip">{p.icon}</div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ OPENINGS ============ */}
      <section className="section" id="openings" style={{ background: "var(--paper-2)" }}>
        <div className="wrap">
          <JobBoard />
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="section-sm">
        <div className="wrap">
          <div
            className="dark reveal"
            style={{
              borderRadius: "var(--r-lg)",
              padding: "88px 56px",
              textAlign: "center",
            }}
          >
            <span className="eyebrow">
              <span className="tick"></span>Don&apos;t see your role?
            </span>
            <h2
              style={{
                marginTop: "20px",
                maxWidth: "720px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              We&apos;re always looking for exceptional people.
            </h2>
            <p
              className="lead"
              style={{ margin: "18px auto 34px", maxWidth: "520px" }}
            >
              Send us your résumé and tell us what you&apos;re great at. When the
              right opening appears, you&apos;ll be first to know.
            </p>
            <Link href="/contact" className="btn btn-copper">
              Send your résumé →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
