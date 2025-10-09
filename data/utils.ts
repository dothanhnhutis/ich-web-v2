import "server-only";
import { cookies, headers } from "next/headers";

// export interface CookieOpt {
//   domain?: string | undefined;
//   encode?(value: string): string;
//   expires?: Date | undefined;
//   httpOnly?: boolean | undefined;
//   maxAge?: number | undefined;
//   partitioned?: boolean | undefined;
//   path?: string | undefined;
//   priority?: "low" | "medium" | "high" | undefined;
//   sameSite?: true | false | "lax" | "strict" | "none" | undefined;
//   secure?: boolean | undefined;
// }

export const getHeaders = async () => {
  const allCookie = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
    .join("; ");
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "Unknown";
  const ipRaw = headersList.get("x-forwarded-for") || "127.0.0.1";
  const clientIP = ipRaw.split(",")[0].trim();

  return {
    Cookie: allCookie,
    "x-forwarded-for": clientIP,
    "user-agent": userAgent,
  };
};

export async function loadCookie(rawCookie: string) {
  const cookiesParse = string2Cookie(rawCookie);
  const cookieStore = await cookies();
  for (const { name, value, options } of cookiesParse) {
    cookieStore.set(name, value, options);
  }
}

function string2Cookie(cookieHeader: string) {
  const cookieRegex = /[^,]+(?:,(?!\s*[A-Za-z0-9!#$%&'*+\-.^_`|~]+=)[^,]+)*/g;
  const cookiesArray = cookieHeader.match(cookieRegex);

  const cookies: {
    name: string;
    value: string;
    options: CookieOpt;
  }[] = [];

  if (cookiesArray) {
    cookiesArray.forEach((cookieStr) => {
      const parts = cookieStr.split(";").map((part) => part.trim());
      const [nameValue, ...attributes] = parts;
      const [name, value] = nameValue.split("=");

      const options: CookieOpt = { path: "/" };

      attributes.forEach((attr) => {
        const [attrName, attrVal] = attr.split("=");
        switch (attrName.toLowerCase()) {
          case "expires":
            options.expires = new Date(attrVal);
            break;
          case "path":
            options.path = attrVal;
            break;
          case "httponly":
            options.httpOnly = true;
            break;
          case "secure":
            options.secure = true;
            break;
          case "samesite":
            options.sameSite = attrVal as CookieOpt["sameSite"];
            break;
          default:
            break;
        }
      });
      cookies.push({
        name,
        value,
        options,
      });
    });
  }

  return cookies;
}
