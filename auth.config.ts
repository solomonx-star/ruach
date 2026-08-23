import type { NextAuthConfig } from "next-auth";

const ADMIN_ROLES = ["admin", "editor", "volunteer-coordinator", "content-manager"];

export const authConfig: NextAuthConfig = {
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
      if (isAdminRoute) {
        const role = (auth?.user as { role?: string } | undefined)?.role;
        return !!auth && !!role && ADMIN_ROLES.includes(role);
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
};
