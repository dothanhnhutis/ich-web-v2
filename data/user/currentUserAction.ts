"use server";

import { cookies } from "next/headers";
import { cache } from "react";
import type { UserDetailWithoutPassword } from "@/types/summary-types";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { userInstance } from "./instance";

export const currentUserAction = cache(
  async (): Promise<UserDetailWithoutPassword | null> => {
    try {
      const {
        data: { data },
      } = await userInstance.get<{
        statusCode: number;
        message: string;
        data: UserDetailWithoutPassword;
      }>("/me", {
        headers: await getHeaders(),
      });
      return data;
    } catch (error: unknown) {
      const cookieList = await cookies();
      if (cookieList.has("sid")) cookieList.delete("sid");

      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`currentUserAction func error: ${res.data.message}`);
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(`currentUserAction func error: ${error.message}`);
      }
      console.log(`currentUserAction func error: ${error}`);
      return null;
    }
  }
);
