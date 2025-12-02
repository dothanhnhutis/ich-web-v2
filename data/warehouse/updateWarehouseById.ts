"use server";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { warehouseInstance } from "./instance";

export type UpdateWarehouseByIdFormData = {
  name: string;
  address: string;
};

type UpdateWarehouseByIdAPIRes = {
  statusCode: number;
  message: string;
};

export type UpdateWarehouseByIdAction = {
  success: boolean;
  message: string;
};

export const updateWarehouseByIdAction = async (
  id: string,
  data: UpdateWarehouseByIdFormData
): Promise<UpdateWarehouseByIdAction> => {
  try {
    const res = await warehouseInstance.patch<UpdateWarehouseByIdAPIRes>(
      `/${id}`,
      data,
      {
        headers: await getHeaders(),
      }
    );
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<UpdateWarehouseByIdAPIRes>;
      return {
        success: false,
        message: res.data.message,
      };
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`updateWarehouseByIdAction func error: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
    console.log(`updateWarehouseByIdAction func error: ${error}`);
    return {
      success: false,
      message: "Cập nhật vai trò thất bại.",
    };
  }
};
