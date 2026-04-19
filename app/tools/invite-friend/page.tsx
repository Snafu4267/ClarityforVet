import { redirect } from "next/navigation";

/** Old URL — invite lives at `/invite-vet` (member page after sign-in, not grouped under Tools). */
export default function InviteFriendLegacyRedirectPage() {
  redirect("/invite-vet");
}
