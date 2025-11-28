"use server";

import { cache } from "react";
import type { Role } from "@/types/summary-types";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { userInstance } from "./instance";

type FindRolesByUserIdAPIRes = {
  statusCode: number;
  message: string;
  data: { roles: Role[]; metadata: Metadata };
};
export type FindRolesByUserIdAction = FindRolesByUserIdAPIRes["data"];

export const findRolesByUserIdAction = cache(
  async (
    userId: string,
    searchParams?: Record<string, string> | string | [string, string][]
  ): Promise<FindRolesByUserIdAction> => {
    const q = new URLSearchParams(searchParams || "").toString();

    try {
      const { data: res } = await userInstance.get<FindRolesByUserIdAPIRes>(
        `/${userId}/roles${q ? `?${q}` : ""}`,
        {
          headers: await getHeaders(),
        }
      );
      return res.data;
    } catch (error: unknown) {
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`findRolesByUserIdAction func error: `, res.data.message);
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(`findRolesByUserIdAction func error: ${error.message}`);
      } else {
        console.log(`findRolesByUserIdAction func error: ${error}`);
      }
      return {
        metadata: {
          hasNextPage: false,
          itemStart: 0,
          itemEnd: 0,
          limit: 0,
          totalItem: 0,
          totalPage: 0,
        },
        roles: [],
      };
    }
  }
);
