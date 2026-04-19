import type { SiteAccessTier } from "@/types/site-access";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      /** Present when signed in: full site vs trial-ended without subscription. */
      siteAccess: SiteAccessTier;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    siteAccess?: SiteAccessTier;
  }
}
