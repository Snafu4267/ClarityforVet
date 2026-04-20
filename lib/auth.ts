import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { computeSiteAccess } from "@/lib/site-access";
import { logSecurityEvent } from "@/lib/security-log";
import { isValidEmailFormat, normalizeEmail } from "@/lib/email-format";

async function attachSiteAccessToToken(token: { id?: string; siteAccess?: unknown }) {
  const id = typeof token.id === "string" ? token.id : undefined;
  if (!id) return;
  const row = await prisma.user.findUnique({
    where: { id },
    select: { createdAt: true, subscriptionStatus: true },
  });
  if (!row) return;
  token.siteAccess = computeSiteAccess(row);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          logSecurityEvent("auth.signin_failed", { reason: "missing_credentials" });
          return null;
        }
        const email = normalizeEmail(credentials.email);
        if (!isValidEmailFormat(email)) {
          logSecurityEvent("auth.signin_failed", { reason: "invalid_email_format" });
          return null;
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) {
          logSecurityEvent("auth.signin_failed", { reason: "unknown_user_or_no_password", email });
          return null;
        }
        const ok = await bcrypt.compare(String(credentials.password), user.passwordHash);
        if (!ok) {
          logSecurityEvent("auth.signin_failed", { reason: "bad_password", email });
          return null;
        }
        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      await attachSiteAccessToToken(token);
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.siteAccess =
          token.siteAccess === "full" || token.siteAccess === "restricted"
            ? token.siteAccess
            : "restricted";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
