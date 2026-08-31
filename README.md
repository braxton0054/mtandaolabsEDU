# mtandaolabsEDU

A multi-tenant SaaS school-management platform for Kenyan private schools.

This repository is currently in **Phase 1 — Foundation**. The goal of this phase is to ship a
clean, production-grade technical foundation (database, Redis, API, design system, security,
observability, CI/CD) so that school-management features (students, parents, teachers, fees,
CBC, attendance, payments, subscriptions, reports) can be built on top of it cleanly in later
phases.

> ⚠️ **Do not implement students, parents, teachers, schools, CBC, marks, attendance, fees,
> payments, subscriptions, WhatsApp, SMS, email, M-Pesa, PayHero, report cards, invoices,
> receipts, school branding, custom domains, or super-admin features in this phase.**

See [`PHASE_1_SPEC.md`](./PHASE_1_SPEC.md) for the authoritative Phase 1 brief and
[`docs/architecture.md`](./docs/architecture.md) for the current architecture.

---

## Tech stack

| Layer        | Choice                                                                |
|--------------|-----------------------------------------------------------------------|
| Runtime      | Node.js ≥ 20.9, TypeScript 5.x                                        |
| Framework    | Next.js 15 (App Router, RSC)                                          |
| Database     | PostgreSQL 15+ via Prisma 5 ORM                                       |
| Cache / RL   | Redis 7 via ioredis                                                   |
| Validation   | Zod                                                                   |
| Logging      | Pino (structured JSON, request ids, secret redaction)                 |
| UI           | Tailwind CSS 3 + CSS-variable design tokens (Flatpanel-inspired)      |
| Testing      | Vitest (unit + integration), Playwright (e2e)                         |
| Lint/Format  | ESLint + Prettier                                                     |
| CI/CD        | GitHub Actions                                                        |
| Package mgr  | pnpm 9                                                                |

---

## Getting started

```bash
# 1. Install pnpm if needed
npm i -g pnpm@9

# 2. Install deps
pnpm install

# 3. Copy env template and fill in real values
cp .env.example .env.local

# 4. Make sure Postgres + Redis are available, then apply the schema
pnpm prisma:migrate:dev
pnpm db:seed

# 5. Run the app
pnpm dev          # http://localhost:3000
```

Verify everything is up:

```bash
curl http://localhost:3000/api/health
```

---

## Scripts

```text
pnpm dev              # next dev (port 3000)
pnpm build            # production build
pnpm start            # production server
pnpm lint             # next lint
pnpm typecheck        # tsc --noEmit
pnpm format           # prettier --write
pnpm test             # vitest unit tests
pnpm test:integration # vitest integration (needs Postgres + Redis)
pnpm test:e2e         # Playwright (boots the dev server)
pnpm prisma:generate  # regenerate Prisma client
pnpm prisma:migrate:dev
pnpm prisma:migrate:deploy
pnpm db:seed
```

---

## Branching

```
main        ─ production-ready
develop     ─ integration
feature/*   ─ new work
fix/*       ─ bug fixes
```

Pull requests target `develop`; release PRs from `develop` → `main`. CI must be green to merge.

See [`docs/git-workflow.md`](./docs/git-workflow.md).

---

## Phase 1 deliverables checklist

See [`docs/phase-1-checklist.md`](./docs/phase-1-checklist.md) for the live checklist and
the authoritative Definition of Done in [`PHASE_1_SPEC.md`](./PHASE_1_SPEC.md#26-definition-of-done).

---

## License

Proprietary — © mtandaolabs. All rights reserved.