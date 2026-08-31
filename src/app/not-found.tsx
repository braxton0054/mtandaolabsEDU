import Link from "next/link";
import { Button } from "@web/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center gap-4 px-4 py-16 text-center">
      <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-ink-muted">The page you are looking for does not exist or has been moved.</p>
      <div className="mt-2 flex justify-center">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}