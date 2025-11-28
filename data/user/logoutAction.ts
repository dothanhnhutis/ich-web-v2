"use server";
import { cookies } from "next/headers";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { userInstance } from "./instance";

export const logoutAction = async (): Promise<void> => {
  try {
    await userInstance.delete("/logout", {
      headers: await getHeaders(),
    });

    const cookieList = await cookies();
    if (cookieList.has("sid")) cookieList.delete("sid");
  } catch (error: unknown) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<{ message: string }>;
      console.log(`logoutAction func error: ${res.data.message}`);
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`logoutAction func error: ${error.message}`);
    }
    console.log(`logoutAction func error: ${error}`);
  }
};
