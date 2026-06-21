import Link from "next/link";
import type { ReactNode } from "react";

type Spec = {
  icon: ReactNode;
  title: string;
  tagline: string;
  desc: string;
  delay?: string;
};

const specs: Spec[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="5" rx="1.5" />
        <rect x="3" y="14" width="18" height="5" rx="1.5" />
        <circle cx="7" cy="6.5" r="0.4" fill="currentColor" />
        <circle cx="7" cy="16.5" r="0.4" fill="currentColor" />
      </svg>
    ),
    title: "Cloud Solutions",
    tagline: "Architect for agility. Scale with confidence.",
    desc: "Certified AWS, Azure & GCP professionals who design, deploy, and optimize infrastructure that grows with your business — from security to cost efficiency.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="20" x2="5" y2="12" />
        <line x1="12" y1="20" x2="12" y2="6" />
        <line x1="19" y1="20" x2="19" y2="15" />
      </svg>
    ),
    title: "Big Data & Analytics",
    tagline: "Turn complex data into actionable insight.",
    desc: "Data engineers and analysts who build real-time pipelines, scalable architectures, and intuitive dashboards — so you move at the speed of insight.",
    delay: "d1",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="11" height="11" rx="1.5" />
        <rect x="9" y="9" width="11" height="11" rx="1.5" />
      </svg>
    ),
    title: "Adobe Experience Manager",
    tagline: "Personalized digital experiences at scale.",
    desc: "AEM consultants who craft seamless content ecosystems — centralizing assets, personalizing journeys, and integrating with your MarTech stack.",
    delay: "d2",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" />
      </svg>
    ),
    title: "Cybersecurity & Compliance",
    tagline: "Secure your future. Protect what matters.",
    desc: "Security experts who navigate evolving threats and global compliance — from risk assessments to identity and access management.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <circle cx="5" cy="6" r="1.6" />
        <circle cx="19" cy="6" r="1.6" />
        <circle cx="19" cy="18" r="1.6" />
        <path d="M6.3 7.1l3.6 3.2M17.7 7.1l-3.6 3.2M17.7 16.9l-3.6-3.2" />
      </svg>
    ),
    title: "Open-Source & Java",
    tagline: "Build fast. Build strong. Build right.",
    desc: "Full-stack developers and architects specialized in robust Java ecosystems — Spring, Hibernate, microservices — that scale efficiently.",
    delay: "d1",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="12" r="3" />
        <line x1="9" y1="12" x2="15" y2="12" />
      </svg>
    ),
    title: "Systems Integration",
    tagline: "Connect the old with the new — without the chaos.",
    desc: "Integration specialists who bridge legacy systems with modern tools — from ERP modernization to API-based architectures that work as one.",
    delay: "d2",
  },
];

const stats = [
  { num: "20+", lbl: "Years building what's next" },
  { num: "6", lbl: "Core technology practices", delay: "d1" },
  { num: "Global", lbl: "Enterprise partnerships worldwide", delay: "d2" },
  { num: "Certified", lbl: "AWS · Azure · Google Cloud talent", delay: "d3" },
];

const steps = [
  {
    no: "STEP 01",
    title: "Discovery & Strategy",
    desc: "Every partnership starts with a conversation. We work closely with your stakeholders to define project goals, role requirements, team structure, and success metrics — building a strong foundation for everything that follows.",
  },
  {
    no: "STEP 02",
    title: "Talent Mapping",
    desc: "We don't just search — we strategize. Combining domain expertise, structured sourcing frameworks, and AI-powered tools, we curate a shortlist of high-fit candidates who are technically strong and culturally aligned.",
    delay: "d1",
  },
  {
    no: "STEP 03",
    title: "Seamless Onboarding",
    desc: "Placement is just the beginning. We support the full onboarding journey, ensure a smooth transition into your environment, and check in regularly to support long-term performance and retention.",
    delay: "d2",
  },
];

export default function Home() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-grid wrap">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="tick"></span>Purpose-driven IT talent
            </span>
            <h1 className="display">
              Smarter talent.
              <br />
              Stronger systems.
              <br />
              Future-ready <span className="accent">IT.</span>
            </h1>
            <p className="lead">
              Technograph helps companies scale with precision — elite IT talent,
              advanced technology expertise, and strategic partnerships built to
              last.
            </p>
            <div className="hero-cta">
              <Link href="/contact" className="btn btn-dark">
                Talk to us →
              </Link>
              <Link href="/services" className="btn btn-ghost">
                Explore services
              </Link>
            </div>
          </div>
          <div className="hero-media">
            <div className="ph" data-label="Modern enterprise team at work"></div>
            <div className="hero-float">
              <div className="big">20+</div>
              <div className="desc">
                Years aligning talent with business purpose.
              </div>
              <div className="tags">CLOUD · DATA · AI · SECURITY</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STAT BAND ============ */}
      <section className="statband">
        <div className="wrap">
          <div className="statband-grid">
            {stats.map((s) => (
              <div
                key={s.lbl}
                className={`cell reveal${s.delay ? ` ${s.delay}` : ""}`}
              >
                <div className="num">{s.num}</div>
                <div className="lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INTRO ============ */}
      <section className="section">
        <div className="wrap intro-grid">
          <div className="intro-copy reveal">
            <span className="eyebrow">
              <span className="tick"></span>Who we are
            </span>
            <h2 style={{ marginTop: "18px" }}>
              20+ years of building what&apos;s next.
            </h2>
            <div className="stack" style={{ marginTop: "24px" }}>
              <p className="body">
                For over two decades, we&apos;ve helped businesses transform the
                way they hire, build, and innovate. Our journey began with one
                belief — that great technology starts with the right people.
              </p>
              <p className="body">
                Today, we partner with visionary enterprises worldwide to deliver
                elite IT talent that fuels smarter decisions, faster execution,
                and long-term resilience.
              </p>
              <p className="body">
                We&apos;re not just helping companies fill roles. We&apos;re
                aligning talent with business purpose — across cloud, big data,
                digital platforms, and everything in between.
              </p>
            </div>
            <Link
              href="/about"
              className="link-arrow"
              style={{ marginTop: "28px" }}
            >
              Read our story →
            </Link>
          </div>
          <div className="intro-media reveal d2">
            <div className="ph" data-label="Founding team · strategy session"></div>
            <div className="badge">
              <div className="n">Est. 2005</div>
              <div className="t">Two decades of partnership</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SPECIALISATIONS ============ */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="wrap">
          <div style={{ maxWidth: "680px" }} className="reveal">
            <span className="eyebrow">
              <span className="tick"></span>What we do best
            </span>
            <h2 style={{ marginTop: "18px" }}>
              Specialisations that move the needle.
            </h2>
            <p className="lead" style={{ marginTop: "18px" }}>
              Deep, certified expertise across the disciplines that define modern
              enterprise technology.
            </p>
          </div>
          <div className="spec-grid" style={{ marginTop: "54px" }}>
            {specs.map((s) => (
              <div
                key={s.title}
                className={`card lift spec-card reveal${
                  s.delay ? ` ${s.delay}` : ""
                }`}
              >
                <div className="icon-chip">{s.icon}</div>
                <h3>{s.title}</h3>
                <div className="tagline">{s.tagline}</div>
                <p className="desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY WORK WITH US ============ */}
      <section className="section dark why">
        <div className="wrap why-grid">
          <div className="reveal">
            <span className="eyebrow">
              <span className="tick"></span>Why work with us
            </span>
            <p className="big-statement" style={{ marginTop: "22px" }}>
              Your challenges deserve more than a vendor. They deserve a{" "}
              <span className="accent">partner.</span>
            </p>
          </div>
          <div className="reveal d2">
            <p className="body" style={{ fontSize: "17px" }}>
              At Technograph, we take the time to understand your goals, culture,
              and tech stack — then bring you people who move the needle.
            </p>
            <p className="body" style={{ fontSize: "17px", marginTop: "18px" }}>
              Our team is composed of former engineers, consultants, and
              technologists who speak your language and solve your business
              problems — not just staffing gaps.
            </p>
            <Link
              href="/about"
              className="link-arrow"
              style={{ marginTop: "28px" }}
            >
              What we stand for →
            </Link>
          </div>
        </div>
      </section>

      {/* ============ HOW WE WORK ============ */}
      <section className="section process">
        <div className="wrap">
          <div style={{ maxWidth: "680px" }} className="reveal">
            <span className="eyebrow">
              <span className="tick"></span>How we work
            </span>
            <h2 style={{ marginTop: "18px" }}>
              Tailored solutions. Transparent process. Tangible results.
            </h2>
          </div>
          <div className="process-grid">
            {steps.map((st) => (
              <div
                key={st.no}
                className={`process-step reveal${st.delay ? ` ${st.delay}` : ""}`}
              >
                <span className="step-no">{st.no}</span>
                <h3>{st.title}</h3>
                <p className="desc">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="section-sm">
        <div className="wrap">
          <div
            className="dark cta-strip reveal"
            style={{ borderRadius: "var(--r-lg)", padding: "80px 56px" }}
          >
            <span className="eyebrow">
              <span className="tick"></span>Let&apos;s build together
            </span>
            <h2 style={{ marginTop: "20px" }}>
              Ready to build a future-ready workforce?
            </h2>
            <p className="lead">Let&apos;s find the right minds for your mission.</p>
            <Link href="/contact" className="btn btn-copper">
              Talk to a Talent Acquisition Manager →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
