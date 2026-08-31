import type { Metadata } from "next";
import "@web/styles/globals.css";

export const metadata: Metadata = {
  title: { default: "mtandaolabsEDU", template: "%s · mtandaolabsEDU" },
  description: "Multi-tenant SaaS school management platform for Kenyan private schools.",
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  applicationName: "mtandaolabsEDU",
  robots: { index: false, follow: false }, // Phase 1 — no public pages yet
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh bg-surface-muted text-ink antialiased">
        {children}
      </body>
    </html>
  );
}