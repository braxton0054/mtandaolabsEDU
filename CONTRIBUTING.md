# Contributing to mtandaolabsEDU

Thanks for your interest in contributing. This guide explains how to set up the project, how
we work, and the standards we hold ourselves to during Phase 1.

## Code of conduct

- Be respectful. Disagree on substance, not on people.
- Prefer written discussion in PRs / issues. Async, documented decisions are durable.
- Never commit secrets, real customer data, or any production credentials.

## Development setup

1. Install Node.js ≥ 20.9 and pnpm 9 (`npm i -g pnpm@9`).
2. Clone the repo.
3. `pnpm install`
4. `cp .env.example .env.local` and fill in values for local Postgres + Redis.
5. `pnpm prisma:migrate:dev && pnpm db:seed`
6. `pnpm dev`

## Workflow

1. Branch off `develop`: `git checkout -b feature/<short-name>` or `fix/<short-name>`.
2. Keep branches small and focused; one logical change per PR.
3. Before opening a PR:
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm test`
   - `pnpm test:integration` (if your change touches DB / Redis)
   - `pnpm test:e2e` (if your change touches UI / API surface)
   - `pnpm build`
4. Open a PR to `develop`. CI must be green before review.
5. At least one approval is required to merge.

## Coding standards

- TypeScript strict mode — no `any` without an inline justification.
- ESLint + Prettier — never disable rules project-wide.
- All public functions / exported types must have a JSDoc explaining **why**, not just **what**.
- Never log secrets, tokens, OTPs, or sensitive PII. Use the redaction list in
  `src/infra/logging/logger.ts` and extend it (not bypass it).
- Errors must be thrown as subclasses of `AppError` so the central handler can convert them.
  Never `throw new Error(...)` in route handlers — pick the right subclass.
- Validate every request boundary (body / query / params) with Zod via `parseOrThrow`.
- Database queries must filter by tenant (`tenantId`) once the multi-tenant schema ships.

## Multi-tenancy

The platform is multi-tenant. **Phase 1** ships the architectural seam
(`src/shared/tenant.ts`); **Phase 2+** must enforce tenant isolation at every query.

## Tests

- Unit tests cover validation, utilities, configuration, and core abstractions.
- Integration tests cover DB round-trip and Redis round-trip — they require real services
  reachable via env vars.
- E2E (Playwright) covers the user-visible foundation flow.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(validation): add parseOrThrow helper
fix(api): map Prisma P2025 to NOT_FOUND
chore(deps): bump @prisma/client to 5.22.0
```

## Security

If you find a security issue, **do not** open a public issue. Email
`security@mtandaolabs.com` (replace with the real address when configured).