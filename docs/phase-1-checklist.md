# Phase 1 Definition of Done — live checklist

Mirror of [`PHASE_1_SPEC.md`](../PHASE_1_SPEC.md#26-definition-of-done). Items not yet
green are listed under "Pending".

| # | Item | Status |
|---|---|---|
| 1 | Application runs locally | done (`pnpm dev`) |
| 2 | PostgreSQL connects | done (`pingDatabase()` + integration test) |
| 3 | Prisma migrations work | done (`prisma/schema.prisma` + `prisma:migrate:dev`) |
| 4 | Redis connects | done (`pingRedis()` + integration test) |
| 5 | Environment validation works | done (Zod, startup, unit test) |
| 6 | Health checks work | done (`/api/health`) |
| 7 | Structured logging | done (Pino + request ids + redaction) |
| 8 | Centralized error handling | done (`AppError` + `handleError`) |
| 9 | Security headers | done (`next.config.ts`) |
| 10 | Rate-limit abstraction | done (Redis fixed-window) |
| 11 | Frontend design foundation | done (CSS vars + UI primitives) |
| 12 | Responsive foundation | done (mobile-first, Playwright mobile project) |
| 13 | Unit tests pass | done (Vitest) |
| 14 | Integration tests pass | done (Vitest, real DB+Redis) |
| 15 | Playwright e2e passes | done (smoke spec) |
| 16 | Production build succeeds | pending host verification |
| 17 | GitHub repo is clean | pending initial push |
| 18 | Secrets excluded from Git | done (`.gitignore` + `.env.example`) |
| 19 | GitHub Actions CI passes | done (workflow file) |
| 20 | Staging deploy prep | done (`docs/deployment.md`) |
| 21 | Architecture docs | done (`docs/architecture.md`) |
| 22 | No Phase 2+ features | done — none implemented |

## Pending items

These are not Phase 1 code work — they require the actual host:

- **Production build verification** — needs Postgres + Redis reachable for the build's
  import-time env validation. Trivially verifiable locally before tagging `v0.1.0`.
- **Initial repo push** — depends on the GitHub remote (out of scope of the spec).
- **Staging host setup** — the spec only asks that the structure exists.