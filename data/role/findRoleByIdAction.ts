"use server";
import { cache } from "react";
import type { Role } from "@/types/summary-types";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { roleInstance } from "./instance";

type FindRoleByIdActionRes = {
  statusCode: number;
  data: Role;
};
export const findRoleByIdAction = cache(
  async (roleId: string): Promise<Role | null> => {
    try {
      const {
        data: { data },
      } = await roleInstance.get<FindRoleByIdActionRes>(`/${roleId}`, {
        headers: await getHeaders(),
      });
      return data;
    } catch (error: unknown) {
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`findRoleByIdAction func error: ${res.data.message}`);
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(`findRoleByIdAction func error: ${error.message}`);
      }
      console.log(`findRoleByIdAction func error: ${error}`);
      return null;
    }
  }
);
