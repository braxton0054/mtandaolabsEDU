# Database

PostgreSQL 15+ via Prisma 5 ORM.

## Environments

| Env | URL convention |
|---|---|
| development | `postgresql://postgres:postgres@localhost:5432/mtandaolabsedu_dev` |
| staging | `postgresql://<user>:<pw>@<host>:5432/mtandaolabsedu_staging` |
| production | Pooled (e.g. PgBouncer / Neon pooler) for app, direct for migrations |

`DATABASE_URL` is the application connection string (typically pooled in production).
`DATABASE_DIRECT_URL` is used by the Prisma CLI for migrations and shadow databases.

## Migrations

```bash
# Local dev — creates + applies a new migration
pnpm prisma:migrate:dev -- --name <name>

# Staging / production — applies pending migrations without prompts
pnpm prisma:migrate:deploy
```

Never edit an already-applied migration. Add a new one.

## Seed

```bash
pnpm db:seed
```

Idempotent — won't re-create rows that already exist.

## Connection pooling

`DATABASE_POOL_MAX` controls the Prisma connection pool (default 10). Tune per environment
based on Postgres `max_connections` and expected RPS. In serverless, prefer an external
pooler (Neon, PgBouncer, Supabase pooler) and set `DATABASE_URL` to the pooler URL while
keeping `DATABASE_DIRECT_URL` pointed at the underlying instance.

## Phase 1 schema

A single `HealthCheck` table proves the migration system works. Real tables (tenants,
schools, users, etc.) ship in later phases.