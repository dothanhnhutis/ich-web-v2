import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { currentUserAction } from "./data/user";
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

  if (!sid) {
    if (nextUrl.pathname.startsWith("/admin")) {
      const redirectUrl = new URL("/login", url);
      const response = NextResponse.redirect(redirectUrl);
      response.headers.set("x-redirected-from", nextUrl.pathname);
      return response;
    }
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
  }

  return response;

  // let user: UserDetail | null = null;
  // if (sid) {
  //   try {
  //     user = await currentUserAction();
  //   } catch (error: unknown) {
  //     request.cookies.delete("sid");
  //   }
  // }

  // if (user) {
  //   const permissions = Array.from(
  //     new Set(user.roles.flatMap((r) => r.permissions))
  //   );

  //   if (nextUrl.pathname === "/login") {
  //     return NextResponse.redirect(new URL("/admin", url));
  //   }

  //   const hasPer = permissions
  //     .map((p) => permissionRoutes[p] || null)
  //     .filter((p) => p != null)
  //     .some((regex) => regex.test(nextUrl.pathname));

  //   if (!hasPer && nextUrl.pathname !== "/admin")
  //     return NextResponse.rewrite(new URL("/not-found", request.url));
  // } else {
  //   if (nextUrl.pathname.startsWith("/admin")) {
  //     const response = NextResponse.redirect(new URL("/login", request.url));
  //     response.cookies.set("sid", "", { maxAge: 0, path: "/" });
  //     return response;
  //   }
  // }

  // return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
