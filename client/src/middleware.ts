import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getServerSession } from "./server/auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const user = await getServerSession();

  if (request.nextUrl.pathname === "/") {
    if (user.status === "authenticated") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (request.nextUrl.pathname.endsWith("/auth")) {
    const redirect =
      request.nextUrl.searchParams.get("redirect") ?? "/dashboard";

    if (user.status === "authenticated") {
      return NextResponse.redirect(new URL(redirect, request.url));
    } else {
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${redirect}`, request.url)
      );
    }
  }

  if (request.nextUrl.pathname.startsWith("/auth")) {
    const redirect =
      request.nextUrl.searchParams.get("redirect") ?? "/dashboard";

    if (user.status === "authenticated") {
      return NextResponse.redirect(new URL(redirect, request.url));
    } else {
      return NextResponse.next();
    }
  }
}

export const config = {
  matcher: ["/auth", "/auth/:path", "/"],
};
