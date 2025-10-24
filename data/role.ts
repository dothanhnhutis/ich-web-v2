"use server";
import { env } from "@/config";
import { awaitCus } from "@/lib/utils";
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
    await awaitCus(2000);
    const q = new URLSearchParams(searchParams || "").toString();

    const { data: dataRes } = await roleInstance.get<{
      statusCode: number;
      statusText: string;
      data: QueryRoles;
    }>(q ? `?${q}` : "", {
      headers: await getHeaders(),
      cache: "no-store",
    });

    return dataRes.data;
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

export type CreateRoleData = {
  name: string;
  description: string;
  permissions: string[];
};

export type CreateUserActionRes = {
  statusCode: number;
  statusText: string;
  data: {
    message: string;
  };
};

export async function createRoleAction(data: CreateRoleData) {
  try {
    const { data: dataRes } = await roleInstance.post<CreateUserActionRes>(
      "/",
      data,
      {
        headers: await getHeaders(),
      }
    );
    return dataRes;
  } catch (error) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<CreateUserActionRes>;
      return res.data;
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`createRoleAction func error: ${error.message}`);
      return {
        statusCode: error.status,
        statusText: error.statusText,
        data: {
          message: error.message,
        },
      };
    }
    console.log(`createRoleAction func error: ${error}`);
    return {
      statusCode: 400,
      statusText: "BAD_REQUEST",
      data: {
        message: "Tạo vai trò thất bại.",
      },
    };
  }
}
