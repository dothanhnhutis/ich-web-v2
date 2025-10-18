"use server";
import { env } from "@/config";
import {
  FetchAPI,
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "./api";
import type { User, UserWithoutPassword } from "./user";
import { getHeaders } from "./utils";

export type Role = {
  id: string;
  name: string;
  permissions: string[];
  description: string;
  status: string;
  deactived_at: Date;
  created_at: Date;
  updated_at: Date;
  user_count: number;
};

export type RoleDetail = Role & {
  users: UserWithoutPassword[];
};

export type QueryRoles = {
  roles: Role[];
  metadata: Metadata;
};

export type QueryUsersByRoleId = {
  users: User[];
  metadata: Metadata;
};

const roleInstance = FetchAPI.create({
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Encoding": "gzip, deflate, br",
  },
  baseUrl: `${env.SERVER_URL}/api/v1/roles`,
});

export async function queryRolesAction(
  searchParams?: Record<string, string> | string | [string, string][]
) {
  try {
    const q = new URLSearchParams(searchParams || "").toString();

    const { data: dataRes } = await roleInstance.get<{
      statusCode: number;
      statusText: string;
      data: QueryRoles;
    }>(q ? `?${q}` : "", {
      headers: await getHeaders(),
    });

    return dataRes;
  } catch (error) {
    if (error instanceof FetchAPINetWorkError) {
      console.log(`logout func error: ${error.message}`);
    }

    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<{ message: string }>;
      console.log(`logout func error: ${res.data.message}`);
    }

    return {
      statusCode: 400,
      statusText: "BAD_REQUEST",
      data: {
        roles: [],
        metadata: {
          totalItem: 0,
          totalPage: 0,
          hasNextPage: false,
          limit: 0,
          itemStart: 0,
          itemEnd: 0,
        },
      },
    };
  }
}
