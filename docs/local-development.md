# Local development

## Prerequisites

- Node.js ≥ 20.9
- pnpm 9
- PostgreSQL 15+ (locally or via Docker — but Phase 1 deliberately avoids Docker)
- Redis 7+

## First-time setup

```bash
pnpm install
cp .env.example .env.local
# Edit .env.local — point DATABASE_URL/REDIS_URL at your local services

pnpm prisma:migrate:dev
pnpm db:seed
pnpm dev
```

App is at <http://localhost:3000>. Health at <http://localhost:3000/api/health>.

## Without Postgres / Redis

The app boots and most routes still work, but:

- `/api/health` will report `database: down` / `redis: down` and return 503.
- Rate-limit calls return `allowed: true` (in `NODE_ENV=test` they no-op).
- The integration tests will skip / fail.

For full local parity with CI, install Postgres + Redis natively.

## Useful commands

```bash
# Prisma studio — DB UI
pnpm prisma:studio

# Re-generate client after schema changes
pnpm prisma:generate

# Reset the dev DB (drops + re-applies migrations + re-seeds)
pnpm prisma:migrate:dev -- --reset
```