import { PUBLIC_ONLY_SITE, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { StripeSubscribeClient } from "./StripeSubscribeClient";

export const metadata: Metadata = {
  title: `Subscribe — ${SITE_NAME}`,
  description: `Optional supporter subscription for ${SITE_NAME} via Stripe.`,
};

export default function StripePage() {
  if (PUBLIC_ONLY_SITE) redirect("/");

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center px-6 text-sm text-stone-600">Loading…</div>
      }
    >
      <StripeSubscribeClient />
    </Suspense>
  );
}
