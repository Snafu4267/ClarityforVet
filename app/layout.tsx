import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { Providers } from "@/components/Providers";
import { SiteFeedbackButton } from "@/components/SiteFeedbackButton";
import { SiteHomeBar } from "@/components/SiteHomeBar";
import { SITE_HOOK, SITE_NAME } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE_NAME,
  description: `${SITE_HOOK} Not affiliated with VA or DoD. Educational resources: public VA directories, plain-language topics, contacts, and personal organization tools. Not legal or medical advice.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full min-h-screen w-full antialiased`}>
      <body className="flex min-h-screen w-full flex-col bg-background text-text-primary">
        <Providers>
          <SiteHomeBar />
          <AppShell>{children}</AppShell>
          <SiteFeedbackButton />
        </Providers>
      </body>
    </html>
  );
}
