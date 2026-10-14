import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  SectionHead,
  Photo,
  PageHero,
  CtaStrip,
  ArrowLink,
} from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { services, getService } from "@/lib/marketing-services";

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
  return { title: svc.seoTitle, description: svc.lead };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const s = getService(params.slug);
  if (!s) notFound();
  const others = services.filter((x) => x.slug !== s.slug);

  return (
    <>
      <PageHero
        eyebrow={`Service ${s.num} · ${s.tagline}`}
        title={s.title}
        lead={s.lead}
        image={s.image}
        imageLabel={s.imageLabel}
      >
        <Button asChild size="lg" variant="navy">
          <Link href="/contact">Talk to us →</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/services">All services</Link>
        </Button>
      </PageHero>

      <section className="container-x grid gap-10 py-20 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="eyebrow">Overview</p>
          <h2 className="mt-3 text-3xl font-semibold text-navy">{s.tagline}</h2>
        </div>
        <div className="space-y-5 text-lg text-muted-foreground">
          {s.overview.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section className="border-y bg-card py-20">
        <div className="container-x">
          <SectionHead eyebrow="What we deliver" title="The talent and the toolkit." />
          <div
            className={`mt-12 grid gap-6 md:grid-cols-2 ${s.deliver.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}
          >
            {s.deliver.map((d, i) => (
              <div key={d.t} className="rounded-lg border bg-background p-7">
                <p className="font-mono text-sm text-primary">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-navy">{d.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <p className="eyebrow">Technologies we staff for</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {s.chips.map((c) => (
            <span
              key={c}
              className="rounded-full border bg-card px-4 py-2 text-sm font-medium text-navy"
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-navy-gradient py-20">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead
              light
              eyebrow="Why it matters"
              title={s.featureTitle}
              lead={s.featureBody}
            />
            <div className="mt-8">
              <ArrowLink href="/contact" light>Start a conversation</ArrowLink>
            </div>
          </div>
          <Photo src={s.image} label={s.featureImageLabel} className="aspect-[4/3]" />
        </div>
      </section>

      <section className="container-x py-20">
        <SectionHead eyebrow="Explore more" title="Other services." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/services/${o.slug}`}
              className="group rounded-lg border bg-card p-6 transition-shadow hover:shadow-card"
            >
              <p className="font-mono text-xs text-primary">{o.num}</p>
              <h3 className="mt-3 font-semibold text-navy group-hover:text-primary">
                {o.navLabel}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{o.navSub}</p>
            </Link>
          ))}
        </div>
      </section>

      <CtaStrip
        eyebrow="Let's build together"
        title="Ready to bring this capability in-house?"
        lead="Let's find the right minds for your mission."
        button="Request a Consultation →"
      />
    </>
  );
}
