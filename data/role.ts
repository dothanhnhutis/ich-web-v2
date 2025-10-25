"use server";
import { cache } from "react";
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
  candelete: boolean;
  canupdate: boolean;
};

export type RoleDetail = Role & {
  users: UserWithoutPassword[];
};

export type QueryRoles = {
  roles: (Role & {
    users: Omit<UserWithoutPassword, "role_count">[];
  })[];
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

export const queryRolesAction = cache(
  async (
    searchParams?: Record<string, string> | string | [string, string][]
  ) => {
    try {
      const q = new URLSearchParams(searchParams || "").toString();

      const { data: dataRes } = await roleInstance.get<{
        statusCode: number;
        statusText: string;
        data: QueryRoles;
      }>(q ? `?${q}` : "", {
        headers: await getHeaders(),
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
);

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

export type GetRoleDetailActionRes = {
  statusCode: number;
  statusText: string;
  data: RoleDetail;
};

export type GetRoleByIdActionRes = {
  statusCode: number;
  statusText: string;
  data: Role;
};

export type GetUsersByRoleIdActionRes = {
  statusCode: number;
  statusText: string;
  data: {
    users: Omit<UserWithoutPassword, "role_count">[];
    metadata: Metadata;
  };
};

export const createRoleAction = async (data: CreateRoleData) => {
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
};

export const getRoleDetailAction = cache(
  async (id: string): Promise<RoleDetail | null> => {
    try {
      const {
        data: { data },
      } = await roleInstance.get<GetRoleDetailActionRes>(`/${id}/detail`, {
        headers: await getHeaders(),
      });
      return data;
    } catch (error: unknown) {
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`getUserDetailAction func error: ${res.data.message}`);
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(`getUserDetailAction func error: ${error.message}`);
      }
      console.log(`getUserDetailAction func error: ${error}`);
      return null;
    }
  }
);

export const getRoleByIdAction = cache(async (id: string) => {
  try {
    const {
      data: { data },
    } = await roleInstance.get<GetRoleByIdActionRes>(`/${id}`, {
      headers: await getHeaders(),
    });
    return data;
  } catch (error: unknown) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<{ message: string }>;
      console.log(`getRoleByIdAction func error: ${res.data.message}`);
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`getRoleByIdAction func error: ${error.message}`);
    }
    console.log(`getRoleByIdAction func error: ${error}`);
    return null;
  }
});

export const getUserByRoleIdAction = cache(
  async (
    roleId: string,
    searchParams?: Record<string, string> | string | [string, string][]
  ) => {
    const q = new URLSearchParams(searchParams || "").toString();

    try {
      const {
        data: { data },
      } = await roleInstance.get<GetUsersByRoleIdActionRes>(
        `/${roleId}/users${q ? `?${q}` : ""}`,
        {
          headers: await getHeaders(),
        }
      );
      return data;
    } catch (error: unknown) {
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`getUserByRoleIdAction func error: ${res.data.message}`);
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(`getUserByRoleIdAction func error: ${error.message}`);
      }
      console.log(`getUserByRoleIdAction func error: ${error}`);
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
