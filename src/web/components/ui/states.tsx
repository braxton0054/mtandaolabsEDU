import * as React from "react";
import { cn } from "@lib/utils";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-surface-border bg-surface px-6 py-12 text-center", className)}>
      <div className="rounded-full bg-surface-muted p-3 text-ink-muted">
        {icon ?? <Inbox className="h-5 w-5" aria-hidden />}
      </div>
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        {description ? <p className="text-sm text-ink-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  error: Error | string;
  className?: string;
}

export function ErrorState({ title = "Something went wrong", error, className }: ErrorStateProps) {
  const message = error instanceof Error ? error.message : error;
  return (
    <div className={cn("rounded-lg border border-feedback-danger/20 bg-feedback-danger/5 px-4 py-3 text-sm", className)}>
      <p className="font-medium text-feedback-danger">{title}</p>
      <p className="mt-1 text-ink-muted">{message}</p>
    </div>
  );
}