"use server";

import type { Packaging } from "@/types/summary-types";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { packagingInstance } from "./instance";
import uploadPackagingImageAction from "./uploadPackagingImageAction";

export type UpdatePackagingByIdFormData = {
  name?: string;
  status?: "ACTIVE" | "DISABLE";
  unit?: "CARTON" | "PIECE";
  pcs_ctn?: number;
  min_stock_level?: number;
  file?: File | null;
};

type UpdatePackagingByIdAPIRes = {
  statusCode: number;
  message: string;
  data: Packaging;
};

export type UpdatePackagingAction = {
  success: boolean;
  message: string;
};

const updatePackagingByIdAction = async (
  data: UpdatePackagingByIdFormData
): Promise<UpdatePackagingAction> => {
  const { file, ...packagingData } = data;
  try {
    const res = await packagingInstance.post<UpdatePackagingByIdAPIRes>(
      "/",
      packagingData,
      {
        headers: await getHeaders(),
      }
    );

    if (file) await uploadPackagingImageAction(res.data.data.id, file);

    return {
      success: true,
      message: res.data.message,
    };
  } catch (error) {
    if (error instanceof FetchAPIError) {
      const res = error.response as FetchAPIResponse<UpdatePackagingByIdAPIRes>;
      return {
        success: false,
        message: res.data.message,
      };
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`updatePackagingByIdAction func error: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
    console.log(`updatePackagingByIdAction func error: ${error}`);
    return {
      success: false,
      message: "Cập nhật nhà kho thất bại.",
    };
  }
};

export default updatePackagingByIdAction;
