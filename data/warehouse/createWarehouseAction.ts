"use server";

import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { warehouseInstance } from "./instance";

export type CreateWarehouseFormData = {
  name: string;
  address: string;
};

type CreateWarehouseAPIRes = {
  statusCode: number;
  message: string;
};

export type CreateWarehouseAction = {
  success: boolean;
  message: string;
};

export const createWarehouseAction = async (
  data: CreateWarehouseFormData
): Promise<CreateWarehouseAction> => {
  try {
    const res = await warehouseInstance.post<CreateWarehouseAPIRes>("/", data, {
      headers: await getHeaders(),
    });
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<CreateWarehouseAPIRes>;
      return {
        success: false,
        message: res.data.message,
      };
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`createWarehouseAction func error: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
    console.log(`createWarehouseAction func error: ${error}`);
    return {
      success: false,
      message: "Tạo nhà kho thất bại.",
    };
  }
};
