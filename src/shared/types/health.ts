export interface HealthReport {
  status: "ok" | "degraded" | "down";
  timestamp: string;
  version: string;
  environment: string;
  uptimeSec: number;
  checks: Record<string, CheckResult>;
}

export interface CheckResult {
  status: "up" | "down";
  latencyMs?: number;
  error?: string;
}