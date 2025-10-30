"use server";
import { cookies } from "next/headers";
import { cache } from "react";
import { env } from "@/config";
import {
  FetchAPI,
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "./api";
import type { Role } from "./role";
import { getHeaders } from "./utils";

export type User = {
  id: string;
  email: string;
  username: string;
  status: string;
  avatar: Image | null;
  deactived_at: Date;
  role_count: number;
  created_at: Date;
  updated_at: Date;
};

export type UserWithoutPassword = User & {
  has_password: boolean;
};

export type UserPassword = User & {
  password_hash: string;
};

export type QueryUsers = { users: UserWithoutPassword[]; metadata: Metadata };

const userInstance = FetchAPI.create({
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Encoding": "gzip, deflate, br",
  },
  baseUrl: `${env.SERVER_URL}/api/v1/users`,
});

export type CreateUserData = {
  email: string;
  username: string;
  roleIds: string[];
  password?: string;
};

type CreateUserAPIRes = {
  statusCode: number;
  statusText: string;
  data: {
    message: string;
  };
};

export type CreateUserAction = {
  success: boolean;
  message: string;
};

export const createUserAction = async (
  data: CreateUserData
): Promise<CreateUserAction> => {
  try {
    const res = await userInstance.post<CreateUserAPIRes>("/", data, {
      headers: await getHeaders(),
    });
    return {
      success: true,
      message: res.data.data.message,
    };
  } catch (error: unknown) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<CreateUserAPIRes>;
      return {
        success: false,
        message: res.data.data.message,
      };
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`createUserAction func error: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
    console.log(`createUserAction func error: ${error}`);
    return {
      success: false,
      message: "Tạo người dùng thất bại.",
    };
  }
};

export type QueryUsersAPIRes = {
  statusCode: number;
  statusText: string;
  data: { metadata: Metadata; users: UserWithoutPassword[] };
};
export type QueryUsersAction = QueryUsersAPIRes["data"];

export const queryUsersAction = cache(
  async (
    searchParams?: Record<string, string> | string | [string, string][]
  ): Promise<QueryUsersAction> => {
    const q = new URLSearchParams(searchParams || "").toString();

    try {
      const res = await userInstance.get<QueryUsersAPIRes>(q ? `?${q}` : "", {
        headers: await getHeaders(),
      });
      return res.data.data;
    } catch (error: unknown) {
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`queryUserAction func error: `, res.data.message);
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(`queryUserAction func error: ${error.message}`);
      } else {
        console.log(`queryUserAction func error: ${error}`);
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

export type UserDetail = UserWithoutPassword & {
  roles: Role[];
};

type UserDetailAPIRes = {
  statusCode: number;
  statusText: string;
  data: UserDetail;
};

export const currentUserAction = cache(async (): Promise<UserDetail | null> => {
  try {
    const {
      data: { data },
    } = await userInstance.get<UserDetailAPIRes>("/me", {
      headers: await getHeaders(),
    });
    return data;
  } catch (error: unknown) {
    const cookieList = await cookies();
    if (cookieList.has("sid")) cookieList.delete("sid");

    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<{ message: string }>;
      console.log(`currentUserAction func error: ${res.data.message}`);
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`currentUserAction func error: ${error.message}`);
    }
    console.log(`currentUserAction func error: ${error}`);
    return null;
  }
});

export const getUserDetailAction = cache(
  async (id: string): Promise<UserDetail | null> => {
    try {
      const {
        data: { data },
      } = await userInstance.get<UserDetailAPIRes>(`/${id}/detail`, {
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

export const logoutAction = async (): Promise<void> => {
  try {
    await userInstance.delete("/logout", {
      headers: await getHeaders(),
    });
  } catch (error: unknown) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<{ message: string }>;
      console.log(`logoutAction func error: ${res.data.message}`);
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`logoutAction func error: ${error.message}`);
    }
    console.log(`logoutAction func error: ${error}`);
  }
};
