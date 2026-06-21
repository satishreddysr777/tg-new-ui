import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Technograph | IT Staffing & Digital Innovation Partner",
  description:
    "Discover our 20-year legacy of innovation across cloud, big data, and next-gen infrastructure. Discover how Technograph enables businesses to scale with top-tier IT talent.",
};

const values = [
  {
    n: "01",
    title: "Precision in Talent",
    desc: "We don't just place candidates — we integrate experts who understand your industry, your tools, and your timeline.",
  },
  {
    n: "02",
    title: "Partnership, Not Just Placement",
    desc: "Every client engagement is a collaboration. We embed ourselves in your challenges and act as strategic allies.",
  },
  {
    n: "03",
    title: "Visionary Recruiting",
    desc: "We scout not just for skills, but for foresight — identifying individuals who can grow with your business, not just fit into it today.",
  },
];

const areas = [
  {
    n: "01",
    title: "Next-Gen Infrastructure",
    desc: "Build the digital backbone your business needs to scale. We deploy experts who architect modern, cloud-based, and hybrid infrastructures that support agility, security, and long-term growth.",
  },
  {
    n: "02",
    title: "Human Capital Tech",
    desc: "Empower your workforce through smarter platforms. From HCM tools to employee engagement systems, we implement technology that elevates how your people work, collaborate, and grow.",
  },
  {
    n: "03",
    title: "Data Visualisation & Analytics",
    desc: "Find the signal in the noise — and act on it. Our analytics professionals design dashboards and reporting systems that turn raw data into real-time insights for faster, smarter decisions.",
  },
  {
    n: "04",
    title: "Master Data Management",
    desc: "Make your data clean, complete, and trustworthy. We help organizations build centralized, accurate, and consistent data environments that support reporting, compliance, and transformation.",
  },
  {
    n: "05",
    title: "Enterprise Collaboration",
    desc: "Unleash the full potential of team productivity. Whether Microsoft Teams, Slack, Confluence, or custom suites, we improve communication, content management, and knowledge sharing.",
  },
  {
    n: "06",
    title: "Pervasive Computing",
    desc: "Bring intelligent technology into everyday workflows. From IoT to edge computing, we embed smart devices and systems that drive automation, efficiency, and smarter interactions in real time.",
  },
  {
    n: "07",
    title: "Cybersecurity Strategy",
    desc: "Protect what matters most with proactive defence. Our consultants develop comprehensive strategies that secure your data, safeguard infrastructure, and ensure compliance in an evolving threat landscape.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">
            <span className="tick"></span>About Technograph
          </span>
          <h1 className="display">
            Tech talent that moves business <span className="accent">forward.</span>
          </h1>
          <p className="lead">
            We don&apos;t just scout talent — we engineer long-term impact. For
            more than two decades, Technograph has been the trusted partner to
            businesses seeking future-ready IT solutions.
          </p>
        </div>
        <div className="wrap page-hero-media reveal">
          <div className="ph" data-label="Technograph leadership & consultants"></div>
        </div>
      </section>

      {/* ============ WHO WE ARE ============ */}
      <section className="section">
        <div className="wrap editorial">
          <div className="head reveal">
            <span className="eyebrow">
              <span className="tick"></span>Who we are
            </span>
            <h2 style={{ marginTop: "18px" }}>
              Born at the intersection of innovation and integrity.
            </h2>
          </div>
          <div className="prose reveal d1">
            <p>
              For more than 20 years, Technograph has been a trusted partner to
              businesses seeking future-ready IT solutions. We exist to bridge
              the gap between high-growth ambitions and the technical talent that
              brings them to life.
            </p>
            <p>
              Our roots run deep in the IT ecosystem — spanning Java-based
              frameworks, open-source solutions, cloud platforms, cybersecurity,
              and data science. But what truly sets us apart is how we match the
              right people to the right problems, and deliver results that last.
            </p>
          </div>
        </div>
      </section>

      {/* ============ WHAT WE STAND FOR ============ */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="wrap">
          <div style={{ maxWidth: "640px" }} className="reveal">
            <span className="eyebrow">
              <span className="tick"></span>What we stand for
            </span>
            <h2 style={{ marginTop: "18px" }}>
              Principles that shape every placement.
            </h2>
          </div>
          <div className="values-grid" style={{ marginTop: "50px" }}>
            {values.map((v, i) => (
              <div
                className={`value-card reveal${i ? ` d${i}` : ""}`}
                key={v.n}
              >
                <div className="vn">{v.n}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOCUS AREAS ============ */}
      <section className="section">
        <div className="wrap">
          <div style={{ maxWidth: "680px" }} className="reveal">
            <span className="eyebrow">
              <span className="tick"></span>Our focus areas
            </span>
            <h2 style={{ marginTop: "18px" }}>
              Talent that transforms entire ecosystems.
            </h2>
            <p className="lead" style={{ marginTop: "18px" }}>
              We deliver the kind of strategic talent that shapes how
              organizations operate, scale, and succeed — where innovation meets
              execution.
            </p>
          </div>
          <div style={{ marginTop: "48px" }}>
            {areas.map((a) => (
              <div className="area-row reveal" key={a.n}>
                <div className="an">{a.n}</div>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SIGNATURE OFFERING ============ */}
      <section className="section-sm">
        <div className="wrap">
          <div className="feature dark reveal">
            <div className="copy">
              <span className="eyebrow">
                <span className="tick"></span>Our signature offering
              </span>
              <h2 style={{ marginTop: "18px" }}>
                Custom Talent Integration Solutions
              </h2>
              <p
                className="body"
                style={{ marginTop: "18px", fontSize: "16.5px" }}
              >
                This isn&apos;t just a staffing model — it&apos;s a
                precision-built process to identify, align, and integrate the
                right minds into your business.
              </p>
              <p
                className="body"
                style={{ marginTop: "16px", fontSize: "16.5px" }}
              >
                Every placement is shaped by your unique goals, culture, and
                vision. We go beyond the resume — assessing adaptability,
                foresight, and long-term potential — ensuring every hire is a
                strategic match, not just a technical one.
              </p>
            </div>
            <div className="media">
              <div className="ph dark" data-label="Integration workshop · whiteboard"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL NOTE / CTA ============ */}
      <section className="section">
        <div className="wrap">
          <div className="signoff reveal">
            <span className="eyebrow">
              <span className="tick"></span>A final note
            </span>
            <p style={{ marginTop: "24px" }}>
              At Technograph, we believe talent is the true engine of digital
              transformation. If you&apos;re building something that matters,
              we&apos;ll help you build it right.
            </p>
            <Link
              href="/contact"
              className="btn btn-dark"
              style={{ marginTop: "34px" }}
            >
              Let&apos;s talk →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
