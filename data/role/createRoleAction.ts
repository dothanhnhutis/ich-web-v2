"use server";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { roleInstance } from "./instance";

export type CreateRoleFormData = {
  name: string;
  description: string;
  permissions: string[];
  userIds?: string[];
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
  data: CreateRoleFormData
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
