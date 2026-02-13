// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Signl - Peer Validated Talent Platform",
  description: "Signl MVP demo for peer validated BYU talent rankings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}