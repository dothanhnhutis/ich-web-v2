"use server";
import { cache } from "react";
import type { WarehouseDetail } from "@/types/summary-types";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { warehouseInstance } from "./instance";

export type FindWarehouseDetailAPIRes = {
  statusCode: number;
  data: WarehouseDetail;
};

export const findDetailWarehouseAction = cache(
  async (roleId: string): Promise<WarehouseDetail | null> => {
    try {
      const { data: res } =
        await warehouseInstance.get<FindWarehouseDetailAPIRes>(
          `/${roleId}/detail`,
          {
            headers: await getHeaders(),
          }
        );
      return res.data;
    } catch (error: unknown) {
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(
          `findDetailWarehouseAction func error: ${res.data.message}`
        );
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(`findDetailWarehouseAction func error: ${error.message}`);
      }
      console.log(`findDetailWarehouseAction func error: ${error}`);
      return null;
    }
  }
);
