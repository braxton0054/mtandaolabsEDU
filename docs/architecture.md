# Architecture

mtandaolabsEDU is built as a layered Next.js application so that the boundaries are explicit
and individual layers can be split out later (e.g. a separate API service, a separate
worker, a separate admin app).

```
src/
  app/           ← Next.js App Router entrypoints (UI + API routes)
    api/         ← /api/health, /api/v1/*
  web/           ← Application layer (UI components, design tokens, pages)
    app/         ← App Router UI routes
    components/  ← UI primitives + feature components
    styles/      ← globals.css, design tokens
  api/           ← API / business-logic primitives
    response/    ← ok / created / fail / standard envelope
    errors/      ← AppError hierarchy + central handler
    validation/  ← parseOrThrow (Zod)
    middleware/  ← request id, withRequest wrapper
  db/            ← Database layer
    client.ts    ← Prisma client factory + ping
    schema.ts    ← (re-export of prisma/schema.prisma via Prisma Client types)
  shared/        ← Types + constants used by both web and api
    tenant.ts    ← TenantContext (Phase 1 stub)
    types/       ← Cross-cutting type definitions
  lib/           ← Pure utilities (cn, formatters)
  config/        ← Env loader (Zod-validated) + runtime flags
  infra/         ← Infrastructure adapters
    redis/       ← ioredis client + ping
    logging/     ← Pino logger + redaction
    rate-limit/  ← Redis-backed fixed-window limiter
    storage/     ← Storage abstraction + LocalStorage impl
  test/          ← Unit, integration, and e2e tests
prisma/          ← Prisma schema, migrations, seed
docs/            ← Architecture, deployment, backup notes
.github/workflows/ ← CI
```

## Key design rules

1. **All routes go through `/src/api/middleware/request.ts`** — gives every request a
   logger, a request id, and timing.
2. **All errors thrown from route handlers must be subclasses of `AppError`** — the
   central handler turns them into the standard `{ ok: false, error: {...}, requestId }`
   envelope with the right status code. Untyped errors become safe 500s.
3. **All request input is validated with Zod via `parseOrThrow`** at the boundary.
4. **No secrets in the repo.** Only `.env.example` ships; real `.env*` files are gitignored.
5. **Database access goes through `@db/client`** — never instantiate `new PrismaClient()`
   ad-hoc; this keeps pooling and logging consistent.
6. **Storage access goes through `@infra/storage`** so we can swap VPS-local for S3/B2
   without changing app code.
7. **Design tokens are CSS variables** — they will be themed per-tenant in later phases
   without touching components.

## Multi-tenancy

Phase 1 ships the seam (`TenantContext`) without resolving real tenants. Every business
table added in later phases **must** carry a `tenantId` column enforced at the application
layer (or via Postgres RLS when we turn that on). Cross-tenant queries are bugs.

## Why a monolith first?

A modular monolith gets us:

- One repo, one CI pipeline, one deploy artifact (staging) → fast iteration.
- One shared Prisma client, one Redis client, one logger — no drift.
- Cheap boundary enforcement while we still learn the domain.

When the load or team size justifies it, individual `src/api/` subtrees can be lifted
into their own services without changing the public API contract.

## Performance posture (Phase 1)

- Async everywhere; no blocking I/O in route handlers.
- Prisma client is reused (not constructed per request).
- Redis client is reused with lazy connect.
- Rate-limit primitive is O(1) per call (INCR + first-time EXPIRE).
- No premature optimization — we measure before we cache beyond Redis.

## Versioning

`vMAJOR.MINOR.PATCH`. Phase 1 stays at `0.1.0` until the Definition of Done is met. Every
production release must be traceable to a git commit, a workflow run, and a tag.