"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ServiceLink = {
  href: string;
  label: string;
  desc: string;
  icon: ReactNode;
};

const services: ServiceLink[] = [
  {
    href: "/services/cloud",
    label: "Cloud Solutions & Data Analytics",
    desc: "Architect, scale & optimize cloud",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="5" rx="1.5" />
        <rect x="3" y="14" width="18" height="5" rx="1.5" />
        <circle cx="7" cy="6.5" r="0.4" fill="currentColor" />
        <circle cx="7" cy="16.5" r="0.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/services/aem",
    label: "Adobe Experience Manager",
    desc: "Content platforms at scale",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="11" height="11" rx="1.5" />
        <rect x="9" y="9" width="11" height="11" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/services/big-data",
    label: "Big Data Solutions",
    desc: "Pipelines, ETL & analytics",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="20" x2="5" y2="12" />
        <line x1="12" y1="20" x2="12" y2="6" />
        <line x1="19" y1="20" x2="19" y2="15" />
      </svg>
    ),
  },
  {
    href: "/services/emerging-tech",
    label: "Emerging Technologies & Innovation",
    desc: "AI, blockchain, IoT & more",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <circle cx="5" cy="6" r="1.6" />
        <circle cx="19" cy="6" r="1.6" />
        <circle cx="19" cy="18" r="1.6" />
        <path d="M6.3 7.1l3.6 3.2M17.7 7.1l-3.6 3.2M17.7 16.9l-3.6-3.2" />
      </svg>
    ),
  },
  {
    href: "/services/digital-transformation",
    label: "Digital Transformation Consulting",
    desc: "Modernize, automate & advise",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8" />
        <path d="M20 4v4h-4" />
        <path d="M20 12a8 8 0 0 1-13.7 5.6L4 16" />
        <path d="M4 20v-4h4" />
      </svg>
    ),
  },
];

function Chevron() {
  return (
    <span className="caret" aria-hidden>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 4.5L6 8l3.5-3.5" />
      </svg>
    </span>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile panel on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // hover intent for the Services menu
  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenuOpen(true);
  };
  const closeMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuOpen(false), 140);
  };

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <Link className="brand" href="/">
          <span className="glyph">T</span>
          <span className="word">TECHNOGRAPH</span>
        </Link>

        <nav className={`nav-links${open ? " open" : ""}`}>
          <Link href="/" className={isActive("/") ? "active" : undefined}>
            Home
          </Link>

          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen} modal={false}>
            <DropdownMenuTrigger
              className={`nav-trigger${isActive("/services") ? " active" : ""}`}
              onMouseEnter={openMenu}
              onMouseLeave={closeMenu}
            >
              Services <Chevron />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              sideOffset={10}
              className="w-[600px]"
              onMouseEnter={openMenu}
              onMouseLeave={closeMenu}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-2 gap-1">
                {services.map((s) => (
                  <DropdownMenuItem asChild key={s.href}>
                    <Link href={s.href} className="items-start gap-3.5 px-3 py-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-copper-soft text-copper-deep [&_svg]:h-5 [&_svg]:w-5">
                        {s.icon}
                      </span>
                      <span className="flex min-w-0 flex-col pt-0.5">
                        <span className="font-sans text-[14.5px] font-semibold leading-snug text-ink">
                          {s.label}
                        </span>
                        <span className="mt-1 font-sans text-[12.5px] leading-snug text-ink-2/70">
                          {s.desc}
                        </span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/about"
            className={isActive("/about") ? "active" : undefined}
          >
            About
          </Link>
          <Link
            href="/careers"
            className={isActive("/careers") ? "active" : undefined}
          >
            Careers
          </Link>
          <Link
            href="/contact"
            className={isActive("/contact") ? "active" : undefined}
          >
            Contact
          </Link>
        </nav>

        <div className="nav-right">
          <Link href="/login" className="signin">
            Sign in
          </Link>
          <Link href="/contact" className="btn btn-copper btn-sm">
            Hire talent →
          </Link>
          <button
            className="nav-burger"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
