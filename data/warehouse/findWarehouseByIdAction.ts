"use server";

import { cache } from "react";
import type { Warehouse } from "@/types/summary-types";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { warehouseInstance } from "./instance";

type FindWarehouseByIdAPIRes = {
  statusCode: number;
  message: string;
  data: Warehouse;
};

export const findWarehouseByIdAction = cache(
  async (warehouseId: string): Promise<Warehouse | null> => {
    try {
      const { data: res } =
        await warehouseInstance.get<FindWarehouseByIdAPIRes>(
          `/${warehouseId}`,
          {
            headers: await getHeaders(),
          }
        );

      return res.data;
    } catch (error) {
      if (error instanceof FetchAPINetWorkError) {
        console.log(`findWarehouseByIdAction func error: ${error.message}`);
      }
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`findWarehouseByIdAction func error: ${res.data.message}`);
      } else {
        console.log(`findWarehouseByIdAction func error: ${error}`);
      }

      return null;
    }
  }
);
