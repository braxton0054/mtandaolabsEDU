# Redis

Redis 7+ via `ioredis`. Used in Phase 1 for rate limiting; later phases add caching,
sessions, and background jobs.

## Setup

Locally:

```bash
# macOS
brew install redis && brew services start redis

# Debian / Ubuntu
sudo apt-get install -y redis-server
sudo systemctl enable --now redis-server
```

Default URL in `.env.example` is `redis://localhost:6379`.

## Production

Use a managed Redis (Upstash, ElastiCache, Redis Cloud) with TLS and an AUTH password.
The connection string is the only thing that needs to change — the client code is the same.

## Key naming

All keys are prefixed with `${REDIS_KEY_PREFIX}:` (default `mtandaolabsedu:`) at the
client level. Inside the app we use semantic names:

- `ratelimit:<bucket>:<id>:<path>` — rate-limit counters
- `cache:<resource>:<id>` — future caching
- `job:<queue>:<id>` — future background jobs

## Health

`/api/health` reports `redis: up` when `PING` returns `PONG`. The integration test
`pnpm test:integration` round-trips a value and asserts the rate-limit primitive.