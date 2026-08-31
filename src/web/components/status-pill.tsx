"use client";
import * as React from "react";
import { Badge } from "@web/components/ui/badge";

interface HealthResponse {
  status: "ok" | "degraded" | "down";
  checks?: Record<string, { status: "up" | "down"; latencyMs?: number; error?: string }>;
}

export function StatusPill() {
  const [data, setData] = React.useState<HealthResponse | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/health")
      .then(async (r) => ({ status: r.status, body: (await r.json()) as HealthResponse }))
      .then(({ status, body }) => {
        if (cancelled) return;
        setData(body);
        if (status !== 200) setErr(`HTTP ${status}`);
      })
      .catch((e: Error) => !cancelled && setErr(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  if (err) return <Badge variant="danger">Health: error — {err}</Badge>;
  if (!data) return <Badge variant="muted">Health: checking…</Badge>;

  const variant = data.status === "ok" ? "success" : data.status === "degraded" ? "warning" : "danger";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant={variant}>Health: {data.status}</Badge>
      {data.checks
        ? Object.entries(data.checks).map(([k, v]) => (
            <Badge key={k} variant={v.status === "up" ? "success" : "danger"}>
              {k}: {v.status}
              {typeof v.latencyMs === "number" ? ` · ${v.latencyMs}ms` : ""}
            </Badge>
          ))
        : null}
    </div>
  );
}