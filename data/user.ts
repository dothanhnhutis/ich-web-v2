"use server";
import { cookies } from "next/headers";
import { cache } from "react";
import { env } from "@/config";
import {
  type DefaultAPIRes,
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

export type UserDetail = UserWithoutPassword & {
  roles: Role[];
};

export type UserDetailAPIRes = {
  statusCode: number;
  statusText: string;
  data: UserDetail;
};

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

export type CreateUserAPIRes = {
  statusCode: number;
  statusText: string;
  data: {
    message: string;
  };
};

export type QueryUsersAPIRes = {
  metadata: Metadata;
  users: UserWithoutPassword[];
};

export const createUserAction = async (
  data: CreateUserData
): Promise<CreateUserAPIRes> => {
  try {
    const { data: dataRes } = await userInstance.post<CreateUserAPIRes>(
      "/",
      data,
      {
        headers: await getHeaders(),
      }
    );
    return dataRes;
  } catch (error: unknown) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<CreateUserAPIRes>;
      return res.data;
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`createUserAction func error: ${error.message}`);
      return {
        statusCode: error.status,
        statusText: error.statusText,
        data: {
          message: error.message,
        },
      };
    }
    console.log(`createUserAction func error: ${error}`);
    return {
      statusCode: 400,
      statusText: "BAD_REQUEST",
      data: {
        message: "Tạo người dùng thất bại.",
      },
    };
  }
};

export const queryUserAction = cache(
  async (
    searchParams?: Record<string, string> | string | [string, string][]
  ): Promise<QueryUsersAPIRes> => {
    const q = new URLSearchParams(searchParams || "").toString();

    try {
      const {
        data: { data },
      } = await userInstance.get<{
        statusText: string;
        statusCode: number;
        data: QueryUsersAPIRes;
      }>(q ? `?${q}` : "", {
        headers: await getHeaders(),
      });
      return data;
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
