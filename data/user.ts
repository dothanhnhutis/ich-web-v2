"use server";
import { cookies } from "next/headers";
import { cache } from "react";
import { env } from "@/config";
import type {
  UserDetailWithoutPassword,
  UserWithoutPassword,
} from "@/types/summary-types";
import {
  FetchAPI,
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "./api";
import { getHeaders } from "./utils";

const userInstance = FetchAPI.create({
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Encoding": "gzip, deflate, br",
  },
  baseUrl: `${env.SERVER_URL}/api/v1/users`,
});

export type CreateUserFormData = {
  email: string;
  username: string;
  roleIds: string[];
  password?: string;
};

type CreateUserAPIRes = {
  statusCode: number;
  message: string;
};

export type CreateUserAction = {
  success: boolean;
  message: string;
};

export const createUserAction = async (
  data: CreateUserFormData
): Promise<CreateUserAction> => {
  try {
    const res = await userInstance.post<CreateUserAPIRes>("/", data, {
      headers: await getHeaders(),
    });
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error: unknown) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<CreateUserAPIRes>;
      return {
        success: false,
        message: res.data.message,
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

export type FindManyUsersAPIRes = {
  statusCode: number;
  data: { users: UserDetailWithoutPassword[]; metadata: Metadata };
};
export type FindManyUsersAction = FindManyUsersAPIRes["data"];

export const findManyUsersAction = cache(
  async (
    searchParams?: Record<string, string> | string | [string, string][]
  ): Promise<FindManyUsersAction> => {
    const q = new URLSearchParams(searchParams || "").toString();

    try {
      const res = await userInstance.get<FindManyUsersAPIRes>(
        q ? `?${q}` : "",
        {
          headers: await getHeaders(),
        }
      );
      return res.data.data;
    } catch (error: unknown) {
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`findManyUsersAction func error: `, res.data.message);
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(`findManyUsersAction func error: ${error.message}`);
      } else {
        console.log(`findManyUsersAction func error: ${error}`);
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

export const findUserWithoutPasswordByIdAction = async (userId: string) => {
  try {
    const { data: res } = await userInstance.get<{
      statusCode: number;
      message: string;
      data: UserWithoutPassword;
    }>(`/${userId}`, {
      headers: await getHeaders(),
    });

    return res.data;
  } catch (error) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<{ message: string }>;
      console.log(`findUserByIdAction func error: ${res.data.message}`);
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`findUserByIdAction func error: ${error.message}`);
    }
    console.log(`findUserByIdAction func error: ${error}`);
    return null;
  }
};

type UserDetailAPIRes = {
  statusCode: number;
  data: UserDetailWithoutPassword;
};

export const currentUserAction = cache(
  async (): Promise<UserDetailWithoutPassword | null> => {
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
  }
);

export const findUserDetailAction = cache(
  async (userId: string): Promise<UserDetailWithoutPassword | null> => {
    try {
      const {
        data: { data },
      } = await userInstance.get<UserDetailAPIRes>(`/${userId}/detail`, {
        headers: await getHeaders(),
      });
      return data;
    } catch (error: unknown) {
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`findUserDetailAction func error: ${res.data.message}`);
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(`findUserDetailAction func error: ${error.message}`);
      }
      console.log(`findUserDetailAction func error: ${error}`);
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

export type UpdateUserByIdFormData = {
  email: string;
  username: string;
  status: string;
  roleIds?: string[];
};

export type UpdateUserByIdAction = {
  success: boolean;
  message: string;
};

export const updateUserByIdAction = async (
  id: string,
  data: UpdateUserByIdFormData
): Promise<UpdateUserByIdAction> => {
  try {
    const res = await userInstance.patch<{
      statusCode: number;
      message: string;
    }>(`/${id}`, data, {
      headers: await getHeaders(),
    });
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error: unknown) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<{
        statusCode: number;
        message: string;
      }>;
      return {
        success: false,
        message: res.data.message,
      };
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`updateUserByIdAction func error: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
    console.log(`updateUserByIdAction func error: ${error}`);
    return {
      success: false,
      message: "Cập nhật người dùng thất bại.",
    };
  }
};
