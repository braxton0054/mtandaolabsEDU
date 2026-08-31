# CI/CD

## GitHub Actions (`.github/workflows/ci.yml`)

Every PR runs:

1. Install dependencies (with pnpm cache)
2. Lint
3. Type check
4. Unit tests
5. Integration tests (Postgres + Redis services)
6. Production build
7. Playwright e2e (Chromium + mobile)

The pipeline fails fast — any step failing blocks merge.

## Staging deploy (Phase 1 prep)

The intended deployment chain is:

```
Developer → feature/* → PR to develop
         → CI green → merge to develop
         → CI green → staging deploy (auto)
         → smoke tests on staging
         → release/vX.Y.Z → main
         → tag → production deploy (manual approval)
```

Phase 1 ships:

- The workflow file (`ci.yml`).
- The deployment structure (`docs/deployment.md`).
- The staging configuration placeholders (`.env.example` values for `staging`).

The actual staging + production deploy steps come in Phase 2 once we have a host and
secrets manager wired up. **Phase 1 does not auto-deploy to production.**

## Secrets in CI

Configure these as GitHub Actions repository secrets:

- `DATABASE_URL_STAGING`
- `DATABASE_DIRECT_URL_STAGING`
- `REDIS_URL_STAGING`
- `AUTH_SECRET_STAGING`
- `APP_URL_STAGING`

They are never echoed and never persisted in workflow logs.