import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { AccessCodeDialog } from "@/components/AccessCodeDialog";
import { ServiceWorker } from "@/components/ServiceWorker";
import "./globals.css";

export const metadata: Metadata = {
  title: "Natterly — talk like a local",
  description: "Practise real-world English conversation with friendly AI Locals from across the UK.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Natterly", statusBarStyle: "default" },
  icons: { icon: "/icon.svg", apple: "/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f3" },
    { media: "(prefers-color-scheme: dark)", color: "#111114" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const NAV = [
  { href: "/cuppa", label: "Cuppa" },
  { href: "/briefing", label: "Briefing" },
  { href: "/playback", label: "Playback" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="min-h-dvh font-sans antialiased">
        <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur">
          <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <span aria-hidden className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-sm text-brand-ink">
                N
              </span>
              Natterly
            </Link>
            <div className="flex gap-1 text-sm">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="rounded-full px-3 py-1.5 text-muted hover:bg-surface-2 hover:text-ink">
                  {n.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 pb-16 pt-6">{children}</main>
        <AccessCodeDialog />
        <ServiceWorker />
      </body>
    </html>
  );
}
