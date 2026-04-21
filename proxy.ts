import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
  callbacks: {
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname;
      const isPublicPath =
        path === "/" ||
        path === "/start-here" ||
        path.startsWith("/start-here/") ||
        path === "/login" ||
        path === "/register" ||
        path === "/api/register" ||
        path.startsWith("/api/auth/");
      if (isPublicPath) return true;
      return Boolean(token);
    },
  },
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
