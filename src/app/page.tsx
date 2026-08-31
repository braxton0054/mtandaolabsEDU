import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@web/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@web/components/ui/card";
import { Badge } from "@web/components/ui/badge";
import { StatusPill } from "@web/components/status-pill";

export const metadata: Metadata = { title: "Foundation" };

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-10 px-4 py-10 md:py-16">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand text-brand-primary-foreground font-semibold">M</span>
          <span className="text-lg font-semibold tracking-tight">mtandaolabsEDU</span>
          <Badge variant="muted">Phase 1 · Foundation</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">A clean foundation for a school platform that scales.</h1>
        <p className="max-w-2xl text-ink-muted">
          Multi-tenant SaaS for Kenyan private schools. School-management features ship in later phases — this build proves the
          infrastructure, security, observability and design system that the rest will stand on.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Production stack</CardTitle>
            <CardDescription>Next.js · TypeScript · Prisma · Postgres · Redis</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-ink-muted">
            Modular layout with separate web, api, db, lib, config and infra boundaries. Designed so future services can split out cleanly.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Observable &amp; resilient</CardTitle>
            <CardDescription>Structured logs · request IDs · central errors</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-ink-muted">
            Every request carries an id, errors are mapped to safe JSON envelopes, and rate-limiting is wired through Redis.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mobile-first UI</CardTitle>
            <CardDescription>Flatpanel-inspired · no glass · subtle shadows</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-ink-muted">
            Tokens are CSS variables — ready to be themed per school later without rewriting components.
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API status</CardTitle>
            <CardDescription>Live probe of /api/health</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <StatusPill />
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href="/api/health">GET /api/health</Link>
              </Button>
              <Button asChild size="sm" variant="secondary">
                <Link href="/api/v1/hello">GET /api/v1/hello</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Design tokens</CardTitle>
            <CardDescription>Used by every component</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-2 text-xs">
            <Swatch label="Primary" token="--brand-primary" />
            <Swatch label="Deep" token="--brand-deep" />
            <Swatch label="Surface" token="--surface" />
            <Swatch label="Muted" token="--surface-muted" />
            <Swatch label="Ink" token="--ink" />
            <Swatch label="Ink muted" token="--ink-muted" />
          </CardContent>
        </Card>
      </section>

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted">
        <span>v{process.env.APP_VERSION ?? "0.1.0"} · {process.env.NODE_ENV}</span>
        <span>Phase 1 — Foundation only. No school features implemented yet.</span>
      </footer>
    </main>
  );
}

function Swatch({ label, token }: { label: string; token: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-surface-border bg-surface px-2 py-1.5">
      <span className="inline-block h-4 w-4 rounded-sm border border-surface-border" style={{ backgroundColor: `rgb(var(${token}))` }} />
      <span className="leading-none">{label}</span>
    </div>
  );
}