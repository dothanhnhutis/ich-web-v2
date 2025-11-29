"use server";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { roleInstance } from "./instance";

type DeleteRoleByIdAPIRes = {
  statusCode: number;
  message: string;
};

export type DeleteRoleByIdAction = {
  success: boolean;
  message: string;
};

export const deleteRoleByIdAction = async (
  id: string
): Promise<DeleteRoleByIdAction> => {
  try {
    const res = await roleInstance.delete<DeleteRoleByIdAPIRes>(`/${id}`, {
      headers: await getHeaders(),
    });
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<DeleteRoleByIdAPIRes>;
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
