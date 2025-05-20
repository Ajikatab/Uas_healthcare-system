import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Get the pathname of the request
    const path = req.nextUrl.pathname;
    
    // Get the token from the session
    const token = req.nextauth.token;
    
    // Admin only paths
    if (path.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
    
    // Doctor only paths
    if (path.startsWith("/doctor")) {
      if (token?.role !== "DOCTOR" && token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
    
    // Protected patient paths
    if (path.startsWith("/patient")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Protect these paths with authentication
export const config = {
  matcher: ["/admin/:path*", "/doctor/:path*", "/patient/:path*", "/api/:path*"],
};
