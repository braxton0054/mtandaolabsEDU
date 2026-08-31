# Deployment

## Pipeline

```
Developer → PR → CI → merge to develop → staging (auto)
                                              ↓
                                         smoke tests
                                              ↓
release/vX.Y.Z → main (tagged) → production (manual approval)
```

## Targets

| Env | Host | Deploy | Approval |
|---|---|---|---|
| development | Local machine | `pnpm dev` | n/a |
| staging | VPS (TBD) | Auto on merge to `develop` | CI green |
| production | VPS (TBD) | Auto on tag, manual approval gate | Release manager |

## Process supervision (Phase 1+)

Staging and production will run under a process supervisor (e.g. systemd unit or
PM2). The unit file ships in Phase 2 along with the deploy script.

## Build artifact

The Next.js standalone output (`output: 'standalone'` in `next.config.ts`, to be added
in Phase 2) produces a self-contained runtime that can be copied to the host. For Phase 1,
`pnpm build && pnpm start` is sufficient for staging.

## Configuration

Per-environment configuration lives in:

- `.env.example` — variable names only (committed).
- `.env.local` — local dev secrets (gitignored).
- GitHub Actions secrets — staging/prod (never logged).

## Rollback

Roll back by:

1. `git checkout main && git pull`
2. Check out the previous tag.
3. `pnpm install --frozen-lockfile && pnpm build && pnpm start`

Database rollback: a separate backup snapshot is restored on operator command —
never automated. See [`docs/backup.md`](./backup.md).

## What Phase 1 actually ships

- The CI workflow file (`.github/workflows/ci.yml`).
- A staging configuration section in this doc + in `.env.example`.
- The deploy + rollback procedure (above).

The actual host setup, secrets manager, and process supervisor come in Phase 2.