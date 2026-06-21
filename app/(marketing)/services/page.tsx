import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "IT Staffing & Consulting Services | Cloud, AEM, Big Data, AI | Technograph",
  description:
    "Explore Technograph's expert IT services — from cloud infrastructure and data analytics to AEM, AI, and digital transformation. Build smarter, scale faster.",
};

type ServiceItem = { term: string; def: string };
type Service = {
  no: string;
  title: string;
  tagline: string;
  label: string;
  href: string;
  cta: string;
  items: ServiceItem[];
};

const services: Service[] = [
  {
    no: "SERVICE 01",
    title: "Cloud Solutions & Data Analytics",
    tagline: "Architect. Scale. Transform.",
    label: "Cloud architecture & data pipeline",
    href: "/services/cloud",
    cta: "Explore Cloud Solutions & Data Analytics →",
    items: [
      {
        term: "AWS · Azure · Google Cloud",
        def: "Certified experts in architecture, security, DevOps, and scalability.",
      },
      {
        term: "Data Engineering & Warehousing",
        def: "From ingestion to transformation and visualization.",
      },
      {
        term: "Real-Time Analytics",
        def: "Turn insights into action with low-latency, high-impact dashboards.",
      },
    ],
  },
  {
    no: "SERVICE 02",
    title: "AEM & Content Platforms",
    tagline: "Deliver immersive digital experiences at scale.",
    label: "Digital experience · content platform",
    href: "/services/aem",
    cta: "Explore Adobe Experience Manager →",
    items: [
      {
        term: "Centralize digital assets & campaigns",
        def: "One source of truth for every brand touchpoint.",
      },
      {
        term: "Personalize customer journeys",
        def: "Tailored experiences across every channel.",
      },
      {
        term: "Integrate with marketing, CRM & eCommerce",
        def: "Every interaction seamless, data-informed, and on-brand.",
      },
    ],
  },
  {
    no: "SERVICE 03",
    title: "Big Data Solutions",
    tagline: "Unlock the power inside your data.",
    label: "Big data cluster · processing",
    href: "/services/big-data",
    cta: "Explore Big Data Solutions →",
    items: [
      {
        term: "Hadoop · Spark · Kafka · NoSQL",
        def: "Deep expertise across the modern data stack.",
      },
      {
        term: "Architecture, ETL & pipeline management",
        def: "End-to-end, from structured to unstructured, batch to stream.",
      },
      {
        term: "Predictive analytics & ML readiness",
        def: "Activate massive datasets across industries.",
      },
    ],
  },
  {
    no: "SERVICE 04",
    title: "Emerging Technologies & Innovation",
    tagline: "Future-proof your business.",
    label: "Emerging tech lab · prototyping",
    href: "/services/emerging-tech",
    cta: "Explore Emerging Technologies & Innovation →",
    items: [
      {
        term: "AI & Machine Learning",
        def: "Test, scale, and deploy intelligent systems.",
      },
      {
        term: "Blockchain & Decentralized Systems",
        def: "Secure, transparent, distributed architectures.",
      },
      {
        term: "IoT, Edge, Computer Vision & NLP",
        def: "Innovation we engineer every day — not just a buzzword.",
      },
    ],
  },
  {
    no: "SERVICE 05",
    title: "Digital Transformation Consulting",
    tagline: "Change is complex. We make it actionable.",
    label: "Transformation roadmap session",
    href: "/services/digital-transformation",
    cta: "Explore Digital Transformation Consulting →",
    items: [
      {
        term: "Reimagine legacy systems",
        def: "Modern tech, modern outcomes.",
      },
      {
        term: "Automate & improve process efficiency",
        def: "Digital tools that remove friction.",
      },
      {
        term: "Bridge business strategy & IT execution",
        def: "We co-create your roadmap for resilience and growth.",
      },
    ],
  },
];

const reasons = [
  {
    title: "Deep domain expertise",
    desc: "Specialists who speak your industry's language from day one.",
  },
  {
    title: "Pre-vetted, high-performing talent",
    desc: "Access a curated network of proven professionals.",
  },
  {
    title: "Fast turnaround, no compromise",
    desc: "Speed that never comes at the cost of quality.",
  },
  {
    title: "Strategic alignment",
    desc: "A true partner invested in your long-term outcomes.",
  },
];

function Check() {
  return (
    <span className="check">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8.5l3.5 3.5L13 4.5" />
      </svg>
    </span>
  );
}

export default function ServicesPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">
            <span className="tick"></span>Services
          </span>
          <h1 className="display">
            Expert IT talent. End-to-end solutions. Delivered with{" "}
            <span className="accent">precision.</span>
          </h1>
          <p className="lead">
            We bring you the right people, with the right skills, at the right
            time — every time.
          </p>
        </div>
      </section>

      {/* ============ INTRO ============ */}
      <section className="section-sm">
        <div className="wrap editorial">
          <div className="head reveal">
            <span className="eyebrow">
              <span className="tick"></span>Why it matters
            </span>
          </div>
          <div className="prose reveal d1">
            <p>
              In today&apos;s tech-driven economy, your competitive edge depends
              on how quickly you can adapt, scale, and innovate. That&apos;s
              where we come in.
            </p>
            <p>
              At Technograph, we combine elite talent sourcing with deep
              technical expertise across mission-critical domains — helping
              businesses build the digital backbone they need to thrive. Whether
              you&apos;re launching a new product, modernizing infrastructure, or
              scaling operations, we plug in top-tier professionals who deliver
              from day one.
            </p>
          </div>
        </div>
      </section>

      {/* ============ CORE SERVICES ============ */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="wrap">
          <div style={{ maxWidth: "640px" }} className="reveal">
            <span className="eyebrow">
              <span className="tick"></span>Our core services
            </span>
            <h2 style={{ marginTop: "18px" }}>
              Five disciplines. One standard of excellence.
            </h2>
          </div>

          <div style={{ marginTop: "64px" }}>
            {services.map((s) => (
              <div className="svc-row" key={s.no}>
                <div className="svc-media reveal">
                  <div className="ph" data-label={s.label}></div>
                </div>
                <div className="svc-copy reveal d1">
                  <span className="svc-num">{s.no}</span>
                  <h2>{s.title}</h2>
                  <div className="tagline">{s.tagline}</div>
                  <ul className="svc-list">
                    {s.items.map((it) => (
                      <li key={it.term}>
                        <div className="term">{it.term}</div>
                        <div className="def">{it.def}</div>
                      </li>
                    ))}
                  </ul>
                  <Link
                    className="link-arrow"
                    href={s.href}
                    style={{ display: "inline-flex", marginTop: "26px" }}
                  >
                    {s.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY CLIENTS CHOOSE ============ */}
      <section className="section">
        <div className="wrap">
          <div style={{ maxWidth: "640px" }} className="reveal">
            <span className="eyebrow">
              <span className="tick"></span>Why clients choose Technograph
            </span>
            <h2 style={{ marginTop: "18px" }}>
              Strategic alignment — not just transactional delivery.
            </h2>
          </div>
          <div className="choose-grid" style={{ marginTop: "46px" }}>
            {reasons.map((r, i) => (
              <div
                className={`choose-item reveal${i % 2 === 1 ? " d1" : ""}`}
                key={r.title}
              >
                <Check />
                <div>
                  <h4>{r.title}</h4>
                  <p>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="section-sm">
        <div className="wrap">
          <div
            className="dark reveal"
            style={{
              borderRadius: "var(--r-lg)",
              padding: "80px 56px",
              textAlign: "center",
            }}
          >
            <span className="eyebrow">
              <span className="tick"></span>Let&apos;s build together
            </span>
            <h2
              style={{
                marginTop: "20px",
                maxWidth: "760px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Looking to scale your tech team or solve a complex challenge?
            </h2>
            <p
              className="lead"
              style={{ margin: "18px auto 34px", maxWidth: "520px" }}
            >
              Let&apos;s explore how we can bring the right minds to your mission.
            </p>
            <Link href="/contact" className="btn btn-copper">
              Request a Consultation →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
