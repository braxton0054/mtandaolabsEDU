# Testing

## Unit tests (Vitest)

```bash
pnpm test
```

Cover:
- Environment loader (`src/test/unit/env.test.ts`)
- Validation + error mapping (`src/test/unit/api.test.ts`)
- Utilities (`src/test/unit/utils.test.ts`)
- Tenant stub (`src/test/unit/tenant.test.ts`)
- Local storage adapter (`src/test/unit/storage.test.ts`)

## Integration tests (Vitest, real services)

```bash
pnpm test:integration
```

Require Postgres + Redis reachable via env vars. Cover:
- Prisma round-trip + schema migrations work
- Redis round-trip + rate-limit primitive

These tests do **not** run in the CI unit step — see the CI workflow in
`.github/workflows/ci.yml`.

## E2E tests (Playwright)

```bash
pnpm test:e2e
```

Boots the dev server (or reuses one) and runs `src/test/e2e/smoke.spec.ts`:
- Home page renders
- `/api/health` returns the standard envelope
- `/api/v1/hello` works
- Zod validation rejects bad bodies
- 404 page renders on unknown routes
- Mobile viewport still works

CI runs the e2e suite against a built app (see the CI workflow).

## Conventions

- Unit tests must be deterministic and isolated — no I/O beyond `/tmp`.
- Integration tests must clean up after themselves.
- E2E tests must use `getByRole` / `getByText` first; only fall back to selectors when
  semantic queries aren't possible.