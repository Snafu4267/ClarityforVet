import { PUBLIC_ONLY_SITE, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UnenrollClient } from "./UnenrollClient";

export const metadata: Metadata = {
  title: `Unenroll & billing — ${SITE_NAME}`,
  description: `Cancel or change your ${SITE_NAME} supporter subscription through Stripe.`,
};

export default function UnenrollPage() {
  if (PUBLIC_ONLY_SITE) redirect("/");

  return <UnenrollClient />;
}
