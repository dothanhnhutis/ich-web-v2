import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { currentUserAction, UserDetail } from "./data/user";
import { permissionRoutes } from "./routes";

export async function middleware(request: NextRequest) {
  const { nextUrl, url } = request;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const sid = request.cookies.get("sid");

  if (nextUrl.pathname.startsWith("/admin")) {
    if (!sid) {
      const redirectUrl = new URL("/login", url);
      const response = NextResponse.redirect(redirectUrl);
      response.headers.set("x-redirected-from", nextUrl.pathname);
      return response;
    }

    const user = await currentUserAction();

    if (!user) {
      const redirectUrl = new URL("/login", url);
      const response = NextResponse.redirect(redirectUrl);
      response.headers.set("x-redirected-from", nextUrl.pathname);
      response.cookies.set("sid", "", { maxAge: 0 });
      return response;
    }

    const permissions: string[] = Array.from(
      new Set(user.roles.flatMap((r) => r.permissions))
    );

    const hasPer = permissions
      .map((p) => permissionRoutes[p] || null)
      .filter((p) => p != null)
      .some((regex) => regex.test(nextUrl.pathname));

    if (!hasPer) {
      const redirectUrl = new URL("/notfound", url);
      const response = NextResponse.redirect(redirectUrl);
      response.headers.set("x-redirected-from", nextUrl.pathname);
      return response;
      // return new NextResponse("Not Found", { status: 404 });
    }
  }

  if (nextUrl.pathname === "/login") {
    if (sid) {
      const user = await currentUserAction();
      if (!user) {
        const redirectUrl = new URL("/login", url);
        const response = NextResponse.redirect(redirectUrl);
        response.cookies.set("sid", "", { maxAge: 0 });
        return response;
      } else {
        // redirect toi trang co permission

        const redirectUrl = new URL("/admin/users", url);
        const response = NextResponse.redirect(redirectUrl);
        response.headers.set("x-redirected-from", nextUrl.pathname);
        return response;
      }
    }
  }

  // if (!sid) {
  //   if (nextUrl.pathname.startsWith("/admin")) {
  //     const redirectUrl = new URL("/login", url);
  //     const response = NextResponse.redirect(redirectUrl);
  //     response.headers.set("x-redirected-from", nextUrl.pathname);
  //     return response;
  //   }
  // }

  // const user = await currentUserAction();
  // if (!user) {
  //   const redirectUrl = new URL("/login", url);
  //   const response = NextResponse.redirect(redirectUrl);
  //   response.headers.set("x-redirected-from", nextUrl.pathname);
  //   response.cookies.set("sid", "", { maxAge: 0 });
  //   return response;
  // }

  // const permissions: string[] = Array.from(
  //   new Set(user.roles.flatMap((r) => r.permissions))
  // );

  // const hasPer = permissions
  //   .map((p) => permissionRoutes[p] || null)
  //   .filter((p) => p != null)
  //   .some((regex) => regex.test(nextUrl.pathname));

  // if (!hasPer) {
  //   const redirectUrl = new URL("/", url);
  //   const response = NextResponse.redirect(redirectUrl);
  //   response.headers.set("x-redirected-from", nextUrl.pathname);
  //   return response;
  //   // return new NextResponse("Not Found", { status: 404 });
  // }

  return response;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
