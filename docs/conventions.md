# Coding conventions

## TypeScript

- `strict: true` — no implicit any, no implicit this.
- Prefer `import type { X } from "..."` for type-only imports (enforced by ESLint).
- No `any` without a comment justifying why.
- Use `as const` for literal tuples; never enum unless you really need one.
- Default to `unknown` in catch blocks, then narrow.

## React / Next.js

- App Router only (no Pages Router).
- Server components by default. `"use client"` only when you need interactivity.
- All UI primitives live under `src/web/components/ui/`.
- Pages and layouts live under `src/web/app/`.
- No `useEffect` for data fetching in server components; use RSC + actions.

## API routes

- One `route.ts` per resource under `src/app/api/`.
- Validate input via `parseOrThrow(schema, body)`.
- Wrap handlers in `withRequest` for logging + request id.
- Map errors with `handleError`.
- Return the standard envelope via `ok` / `created` / `fail`.

## Naming

- `PascalCase` for React components, types, classes.
- `camelCase` for variables, functions, hooks.
- `kebab-case` for file names of non-component modules.
- `UPPER_SNAKE` for env vars and error codes.

## Errors

- Always subclass `AppError` for thrown errors.
- Always `parseOrThrow` for request input.
- Never swallow errors silently — log + rethrow / return a safe envelope.

## Logging

- Never `console.log` — use the logger.
- Never log secrets. The Pino redaction list in `src/infra/logging/logger.ts` is the
  contract — extend it, don't bypass it.
- Log level: `debug` (dev noise) / `info` (normal flow) / `warn` (recoverable) /
  `error` (failure).

## Imports

Path aliases:

```ts
import { ok } from "@api/response";
import { getPrisma } from "@db/client";
import { env } from "@config/index";
import { cn } from "@lib/utils";
import { getRedis } from "@infra/redis/client";
import { Button } from "@web/components/ui/button";
```

Never use deep relative imports (`../../../`) — use the alias instead.