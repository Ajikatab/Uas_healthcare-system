import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow public routes and authentication routes
    if (path === "/" || path.startsWith("/auth") || path.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    // Ensure user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    // Role-based redirects
    if (token.role === "PATIENT" && !path.startsWith("/patient") && !path.startsWith("/appointments")) {
      return NextResponse.redirect(new URL("/patient/dashboard", req.url));
    }

    if (token.role === "DOCTOR" && !path.startsWith("/doctor")) {
      return NextResponse.redirect(new URL("/doctor/dashboard", req.url));
    }

    if (token.role === "ADMIN" && !path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public routes and authentication routes
        if (req.nextUrl.pathname.startsWith("/auth") || req.nextUrl.pathname.startsWith("/api/auth") || req.nextUrl.pathname === "/") {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
