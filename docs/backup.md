# Backups

## Phase 1 status

The live database + files live on our VPS. Backups will use Backblaze B2.

Phase 1 ships:

- Configuration placeholders for B2 in `.env.example` (`BACKUP_DRIVER`, `BACKUP_B2_*`).
- The backup architecture documented here.
- The storage abstraction that will hold uploaded backups (`src/infra/storage`).

Phase 1 **does not** ship:

- A running backup daemon.
- An automated restore path.
- A tested disaster-recovery runbook.

## Planned architecture (Phase 2+)

```
Postgres (VPS) ──► daily logical dump (pg_dump, compressed, encrypted)
            └─► WAL archiving every 5 min (point-in-time recovery)

Files (storage/) ──► nightly tarball + sync to B2

Backblaze B2 ──► lifecycle rule: 30 daily + 12 monthly + indefinite yearly
              └─► bucket versioning on
              └─► server-side encryption (AES-256)
              └─► access limited to a single IAM key
```

## Encryption

Backups will be encrypted at rest with AES-256-GCM before upload. The encryption key
will live in the secrets manager, **not** in env vars committed to the repo.

## Disaster recovery

Targets:

| Metric | Target |
|---|---|
| RPO (database) | ≤ 5 minutes (WAL archive) |
| RPO (files) | ≤ 24 hours |
| RTO (database) | ≤ 1 hour (warm standby) |
| RTO (files) | ≤ 4 hours |

These targets assume the Phase 2 infrastructure work has landed. Phase 1 only
documents the plan.