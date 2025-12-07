"use server";

import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { packagingInstance } from "./instance";

export type UploadPackagingImageAction = {
  success: boolean;
  message: string;
};
type UploadPackagingImageAPIRes = {
  statusCode: number;
  message: string;
};

const uploadPackagingImageAction = async (
  packagingId: string,
  file?: File
): Promise<UploadPackagingImageAction> => {
  try {
    let res: FetchAPIResponse<UploadPackagingImageAPIRes>;
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      res = await packagingInstance.patch<UploadPackagingImageAPIRes>(
        `/${packagingId}/image`,
        formData,
        {
          headers: await getHeaders(),
        }
      );
    } else {
      res = await packagingInstance.delete<UploadPackagingImageAPIRes>(
        `/${packagingId}/image`,
        {
          headers: await getHeaders(),
        }
      );
    }

    return {
      success: true,
      message: res.data.message,
    };
  } catch (error) {
    if (error instanceof FetchAPIError) {
      const res =
        error.response as FetchAPIResponse<UploadPackagingImageAPIRes>;
      return {
        success: false,
        message: res.data.message,
      };
    }
    if (error instanceof FetchAPINetWorkError) {
      console.log(`uploadPackagingImageAction func error: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
    console.log(`uploadPackagingImageAction func error: ${error}`);
    return {
      success: false,
      message: "Cập nhật hình bao bì thất bại.",
    };
  }
};

export default uploadPackagingImageAction;
