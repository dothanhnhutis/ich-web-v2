"use server";
import { cache } from "react";
import type { UserWithoutPassword } from "@/types/summary-types";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { roleInstance } from "./instance";

type FindUsersByRoleIdAPIRes = {
  statusCode: number;
  data: {
    metadata: Metadata;
    users: UserWithoutPassword[];
  };
};

type FindUsersByRoleIdAction = FindUsersByRoleIdAPIRes["data"];

export const findUsersByRoleIdAction = cache(
  async (
    roleId: string,
    searchParams?: Record<string, string> | string | [string, string][]
  ): Promise<FindUsersByRoleIdAction> => {
    const q = new URLSearchParams(searchParams || "").toString();

    try {
      const {
        data: { data },
      } = await roleInstance.get<FindUsersByRoleIdAPIRes>(
        `/${roleId}/users${q ? `?${q}` : ""}`,
        {
          headers: await getHeaders(),
        }
      );
      return data;
    } catch (error: unknown) {
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`findUsersByRoleIdAction func error: ${res.data.message}`);
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(`findUsersByRoleIdAction func error: ${error.message}`);
      }
      console.log(`findUsersByRoleIdAction func error: ${error}`);
      return {
        users: [],
        metadata: {
          totalItem: 0,
          totalPage: 0,
          hasNextPage: false,
          limit: 0,
          itemStart: 0,
          itemEnd: 0,
        },
      };
    }
  }
);
