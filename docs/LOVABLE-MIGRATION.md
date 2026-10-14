# Lovable → tg-ui migration

Reference UI: `../lovable-tg` (read-only; do not ship `src/data/store.tsx`).

Production app: `tg-ui` + `tg-api` via `lib/*-api.ts` and `/api/v1` rewrite.

## Route map

| Lovable | tg-ui |
|---------|--------|
| `src/routes/index.tsx` | `app/(marketing)/page.tsx` |
| `src/routes/about.tsx` | `app/(marketing)/about/page.tsx` |
| `src/routes/contact.tsx` | `app/(marketing)/contact/page.tsx` |
| `src/routes/services.index.tsx` | `app/(marketing)/services/page.tsx` |
| `src/routes/services.$slug.tsx` | `app/(marketing)/services/[slug]/page.tsx` |
| `src/routes/careers.index.tsx` | `app/(marketing)/careers/page.tsx` |
| `src/routes/careers.$id.tsx` | `app/(marketing)/careers/[id]/page.tsx` |
| `src/routes/login.tsx` | `app/(auth)/login/page.tsx` + `components/auth/screens/*` |
| `src/routes/reset.tsx` | `app/(auth)/reset/page.tsx` |
| `src/routes/onboard.tsx` | `app/(auth)/onboard/page.tsx` |
| `src/routes/portal*.tsx` | `app/portal/*` |
| `src/routes/employer*.tsx` | `app/employer/*` |

## Phase checklist

- [x] Phase 0 — branch + this doc
- [x] Phase 1 — theme, shadcn `components/ui`, shells (`SiteShell`, `AuthChrome`, `ConsoleShell`)
- [x] Phase 2 — marketing pages + contact/careers APIs
- [x] Phase 3 — auth wired to `auth-api` / `session` (no demo login)
- [x] Phase 4 — portal + `PortalGate` / `me-api` + `PortalChrome`
- [x] Phase 5 — employer + `EmployerChrome` + employer APIs
- [x] Phase 6 — legacy chrome removed (`Nav`/`Footer` marketing layout); `Topbar` → Lovable `PageHeader`; `console.css` retained for inner console widgets until fully restyled

## Regression (manual)

1. Marketing: home, services, contact submit, careers list + apply
2. Auth: employee → `/portal`, employer → `/employer`, forgot/reset/onboard
3. Portal: onboarding gate, engagement, roles apply, applications
4. Employer: employees invite, jobs publish, kanban, clients, messages

## Notes

- Lovable role `TALENT` → API `EMPLOYER` (label: Talent team).
- Copy source: `LOVABLE-UI-UX-BRIEF.md` at repo root when text differs.
- Marketing images: copied from `lovable-tg/src/assets` → `tg-ui/public/images/`.
