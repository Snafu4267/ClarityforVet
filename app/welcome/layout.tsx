import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: `Welcome — ${SITE_NAME}`,
  description:
    "Create a free account for the private family log. Trial and membership details for when paid plans launch.",
};

export default function WelcomeLayout({ children }: { children: ReactNode }) {
  return children;
}
