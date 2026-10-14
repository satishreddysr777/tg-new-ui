import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import {
  Accent,
  SectionHead,
  Photo,
  PageHero,
  CtaStrip,
} from "@/components/site/SiteShell";
import { services } from "@/lib/marketing-services";

export const metadata: Metadata = {
  title:
    "IT Staffing & Consulting Services | Cloud, AEM, Big Data, AI | Technograph",
  description:
    "Explore Technograph's expert IT services — from cloud infrastructure and data analytics to AEM, AI, and digital transformation.",
};

const why = [
  [
    "Deep domain expertise",
    "Specialists who speak your industry's language from day one.",
  ],
  [
    "Pre-vetted, high-performing talent",
    "Access a curated network of proven professionals.",
  ],
  [
    "Fast turnaround, no compromise",
    "Speed that never comes at the cost of quality.",
  ],
  [
    "Strategic alignment",
    "A true partner invested in your long-term outcomes.",
  ],
];

export default function ServicesIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Expert IT talent. End-to-end solutions. Delivered with{" "}
            <Accent>precision.</Accent>
          </>
        }
        lead="We bring you the right people, with the right skills, at the right time — every time."
      />

      <section className="container-x grid gap-10 py-20 lg:grid-cols-[1fr_1.4fr]">
        <p className="eyebrow">Why it matters</p>
        <div className="space-y-5 text-lg text-muted-foreground">
          <p className="text-2xl font-medium text-navy">
            In today's tech-driven economy, your competitive edge depends on how quickly
            you can adapt, scale, and innovate. That's where we come in.
          </p>
          <p>
            At Technograph, we combine elite talent sourcing with deep technical expertise
            across mission-critical domains — helping businesses build the digital
            backbone they need to thrive. Whether you're launching a new product,
            modernizing infrastructure, or scaling operations, we plug in top-tier
            professionals who deliver from day one.
          </p>
        </div>
      </section>

      <section className="border-t bg-card py-24">
        <div className="container-x">
          <SectionHead
            eyebrow="Core services"
            title="Five disciplines. One standard of excellence."
          />
          <div className="mt-14 space-y-20">
            {services.map((s, i) => (
              <article key={s.slug} className="grid items-center gap-10 lg:grid-cols-2">
                <Photo
                  src={s.image}
                  label={s.imageLabel}
                  className={`aspect-[4/3] ${i % 2 ? "lg:order-2" : ""}`}
                />
                <div>
                  <p className="font-mono text-xs tracking-widest text-primary">
                    SERVICE {s.num}
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold text-navy">{s.indexTitle}</h3>
                  <p className="mt-2 text-lg text-muted-foreground">{s.tagline}</p>
                  <ul className="mt-6 space-y-4">
                    {s.bullets.map((b) => (
                      <li key={b.t} className="flex gap-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-teal" />
                        <span>
                          <span className="font-medium text-navy">{b.t}</span>{" "}
                          <span className="text-muted-foreground">— {b.d}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7">
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      {s.link}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-24">
        <SectionHead
          eyebrow="Why clients choose Technograph"
          title="Strategic alignment — not just transactional delivery."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {why.map(([t, d]) => (
            <div key={t} className="rounded-lg border bg-card p-6 shadow-card">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-primary">
                <Check className="h-4 w-4" />
              </span>
              <h3 className="mt-5 font-semibold text-navy">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaStrip
        eyebrow="Let's build together"
        title="Looking to scale your tech team or solve a complex challenge?"
        lead="Let's explore how we can bring the right minds to your mission."
        button="Request a Consultation →"
      />
    </>
  );
}
