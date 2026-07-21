import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Gate for /admin/**. Redirects unauthenticated users to the login page.
 * Role-based routing (superadmin console vs subadmin builder) and per-site
 * ownership checks happen in the pages/API handlers — this layer only proves
 * "is someone logged in at all". See docs/rbac-subsites-design.md §2.
 */
export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // The login page must stay reachable without a session.
        if (req.nextUrl.pathname === "/admin/login") return true;
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
