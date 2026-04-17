import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: `Welcome — ${SITE_NAME}`,
  description:
    "Create your account, start a 10-day free trial, and continue for $1.99/month if you choose.",
};

export default function WelcomeLayout({ children }: { children: ReactNode }) {
  return children;
}
