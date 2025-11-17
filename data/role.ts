"use server";
import { cache } from "react";
import { env } from "@/config";
import {
  FetchAPI,
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "./api";
import type { UserWithoutPassword } from "./user";
import { getHeaders } from "./utils";

const roleInstance = FetchAPI.create({
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Encoding": "gzip, deflate, br",
  },
  baseUrl: `${env.SERVER_URL}/api/v1/roles`,
});

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
  can_delete: boolean;
  can_update: boolean;
};

type QueryRolesAPIRes = {
  statusCode: number;
  data: {
    roles: (Role & { users: Omit<UserWithoutPassword, "role_count">[] })[];
    metadata: Metadata;
  };
};

export type QueryRolesAction = QueryRolesAPIRes["data"];

export const queryRolesAction = cache(
  async (
    searchParams?: Record<string, string> | string | [string, string][]
  ): Promise<QueryRolesAction> => {
    try {
      const q = new URLSearchParams(searchParams || "").toString();

      const res = await roleInstance.get<QueryRolesAPIRes>(q ? `?${q}` : "", {
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

export type CreateRoleActionData = {
  name: string;
  description: string;
  permissions: string[];
  userIds: string[];
};

type CreateUserAPIRes = {
  statusCode: number;
  message: string;
};

export type CreateRoleAction = {
  success: boolean;
  message: string;
};
export const createRoleAction = async (
  data: CreateRoleActionData
): Promise<CreateRoleAction> => {
  try {
    const res = await roleInstance.post<CreateUserAPIRes>("/", data, {
      headers: await getHeaders(),
    });
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<CreateUserAPIRes>;
      return {
        success: false,
        message: res.data.message,
      };
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`createRoleAction func error: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
    console.log(`createRoleAction func error: ${error}`);
    return {
      success: false,
      message: "Tạo vai trò thất bại.",
    };
  }
};

export type RoleDetail = Role & {
  users: Omit<UserWithoutPassword, "role_count">[];
};
export type GetRoleDetailAPIRes = {
  statusCode: number;
  data: RoleDetail;
};
export const getRoleDetailAction = cache(
  async (roleId: string): Promise<RoleDetail | null> => {
    try {
      const {
        data: { data },
      } = await roleInstance.get<GetRoleDetailAPIRes>(`/${roleId}/detail`, {
        headers: await getHeaders(),
      });
      return data;
    } catch (error: unknown) {
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`getRoleDetailAction func error: ${res.data.message}`);
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(`getRoleDetailAction func error: ${error.message}`);
      }
      console.log(`getRoleDetailAction func error: ${error}`);
      return null;
    }
  }
);

type GetRoleByIdActionRes = {
  statusCode: number;
  data: Role;
};
export const getRoleByIdAction = cache(
  async (roleId: string): Promise<Role | null> => {
    try {
      const {
        data: { data },
      } = await roleInstance.get<GetRoleByIdActionRes>(`/${roleId}`, {
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
  }
);

type GetUsersByRoleIdAPIRes = {
  statusCode: number;
  data: {
    metadata: Metadata;
    users: UserWithoutPassword[];
  };
};

type GetUsersByRoleIdAction = GetUsersByRoleIdAPIRes["data"];

export const getUsersByRoleIdAction = cache(
  async (
    roleId: string,
    searchParams?: Record<string, string> | string | [string, string][]
  ): Promise<GetUsersByRoleIdAction> => {
    const q = new URLSearchParams(searchParams || "").toString();

    try {
      const {
        data: { data },
      } = await roleInstance.get<GetUsersByRoleIdAPIRes>(
        `/${roleId}/users${q ? `?${q}` : ""}`,
        {
          headers: await getHeaders(),
        }
      );
      return data;
    } catch (error: unknown) {
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`getUsersByRoleIdAction func error: ${res.data.message}`);
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(`getUsersByRoleIdAction func error: ${error.message}`);
      }
      console.log(`getUsersByRoleIdAction func error: ${error}`);
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

type UpdateRolebyIdActionData = CreateRoleActionData & {
  status: string;
};

export const updateRoleByIdAction = async (
  id: string,
  data: UpdateRolebyIdActionData
) => {
  try {
    const res = await roleInstance.patch<CreateUserAPIRes>(`/${id}`, data, {
      headers: await getHeaders(),
    });
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<CreateUserAPIRes>;
      return {
        success: false,
        message: res.data.message,
      };
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`updateRoleByIdAction func error: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
    console.log(`updateRoleByIdAction func error: ${error}`);
    return {
      success: false,
      message: "Cập nhật vai trò thất bại.",
    };
  }
};

export const deleteRoleByIdAction = async (id: string) => {
  try {
    const res = await roleInstance.delete<CreateUserAPIRes>(`/${id}`, {
      headers: await getHeaders(),
    });
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<CreateUserAPIRes>;
      return {
        success: false,
        message: res.data.message,
      };
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`deleteRoleByIdAction func error: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
    console.log(`deleteRoleByIdAction func error: ${error}`);
    return {
      success: false,
      message: "Xoá vai trò thất bại.",
    };
  }
};
