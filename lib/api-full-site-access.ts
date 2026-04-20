import type { Session } from "next-auth";
import { NextResponse } from "next/server";

/** Returns JSON 401 when there is no signed-in user id on the session. */
export function requireSignedInResponse(session: Session | null): NextResponse | null {
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

/** Returns JSON 401 when signed-in routes also require a known user email. */
export function requireSignedInEmailResponse(session: Session | null): NextResponse | null {
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

/** Returns a JSON error response if the session cannot use subscriber-only APIs (journal, invite code). */
export function requireFullSiteAccessResponse(session: Session | null): NextResponse | null {
  const unauthorized = requireSignedInResponse(session);
  if (unauthorized) return unauthorized;
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
