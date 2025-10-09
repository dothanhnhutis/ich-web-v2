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

export async function loginAction(data: Login): Promise<LoginAPIRes> {
  try {
    const { data: dataRes, headers } = await authInstance.post<LoginAPIRes>(
      "/signin",
      data,
      {
        headers: await getHeaders(),
      }
    );
    const rawCookie = headers.get("set-cookie") ?? "";
    await loadCookie(rawCookie);
    return dataRes;
  } catch (error) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<LoginAPIRes>;
      return res.data;
    }

    if (error instanceof FetchAPINetWorkError) {
      return {
        statusCode: error.status,
        statusText: error.statusText,
        data: {
          message: error.message,
        },
      };
    }

    return {
      statusCode: 400,
      statusText: "BAD_REQUEST",
      data: {
        message: "Email và mật khẩu không hợp lệ.",
      },
    };
  }
}
