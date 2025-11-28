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

type FindManyUserAPIRes = {
  statusCode: number;
  message: string;
  data: { users: UserDetailWithoutPassword[]; metadata: Metadata };
};
export type FindManyUserAction = FindManyUserAPIRes["data"];

export const findManyUserAction = cache(
  async (
    searchParams?: Record<string, string> | string | [string, string][]
  ): Promise<FindManyUserAction> => {
    const q = new URLSearchParams(searchParams || "").toString();

    try {
      const res = await userInstance.get<FindManyUserAPIRes>(q ? `?${q}` : "", {
        headers: await getHeaders(),
      });
      return res.data.data;
    } catch (error: unknown) {
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`findManyUserAction func error: `, res.data.message);
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(`findManyUserAction func error: ${error.message}`);
      } else {
        console.log(`findManyUserAction func error: ${error}`);
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
        users: [],
      };
    }
  }
);
