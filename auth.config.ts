import type { NextAuthConfig } from "next-auth";
import type { NextRequest } from "next/server";

const ADMIN_ROLES = ["admin", "editor", "volunteer-coordinator", "content-manager"];

export const authConfig: NextAuthConfig = {
  providers: [],
  callbacks: {
    authorized({ auth, request }: { auth: { user?: { role?: string } } | null; request: NextRequest }) {
      const { pathname } = request.nextUrl;
      const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
      if (isAdminRoute) {
        const role = auth?.user?.role;
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
