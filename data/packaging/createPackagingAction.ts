"use server";

import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { packagingInstance } from "./instance";

export type CreatePackagingFormData =
  | {
      name: string;
      unit: "CARTON";
      pcs_ctn: number;
      min_stock_level?: number;
    }
  | {
      name: string;
      unit: "PIECE";
      min_stock_level?: number;
    };

type CreatePackagingAPIRes = {
  statusCode: number;
  message: string;
};

export type CreatePackagingAction = {
  success: boolean;
  message: string;
};

export const createPackagingAction = async (
  data: CreatePackagingFormData
): Promise<CreatePackagingAction> => {
  try {
    const res = await packagingInstance.post<CreatePackagingAPIRes>("/", data, {
      headers: await getHeaders(),
    });
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<CreatePackagingAPIRes>;
      return {
        success: false,
        message: res.data.message,
      };
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`createPackagingAction func error: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
    console.log(`createPackagingAction func error: ${error}`);
    return {
      success: false,
      message: "Tạo nhà kho thất bại.",
    };
  }
};
