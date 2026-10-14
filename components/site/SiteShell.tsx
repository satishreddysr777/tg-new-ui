"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { services } from "@/lib/marketing-services";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 font-semibold tracking-[0.18em] text-sm",
        light ? "text-navy-foreground" : "text-navy",
      )}
    >
      <span className="grid h-7 w-7 place-items-center rounded-sm bg-primary text-primary-foreground font-mono text-xs tracking-normal">
        T
      </span>
      TECHNOGRAPH
    </Link>
  );
}

const navCls =
  "text-sm font-medium text-foreground/75 hover:text-foreground transition-colors";

function NavLink({
  href,
  exact,
  className,
  children,
  onClick,
}: {
  href: string;
  exact?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(className, active && "text-foreground")}
    >
      {children}
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [svc, setSvc] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex">
          <NavLink href="/" exact className={navCls}>Home</NavLink>
          <div
            className="relative"
            onMouseEnter={() => setSvc(true)}
            onMouseLeave={() => setSvc(false)}
          >
            <NavLink href="/services" className={cn(navCls, "flex items-center gap-1")}>
              Services <ChevronDown className="h-3.5 w-3.5" />
            </NavLink>
            {svc && (
              <div className="absolute left-1/2 top-full w-[26rem] -translate-x-1/2 pt-3">
                <div className="rounded-lg border bg-card p-2 shadow-float">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="flex gap-3 rounded-md p-3 hover:bg-muted"
                    >
                      <span className="font-mono text-xs text-primary pt-0.5">{s.num}</span>
                      <span>
                        <span className="block text-sm font-medium">{s.navLabel}</span>
                        <span className="block text-xs text-muted-foreground">{s.navSub}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <NavLink href="/about" className={navCls}>About</NavLink>
          <NavLink href="/careers" className={navCls}>Careers</NavLink>
          <NavLink href="/contact" className={navCls}>Contact</NavLink>
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/login" className={navCls}>Sign in</Link>
          <Button asChild variant="navy">
            <Link href="/contact">Hire talent →</Link>
          </Button>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-medium lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />} Menu
        </button>
      </div>
      {open && (
        <div className="border-t bg-background lg:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {(
              [
                ["/", "Home"],
                ["/services", "Services"],
                ["/about", "About"],
                ["/careers", "Careers"],
                ["/contact", "Contact"],
                ["/login", "Sign in"],
              ] as const
            ).map(([to, l]) => (
              <Link
                key={to}
                href={to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-base hover:bg-muted"
              >
                {l}
              </Link>
            ))}
            <div className="pl-4">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  onClick={() => setOpen(false)}
                  className="block py-1.5 text-sm text-muted-foreground"
                >
                  {s.navLabel}
                </Link>
              ))}
            </div>
            <Button asChild variant="navy" className="mt-3">
              <Link href="/contact">Hire talent →</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="container-x grid gap-10 py-16 md:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-navy-muted">
            Smarter talent. Stronger systems. Future-ready IT — engineered for long-term impact.
          </p>
        </div>
        <div>
          <h4 className="eyebrow text-teal">Services</h4>
          <ul className="mt-4 space-y-2 text-sm text-navy-muted">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-navy-foreground">
                  {s.footerLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="eyebrow text-teal">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-navy-muted">
            <li><Link href="/about" className="hover:text-navy-foreground">About</Link></li>
            <li><Link href="/contact" className="hover:text-navy-foreground">Contact</Link></li>
            <li><Link href="/careers" className="hover:text-navy-foreground">Careers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow text-teal">Get in touch</h4>
          <ul className="mt-4 space-y-2 text-sm text-navy-muted">
            <li>
              <a href="mailto:hello@technograph.com" className="hover:text-navy-foreground">
                hello@technograph.com
              </a>
            </li>
            <li>+1 (800) 555-1234</li>
            <li>
              <Link href="/contact" className="text-navy-foreground hover:underline">
                Talk to a manager →
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10">
        <div className="container-x flex flex-col justify-between gap-2 py-6 font-mono text-xs text-navy-muted md:flex-row">
          <span>© 2026 Technograph. All rights reserved.</span>
          <span>IT Staffing & Consulting</span>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function Accent({ children }: { children: ReactNode }) {
  return <span className="text-primary">{children}</span>;
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  className,
  light,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && <p className={cn("eyebrow", light && "text-teal")}>{eyebrow}</p>}
      <h2
        className={cn(
          "mt-3 text-3xl font-semibold leading-tight md:text-4xl",
          light ? "text-navy-foreground" : "text-navy",
        )}
      >
        {title}
      </h2>
      {lead && (
        <p className={cn("mt-4 text-lg", light ? "text-navy-muted" : "text-muted-foreground")}>
          {lead}
        </p>
      )}
    </div>
  );
}

export function Photo({
  src,
  label,
  className,
  eager,
}: {
  src?: string;
  label: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <figure className={cn("relative overflow-hidden rounded-lg bg-muted", className)}>
      {src ? (
        <img
          src={src}
          alt={label}
          loading={eager ? "eager" : "lazy"}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full min-h-[12rem] w-full items-end p-3">
          <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        </div>
      )}
      {src && (
        <figcaption className="absolute bottom-3 left-3 rounded-sm bg-navy/80 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-navy-foreground backdrop-blur">
          {label}
        </figcaption>
      )}
    </figure>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  image,
  imageLabel,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  children?: ReactNode;
  image?: string;
  imageLabel?: string;
  aside?: ReactNode;
}) {
  return (
    <section className="border-b">
      <div
        className={cn(
          "container-x grid items-center gap-12 py-16 md:py-24",
          image && "lg:grid-cols-2",
        )}
      >
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.08] text-navy md:text-5xl lg:text-[3.4rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">{lead}</p>
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        {image !== undefined && (
          <div className="relative">
            <Photo src={image} label={imageLabel ?? ""} eager className="aspect-[5/4] shadow-float" />
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}

export function CtaStrip({
  eyebrow,
  title,
  lead,
  button,
  to = "/contact",
}: {
  eyebrow: string;
  title: string;
  lead: string;
  button: string;
  to?: string;
}) {
  return (
    <section className="container-x py-20">
      <div className="relative overflow-hidden rounded-xl bg-navy-gradient px-8 py-14 md:px-14">
        <div className="absolute inset-0 grid-lines opacity-60" />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow text-teal">{eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold text-navy-foreground md:text-4xl">{title}</h2>
            <p className="mt-3 text-lg text-navy-muted">{lead}</p>
          </div>
          <Button asChild variant="onNavy" size="lg">
            <Link href={to}>{button}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function ArrowLink({
  href,
  children,
  light,
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 text-sm font-semibold",
        light ? "text-teal" : "text-primary",
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
