"use client";

import { bigNavLinkCardMutedClass } from "@/lib/big-nav-card";
import { PUBLIC_ONLY_SITE } from "@/lib/site";
import Link from "next/link";
import { useSession } from "next-auth/react";

/** Only for signed-in users who have an account — hidden from guests on the home hub. */
export function HomeInviteVetNavCard() {
  const { data: session, status } = useSession();
  const restricted = session?.user?.siteAccess === "restricted";
  if (PUBLIC_ONLY_SITE || restricted || status !== "authenticated") {
    return null;
  }
  return (
    <Link href="/invite-vet" className={bigNavLinkCardMutedClass}>
      <span className="font-semibold text-zinc-900">Invite a vet</span>
      <span className="mt-1 block text-sm text-zinc-600">
        Your personal code—use the top bar or this page; tied to your account when someone joins.
      </span>
    </Link>
  );
}
