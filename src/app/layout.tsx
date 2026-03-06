import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { RouteProgress } from "@/components/layout/route-progress";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Anchor — Daily Standups for Solopreneurs",
    template: "%s — Anchor",
  },
  description:
    "Voice-first daily standup for solopreneurs. Five minutes. Three questions. Every damn day. Stay accountable and ship faster.",
  keywords: [
    "daily standup",
    "solopreneur",
    "accountability",
    "voice standup",
    "productivity",
    "solo founder",
    "accountability partner",
    "standup app",
  ],
  openGraph: {
    type: "website",
    siteName: "Anchor",
    title: "Anchor — Daily Standups for Solopreneurs",
    description:
      "Voice-first daily standup for solopreneurs. Five minutes. Three questions. Every damn day.",
  },
  twitter: {
    card: "summary_large_image",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://anchor-agent.vercel.app"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <RouteProgress />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
