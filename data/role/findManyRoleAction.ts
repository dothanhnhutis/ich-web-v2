"use server";

import { cache } from "react";
import type { RoleDetail } from "@/types/summary-types";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { roleInstance } from "./instance";

type FindManyRoleAPIRes = {
  statusCode: number;
  data: {
    roles: RoleDetail[];
    metadata: Metadata;
  };
};

export type FindManyRoleAction = FindManyRoleAPIRes["data"];

export const findManyRoleAction = cache(
  async (
    searchParams?: Record<string, string> | string | [string, string][]
  ): Promise<FindManyRoleAction> => {
    try {
      const q = new URLSearchParams(searchParams || "").toString();

      const res = await roleInstance.get<FindManyRoleAPIRes>(q ? `?${q}` : "", {
        headers: await getHeaders(),
        cache: "no-store",
      });

      return res.data.data;
    } catch (error) {
      if (error instanceof FetchAPINetWorkError) {
        console.log(`queryRolesAction func error: ${error.message}`);
      }
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`queryRolesAction func error: ${res.data.message}`);
      } else {
        console.log(`queryRolesAction func error: ${error}`);
      }

      return {
        roles: [],
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
