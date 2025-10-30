"use server";
import { env } from "@/config";
import {
  FetchAPI,
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "./api";
import { getHeaders, loadCookie } from "./utils";

const authInstance = FetchAPI.create({
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Encoding": "gzip, deflate, br",
  },
  baseUrl: `${env.SERVER_URL}/api/v1/auth`,
});

export type LoginActionData = {
  email: string;
  password: string;
};

export type LoginAPIRes = {
  statusCode: number;
  statusText: string;
  data: {
    message: string;
  };
};

export type LoginAction = {
  success: boolean;
  message: string;
};

export async function loginAction(data: LoginActionData): Promise<LoginAction> {
  try {
    const res = await authInstance.post<LoginAPIRes>("/signin", data, {
      headers: await getHeaders(),
    });
    const rawCookie = res.headers.get("set-cookie") ?? "";
    await loadCookie(rawCookie);
    return {
      success: true,
      message: res.data.data.message,
    };
  } catch (error) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<LoginAPIRes>;
      return {
        success: false,
        message: res.data.data.message,
      };
    }

    if (error instanceof FetchAPINetWorkError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Email và mật khẩu không hợp lệ.",
    };
  }
}
