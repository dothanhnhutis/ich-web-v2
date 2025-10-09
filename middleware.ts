import { type NextRequest, NextResponse } from "next/server";
import { currentUser } from "./data/user";
import { permissionRoutes } from "./routes";

export async function middleware(request: NextRequest) {
  const { nextUrl, url } = request;

  const sid = request.cookies.get("sid");
  let user: UserDetail | null = null;
  if (sid) {
    try {
      user = await currentUser();
    } catch (error: unknown) {
      request.cookies.delete("sid");
    }
  }

  if (user) {
    const permissions = Array.from(
      new Set(user.roles.flatMap((r) => r.permissions))
    );

    if (nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/admin", url));
    }

    const hasPer = permissions
      .map((p) => permissionRoutes[p] || null)
      .filter((p) => p != null)
      .some((regex) => regex.test(nextUrl.pathname));

    if (!hasPer && nextUrl.pathname !== "/admin")
      return NextResponse.rewrite(new URL("/not-found", request.url));
  } else {
    if (nextUrl.pathname.startsWith("/admin")) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.set("sid", "", { maxAge: 0, path: "/" });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
