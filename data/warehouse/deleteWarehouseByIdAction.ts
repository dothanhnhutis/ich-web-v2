"use server";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { warehouseInstance } from "./instance";

type DeleteWarehouseByIdAPIRes = {
  statusCode: number;
  message: string;
};

export type DeleteWarehouseByIdAction = {
  success: boolean;
  message: string;
};

export const deleteWarehouseByIdAction = async (
  warehouseId: string
): Promise<DeleteWarehouseByIdAction> => {
  try {
    const res = await warehouseInstance.delete<DeleteWarehouseByIdAPIRes>(
      `/${warehouseId}`,
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
      const res = error.response as FetchAPIResponse<DeleteWarehouseByIdAPIRes>;
      return {
        success: false,
        message: res.data.message,
      };
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`deleteWarehouseByIdAction func error: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
    console.log(`deleteWarehouseByIdAction func error: ${error}`);
    return {
      success: false,
      message: "Xoá nhà kho thất bại.",
    };
  }
};
