import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const ADMIN_ROLES = ["admin", "editor", "volunteer-coordinator", "content-manager"];

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (isAdminRoute) {
    const user = req.auth?.user as { role?: string } | undefined;
    if (!req.auth || !user?.role || !ADMIN_ROLES.includes(user.role)) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = { matcher: ["/admin/:path*"] };
