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

type FindManyWarehouseAPIRes = {
  statusCode: number;
  data: {
    warehouses: WarehouseDetail[];
    metadata: Metadata;
  };
};

export type FindManyWarehouseAction = FindManyWarehouseAPIRes["data"];

export const findManyWarehouseAction = cache(
  async (
    searchParams?: Record<string, string> | string | [string, string][]
  ): Promise<FindManyWarehouseAction> => {
    try {
      const q = new URLSearchParams(searchParams || "").toString();

      const res = await warehouseInstance.get<FindManyWarehouseAPIRes>(
        q ? `?${q}` : "",
        {
          headers: await getHeaders(),
          cache: "no-store",
        }
      );

      return res.data.data;
    } catch (error) {
      if (error instanceof FetchAPINetWorkError) {
        console.log(`findManyWarehouseAction func error: ${error.message}`);
      }
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`findManyWarehouseAction func error: ${res.data.message}`);
      } else {
        console.log(`findManyWarehouseAction func error: ${error}`);
      }

      return {
        warehouses: [],
        metadata: {
          totalItem: 0,
          totalPage: 0,
          hasNextPage: false,
          limit: 0,
          itemStart: 0,
          itemEnd: 0,
        },
      };
    }
  }
);
