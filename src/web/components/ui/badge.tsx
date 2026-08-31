import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium leading-5",
  {
    variants: {
      variant: {
        default: "bg-brand/10 text-brand",
        muted: "bg-surface-muted text-ink-muted border border-surface-border",
        success: "bg-feedback-success/10 text-feedback-success",
        warning: "bg-feedback-warning/10 text-feedback-warning",
        danger: "bg-feedback-danger/10 text-feedback-danger",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}