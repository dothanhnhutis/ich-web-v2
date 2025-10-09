interface CookieOpt {
  domain?: string | undefined;
  encode?(value: string): string;
  expires?: Date | undefined;
  httpOnly?: boolean | undefined;
  maxAge?: number | undefined;
  partitioned?: boolean | undefined;
  path?: string | undefined;
  priority?: "low" | "medium" | "high" | undefined;
  sameSite?: true | false | "lax" | "strict" | "none" | undefined;
  secure?: boolean | undefined;
}

type Metadata = {
  totalItem: number;
  totalPage: number;
  hasNextPage: number | boolean;
  limit: number;
  itemStart: number;
  itemEnd: number;
};
