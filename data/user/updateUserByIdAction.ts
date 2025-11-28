"use server";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { userInstance } from "./instance";

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

type UpdateUserByIdAPIRes = {
  statusCode: number;
  message: string;
};

export const updateUserByIdAction = async (
  userId: string,
  data: UpdateUserByIdFormData
): Promise<UpdateUserByIdAction> => {
  try {
    const res = await userInstance.patch<UpdateUserByIdAPIRes>(
      `/${userId}`,
      data,
      {
        headers: await getHeaders(),
      }
    );
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error: unknown) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<UpdateUserByIdAPIRes>;
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
