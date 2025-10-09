"use server";
import { env } from "@/config";
import {
  FetchAPI,
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "./api";
import { getHeaders } from "./utils";

const userInstance = FetchAPI.create({
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Encoding": "gzip, deflate, br",
  },
  baseUrl: `${env.SERVER_URL}/api/v1/users`,
});

export async function currentUser(): Promise<UserDetail | null> {
  try {
    const {
      data: { data },
    } = await userInstance.get<UserDetailAPIRes>("/me", {
      headers: await getHeaders(),
    });
    return data;
  } catch (error: unknown) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<{ message: string }>;
      console.log(`currentUser func error: ${res.data.message}`);
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`currentUser func error: ${error.message}`);
    }
    console.log(`currentUser func error: ${error}`);
    return null;
  }
}

export async function logout() {
  try {
    await userInstance.delete("/logout", {
      headers: await getHeaders(),
    });
  } catch (error: unknown) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<{ message: string }>;
      console.log(`logout func error: ${res.data.message}`);
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`logout func error: ${error.message}`);
    }
    console.log(`logout func error: ${error}`);
  }
}
