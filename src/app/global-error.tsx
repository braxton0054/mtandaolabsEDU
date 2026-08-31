"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@web/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@web/components/ui/alert";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // Never expose the raw message in production.
  const safeMessage =
    process.env.NODE_ENV === "production" ? "An unexpected error occurred. Please try again." : error.message;
  return (
    <html>
      <body>
        <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center gap-6 px-4 py-16">
          <Alert variant="danger">
            <div className="flex flex-col gap-1">
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>{safeMessage}</AlertDescription>
              {error.digest ? <AlertDescription>Reference: {error.digest}</AlertDescription> : null}
            </div>
          </Alert>
          <div className="flex gap-3">
            <Button onClick={reset}>Try again</Button>
            <Button asChild variant="secondary">
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}