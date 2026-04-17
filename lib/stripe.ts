import Stripe from "stripe";

let stripeSingleton: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set.");
  }
  if (key.startsWith("pk_")) {
    throw new Error(
      "STRIPE_SECRET_KEY looks like a Publishable key (pk_…). Use the Secret key from Developers → API keys — it starts with sk_test_ or sk_live_.",
    );
  }
  if (key.startsWith("mk_")) {
    throw new Error(
      "STRIPE_SECRET_KEY starts with mk_, which is not a standard server secret. Open Developers → API keys and copy the Secret key (sk_test_… or sk_live_…), not another key row from the dashboard.",
    );
  }
  if (!key.startsWith("sk_") && !key.startsWith("rk_")) {
    throw new Error(
      "STRIPE_SECRET_KEY should start with sk_ (secret) or rk_ (restricted). Copy it from Developers → API keys.",
    );
  }
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(key, { typescript: true });
  }
  return stripeSingleton;
}

export function appBaseUrl(): string {
  const u = process.env.NEXTAUTH_URL?.trim();
  if (u) return u.replace(/\/$/, "");
  return "http://localhost:3000";
}
