# Environment variables

All variables are validated at startup via Zod (`src/config/env.ts`). The application
refuses to boot if required values are missing or malformed.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `NODE_ENV` | yes | `development` | `development` / `test` / `staging` / `production` |
| `APP_NAME` | no | `mtandaolabsEDU` | Service name in logs / metrics |
| `APP_VERSION` | no | `0.1.0` | Reported by `/api/health` |
| `APP_URL` | yes | — | Public origin (e.g. `https://staging.mtandaolabs.com`) |
| `LOG_LEVEL` | no | `info` | Pino level |
| `LOG_PRETTY` | no | `false` | Pretty-print logs (dev only) |
| `API_PREFIX` | no | `/api` | Public API prefix |
| `API_VERSION` | no | `v1` | Current API version |
| `DATABASE_URL` | yes | — | Postgres connection string (pooler URL in prod) |
| `DATABASE_DIRECT_URL` | no | — | Direct (non-pooled) Postgres URL — used for migrations |
| `DATABASE_POOL_MAX` | no | `10` | Connection pool size |
| `DATABASE_POOL_MIN` | no | `0` | Min idle connections |
| `DATABASE_STATEMENT_TIMEOUT_MS` | no | `10000` | Statement timeout |
| `REDIS_URL` | yes | — | Redis connection string |
| `REDIS_KEY_PREFIX` | no | `mtandaolabsedu` | Prefix for all keys |
| `RATE_LIMIT_DEFAULT_WINDOW_SEC` | no | `60` | Default rate-limit window |
| `RATE_LIMIT_DEFAULT_MAX` | no | `120` | Default rate-limit cap |
| `AUTH_SECRET` | yes | — | Long random secret — min 16 chars (Phase 2 will sign with it) |
| `TRUSTED_ORIGINS` | no | empty | Comma-separated origins for CORS / CSRF |
| `STORAGE_DRIVER` | no | `local` | `local` only in Phase 1 |
| `STORAGE_LOCAL_ROOT` | no | `./storage` | Local FS root for the storage adapter |
| `BACKUP_DRIVER` | no | `local` | `local` (placeholder) or `b2` (Phase 4+) |
| `BACKUP_B2_KEY_ID` | no | — | Backblaze B2 key id (placeholder) |
| `BACKUP_B2_APPLICATION_KEY` | no | — | Backblaze B2 application key (placeholder) |
| `BACKUP_B2_BUCKET` | no | — | Backblaze B2 bucket name (placeholder) |
| `BACKUP_B2_ENDPOINT` | no | — | Backblaze B2 S3-compatible endpoint (placeholder) |
| `OTEL_ENABLED` | no | `false` | OpenTelemetry toggle |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | no | — | OTLP endpoint |

## Generating secrets

```bash
openssl rand -hex 32
```

Use one per environment — never reuse staging secrets in production and vice versa.