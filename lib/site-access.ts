import type { SiteAccessTier } from "@/types/site-access";

/** Stripe subscription statuses that keep full site access without relying on the signup trial window. */
const PAID_SUBSCRIPTION_STATUSES = new Set(["active", "trialing"]);

export function trialMsFromEnv(): number {
  const raw = process.env.TRIAL_DAYS?.trim();
  const days = raw ? Number.parseFloat(raw) : 10;
  const safe = Number.isFinite(days) && days >= 0 ? days : 10;
  return safe * 24 * 60 * 60 * 1000;
}

export function computeSiteAccess(user: { createdAt: Date; subscriptionStatus: string }): SiteAccessTier {
  if (PAID_SUBSCRIPTION_STATUSES.has(user.subscriptionStatus)) {
    return "full";
  }
  const endsAt = user.createdAt.getTime() + trialMsFromEnv();
  if (Date.now() < endsAt) {
    return "full";
  }
  return "restricted";
}

/** Env-wide brochure deploy, or an account whose trial ended without an active subscription. */
export function showPublicOnlyExperience(opts: {
  publicOnlyEnv: boolean;
  siteAccess?: SiteAccessTier;
}): boolean {
  if (opts.publicOnlyEnv) return true;
  return opts.siteAccess === "restricted";
}
