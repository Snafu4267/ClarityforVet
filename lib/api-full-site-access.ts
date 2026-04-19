import type { Session } from "next-auth";
import { NextResponse } from "next/server";

/** Returns a JSON error response if the session cannot use subscriber-only APIs (journal, invite code). */
export function requireFullSiteAccessResponse(session: Session | null): NextResponse | null {
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (session.user.siteAccess !== "full") {
    return NextResponse.json(
      {
        error: "Full site access requires an active subscription or free trial.",
        code: "SITE_ACCESS_RESTRICTED",
      },
      { status: 403 },
    );
  }
  return null;
}
