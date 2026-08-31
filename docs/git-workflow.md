# Git workflow

## Branches

- `main` — production-ready. Tagged releases only.
- `develop` — integration branch. Default target for PRs.
- `feature/<short-name>` — new work off `develop`.
- `fix/<short-name>` — bug fixes off `develop`.
- `release/vX.Y.Z` — release prep branches off `develop`.

## Lifecycle

```
feature/* ──┐
            ├──► develop ──► release/vX.Y.Z ──► main (tagged)
fix/*   ────┘
```

1. Branch off `develop`.
2. Open a PR → `develop`. CI must pass; at least one approval.
3. Cut a `release/vX.Y.Z` branch when ready to ship. Hotfixes only on `main`.
4. Merge release PRs to `main` with a fast-forward or squash. Tag with the same `vX.Y.Z`.
5. Cherry-pick / back-merge `main` → `develop` after a release.

## Commit messages

Conventional Commits:

```
feat(api): add /api/v1/hello
fix(rate-limit): correctly expire counters
chore(deps): bump prisma to 5.22.0
docs(readme): add tech stack table
```

## Branch protection (recommended)

Configure on GitHub:

- `main`: require PR + 1 approval + CI green + linear history.
- `develop`: require PR + CI green.
- Disallow direct pushes to `main` / `develop`.
- Disallow force-pushes to `main`.