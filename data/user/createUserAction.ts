"use server";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { userInstance } from "./instance";

export type CreateUserFormData = {
  email: string;
  username: string;
  roleIds: string[];
  password?: string;
};

export type CreateUserAction = {
  success: boolean;
  message: string;
};

type CreateUserAPIRes = {
  statusCode: number;
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
