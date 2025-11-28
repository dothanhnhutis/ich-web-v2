"use server";

import { cache } from "react";
import type { UserDetailWithoutPassword } from "@/types/summary-types";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { userInstance } from "./instance";

export const findUserDetailAction = cache(
  async (userId: string): Promise<UserDetailWithoutPassword | null> => {
    try {
      const {
        data: { data },
      } = await userInstance.get<{
        statusCode: number;
        message: string;
        data: UserDetailWithoutPassword;
      }>(`/${userId}/detail`, {
        headers: await getHeaders(),
      });
      return data;
    } catch (error: unknown) {
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`findUserDetailAction func error: ${res.data.message}`);
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(`findUserDetailAction func error: ${error.message}`);
      }
      console.log(`findUserDetailAction func error: ${error}`);
      return null;
    }
  }
);
