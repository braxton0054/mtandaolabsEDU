import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@lib/utils";

const alertVariants = cva(
  "flex items-start gap-3 rounded-md border px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        info: "border-feedback-info/20 bg-feedback-info/5 text-ink",
        success: "border-feedback-success/20 bg-feedback-success/5 text-ink",
        warning: "border-feedback-warning/20 bg-feedback-warning/5 text-ink",
        danger: "border-feedback-danger/20 bg-feedback-danger/5 text-ink",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

export function Alert({ className, variant, ...props }: AlertProps) {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={cn("font-semibold", className)} {...props} />;
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-ink-muted", className)} {...props} />;
}