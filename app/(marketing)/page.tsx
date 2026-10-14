import Link from "next/link";
import {
  Cloud,
  BarChart3,
  Layers,
  ShieldCheck,
  Coffee,
  Workflow,
} from "lucide-react";
import {
  Accent,
  SectionHead,
  Photo,
  PageHero,
  CtaStrip,
  ArrowLink,
} from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";

const stats = [
  ["20+", "Years building what's next"],
  ["6", "Core technology practices"],
  ["Global", "Enterprise partnerships worldwide"],
  ["Certified", "AWS · Azure · Google Cloud talent"],
];

const cards = [
  {
    i: Cloud,
    t: "Cloud Solutions",
    s: "Architect for agility. Scale with confidence.",
    d: "Certified AWS, Azure & GCP professionals who design, deploy, and optimize infrastructure that grows with your business — from security to cost efficiency.",
  },
  {
    i: BarChart3,
    t: "Big Data & Analytics",
    s: "Turn complex data into actionable insight.",
    d: "Data engineers and analysts who build real-time pipelines, scalable architectures, and intuitive dashboards — so you move at the speed of insight.",
  },
  {
    i: Layers,
    t: "Adobe Experience Manager",
    s: "Personalized digital experiences at scale.",
    d: "AEM consultants who craft seamless content ecosystems — centralizing assets, personalizing journeys, and integrating with your MarTech stack.",
  },
  {
    i: ShieldCheck,
    t: "Cybersecurity & Compliance",
    s: "Secure your future. Protect what matters.",
    d: "Security experts who navigate evolving threats and global compliance — from risk assessments to identity and access management.",
  },
  {
    i: Coffee,
    t: "Open-Source & Java",
    s: "Build fast. Build strong. Build right.",
    d: "Full-stack developers and architects specialized in robust Java ecosystems — Spring, Hibernate, microservices — that scale efficiently.",
  },
  {
    i: Workflow,
    t: "Systems Integration",
    s: "Connect the old with the new — without the chaos.",
    d: "Integration specialists who bridge legacy systems with modern tools — from ERP modernization to API-based architectures that work as one.",
  },
];

const steps = [
  [
    "STEP 01",
    "Discovery & Strategy",
    "Every partnership starts with a conversation. We work closely with your stakeholders to define project goals, role requirements, team structure, and success metrics — building a strong foundation for everything that follows.",
  ],
  [
    "STEP 02",
    "Talent Mapping",
    "We don't just search — we strategize. Combining domain expertise, structured sourcing frameworks, and AI-powered tools, we curate a shortlist of high-fit candidates who are technically strong and culturally aligned.",
  ],
  [
    "STEP 03",
    "Seamless Onboarding",
    "Placement is just the beginning. We support the full onboarding journey, ensure a smooth transition into your environment, and check in regularly to support long-term performance and retention.",
  ],
];

const HERO_IMG = "/images/hero-team.jpg";
const STRATEGY_IMG = "/images/strategy.jpg";

export default function HomePage() {
  return (
    <>
      <PageHero
        eyebrow="Purpose-driven IT talent"
        title={
          <>
            Smarter talent.
            <br />
            Stronger systems.
            <br />
            Future-ready <Accent>IT.</Accent>
          </>
        }
        lead="Technograph helps companies scale with precision — elite IT talent, advanced technology expertise, and strategic partnerships built to last."
        image={HERO_IMG}
        imageLabel="Modern enterprise team at work"
        aside={
          <div className="absolute -bottom-8 -left-4 w-64 rounded-lg border bg-card p-5 shadow-float md:-left-10">
            <div className="text-4xl font-semibold text-navy">20+</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Years aligning talent with business purpose.
            </p>
            <p className="mt-3 font-mono text-[0.65rem] tracking-widest text-primary">
              CLOUD · DATA · AI · SECURITY
            </p>
          </div>
        }
      >
        <Button asChild size="lg" variant="navy">
          <Link href="/contact">Talk to us →</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/services">Explore services</Link>
        </Button>
      </PageHero>

      <section className="bg-navy">
        <div className="container-x grid grid-cols-2 divide-navy-foreground/10 py-10 md:grid-cols-4 md:divide-x">
          {stats.map(([n, l]) => (
            <div key={l} className="px-4 py-4 md:px-8">
              <div className="text-3xl font-semibold text-navy-foreground">{n}</div>
              <div className="mt-1 text-sm text-navy-muted">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x grid items-center gap-14 py-24 lg:grid-cols-2">
        <div className="relative order-2 lg:order-1">
          <Photo
            src={STRATEGY_IMG}
            label="Founding team · strategy session"
            className="aspect-square"
          />
          <div className="absolute -right-4 -top-4 rounded-lg bg-primary px-5 py-4 text-primary-foreground shadow-float">
            <div className="text-xl font-semibold">Est. 2005</div>
            <div className="text-xs opacity-85">Two decades of partnership</div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <SectionHead eyebrow="Who we are" title="20+ years of building what's next." />
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              For over two decades, we've helped businesses transform the way they hire,
              build, and innovate. Our journey began with one belief — that great technology
              starts with the right people.
            </p>
            <p>
              Today, we partner with visionary enterprises worldwide to deliver elite IT
              talent that fuels smarter decisions, faster execution, and long-term
              resilience.
            </p>
            <p>
              We're not just helping companies fill roles. We're aligning talent with
              business purpose — across cloud, big data, digital platforms, and everything
              in between.
            </p>
          </div>
          <div className="mt-8">
            <ArrowLink href="/about">Read our story</ArrowLink>
          </div>
        </div>
      </section>

      <section className="border-y bg-card py-24">
        <div className="container-x">
          <SectionHead
            eyebrow="What we do best"
            title="Specialisations that move the needle."
            lead="Deep, certified expertise across the disciplines that define modern enterprise technology."
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-2 lg:grid-cols-3">
            {cards.map(({ i: Icon, t, s, d }) => (
              <article
                key={t}
                className="bg-card p-8 transition-colors hover:bg-muted/60"
              >
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-6 text-lg font-semibold text-navy">{t}</h3>
                <p className="mt-1 text-sm font-medium text-foreground/80">{s}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-gradient py-24">
        <div className="absolute inset-0 grid-lines" />
        <div className="container-x relative grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow text-teal">Why work with us</p>
            <p className="mt-5 text-3xl font-medium leading-snug text-navy-foreground md:text-[2.6rem]">
              Your challenges deserve more than a vendor. They deserve a{" "}
              <span className="text-teal">partner.</span>
            </p>
          </div>
          <div className="space-y-5 text-navy-muted lg:pt-10">
            <p>
              At Technograph, we take the time to understand your goals, culture, and tech
              stack — then bring you people who move the needle.
            </p>
            <p>
              Our team is composed of former engineers, consultants, and technologists who
              speak your language and solve your business problems — not just staffing gaps.
            </p>
            <ArrowLink href="/about" light>What we stand for</ArrowLink>
          </div>
        </div>
      </section>

      <section className="container-x py-24">
        <SectionHead
          eyebrow="How we work"
          title="Tailored solutions. Transparent process. Tangible results."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map(([n, t, d]) => (
            <div key={n} className="rounded-lg border bg-card p-8 shadow-card">
              <p className="font-mono text-xs tracking-widest text-primary">{n}</p>
              <h3 className="mt-4 text-xl font-semibold text-navy">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaStrip
        eyebrow="Let's build together"
        title="Ready to build a future-ready workforce?"
        lead="Let's find the right minds for your mission."
        button="Talk to a Talent Acquisition Manager →"
      />
    </>
  );
}
