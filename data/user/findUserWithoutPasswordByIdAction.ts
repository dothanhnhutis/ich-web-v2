"use server";

import { cache } from "react";
import type { UserWithoutPassword } from "@/types/summary-types";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { userInstance } from "./instance";

export const findUserWithoutPasswordByIdAction = cache(
  async (userId: string): Promise<UserWithoutPassword | null> => {
    try {
      const {
        data: { data },
      } = await userInstance.get<{
        statusCode: number;
        message: string;
        data: UserWithoutPassword;
      }>(`/${userId}`, {
        headers: await getHeaders(),
      });
      return data;
    } catch (error: unknown) {
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(
          `findUserWithoutPasswordByIdAction func error: ${res.data.message}`
        );
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(
          `findUserWithoutPasswordByIdAction func error: ${error.message}`
        );
      }
      console.log(`findUserWithoutPasswordByIdAction func error: ${error}`);
      return null;
    }
  }
);
