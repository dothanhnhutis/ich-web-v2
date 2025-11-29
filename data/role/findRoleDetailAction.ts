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

export type FindRoleDetailAPIRes = {
  statusCode: number;
  data: RoleDetail;
};

export const findRoleDetailAction = cache(
  async (roleId: string): Promise<RoleDetail | null> => {
    try {
      const {
        data: { data },
      } = await roleInstance.get<FindRoleDetailAPIRes>(`/${roleId}/detail`, {
        headers: await getHeaders(),
      });
      return data;
    } catch (error: unknown) {
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`findRoleDetailAction func error: ${res.data.message}`);
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(`findRoleDetailAction func error: ${error.message}`);
      }
      console.log(`findRoleDetailAction func error: ${error}`);
      return null;
    }
  }
);
