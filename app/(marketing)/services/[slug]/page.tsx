import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { services, getService } from "@/lib/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const svc = getService(params.slug);
  if (!svc) return {};
  return { title: svc.metaTitle, description: svc.metaDescription };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const svc = getService(params.slug);
  if (!svc) notFound();

  const related = services.filter((s) => s.slug !== svc.slug);

  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">
            <span className="tick"></span>
            {svc.eyebrow}
          </span>
          <h1 className="display">{svc.title}</h1>
          <p className="lead">{svc.lead}</p>
          <div style={{ display: "flex", gap: "14px", marginTop: "30px", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-dark">
              Talk to us →
            </Link>
            <Link href="/services" className="btn btn-ghost">
              All services
            </Link>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="section">
        <div className="wrap editorial">
          <div className="head reveal">
            <span className="eyebrow">
              <span className="tick"></span>Overview
            </span>
            <h2 style={{ marginTop: "18px" }}>{svc.overviewHeading}</h2>
          </div>
          <div className="prose reveal d1">
            {svc.overview.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DELIVER */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="wrap">
          <div style={{ maxWidth: "640px" }} className="reveal">
            <span className="eyebrow">
              <span className="tick"></span>What we deliver
            </span>
            <h2 style={{ marginTop: "18px" }}>The talent and the toolkit.</h2>
          </div>
          <div className="deliver-grid" style={{ marginTop: "50px" }}>
            {svc.deliver.map((d, i) => (
              <div className={`value-card reveal${i ? ` d${i}` : ""}`} key={d.n}>
                <div className="vn">{d.n}</div>
                <h3>{d.title}</h3>
                <p>{d.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "64px" }}>
            <span className="kicker">Technologies we staff for</span>
            <div className="chip-wrap">
              {svc.chips.map((c) => (
                <span className="tag" key={c}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE */}
      <section className="section-sm">
        <div className="wrap">
          <div className="feature dark reveal">
            <div className="copy">
              <span className="eyebrow">
                <span className="tick"></span>Why it matters
              </span>
              <h2 style={{ marginTop: "18px" }}>{svc.featureHeading}</h2>
              <p className="body" style={{ marginTop: "18px", fontSize: "16.5px" }}>
                {svc.featureBody}
              </p>
              <Link
                href="/contact"
                className="link-arrow"
                style={{ marginTop: "26px", color: "var(--copper)" }}
              >
                Start a conversation →
              </Link>
            </div>
            <div className="media">
              <div className="ph dark" data-label={svc.featureLabel}></div>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="section" style={{ paddingTop: "40px" }}>
        <div className="wrap">
          <div style={{ maxWidth: "640px" }} className="reveal">
            <span className="eyebrow">
              <span className="tick"></span>Explore more
            </span>
            <h2 style={{ marginTop: "18px" }}>Other services.</h2>
          </div>
          <div className="rel-grid reveal">
            {related.map((r) => (
              <Link
                href={`/services/${r.slug}`}
                className="rel-card"
                key={r.slug}
              >
                <span className="rel-name">{r.navLabel}</span>
                <span className="rel-go">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm" style={{ paddingTop: "40px" }}>
        <div className="wrap">
          <div
            className="dark reveal"
            style={{
              borderRadius: "var(--r-lg)",
              padding: "84px 56px",
              textAlign: "center",
            }}
          >
            <span className="eyebrow">
              <span className="tick"></span>Let’s build together
            </span>
            <h2
              style={{
                marginTop: "20px",
                maxWidth: "720px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Ready to bring this capability in-house?
            </h2>
            <p className="lead" style={{ margin: "18px auto 34px", maxWidth: "520px" }}>
              Let’s find the right minds for your mission.
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
