"use server";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import type { CreateRoleFormData } from "./createRoleAction";
import { roleInstance } from "./instance";

export type UpdateRolebyIdFormData = CreateRoleFormData & {
  status: string;
};

type UpdateRoleByIdAPIRes = {
  statusCode: number;
  message: string;
};

export type UpdateRoleByIdAction = {
  success: boolean;
  message: string;
};

export const updateRoleByIdAction = async (
  id: string,
  data: UpdateRolebyIdFormData
): Promise<UpdateRoleByIdAction> => {
  try {
    const res = await roleInstance.patch<UpdateRoleByIdAPIRes>(`/${id}`, data, {
      headers: await getHeaders(),
    });
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<UpdateRoleByIdAPIRes>;
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
