"use server";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { packagingInstance } from "./instance";

type DeletePackagingByIdAPIRes = {
  statusCode: number;
  message: string;
};

export type DeletePackagingByIdAction = {
  success: boolean;
  message: string;
};

export const deletePackagingByIdAction = async (
  warehouseId: string
): Promise<DeletePackagingByIdAction> => {
  try {
    const res = await packagingInstance.delete<DeletePackagingByIdAPIRes>(
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
      const res = error.response as FetchAPIResponse<DeletePackagingByIdAPIRes>;
      return {
        success: false,
        message: res.data.message,
      };
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`deletePackagingByIdAction func error: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
    console.log(`deletePackagingByIdAction func error: ${error}`);
    return {
      success: false,
      message: "Xoá nhà kho thất bại.",
    };
  }
};
