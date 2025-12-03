"use server";
import { cache } from "react";
import type { StockAt } from "@/types/summary-types";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { packagingInstance } from "./instance";

type FindWarehousesByPackagingIdAPIRes = {
  statusCode: number;
  data: {
    metadata: Metadata;
    warehouses: StockAt[];
  };
};

type FindWarehousesByPackagingIdAction =
  FindWarehousesByPackagingIdAPIRes["data"];

export const findWarehousesByPackagingIdAction = cache(
  async (
    packagingId: string,
    searchParams?: Record<string, string> | string | [string, string][]
  ): Promise<FindWarehousesByPackagingIdAction> => {
    const q = new URLSearchParams(searchParams || "").toString();

    try {
      const { data: res } =
        await packagingInstance.get<FindWarehousesByPackagingIdAPIRes>(
          `/${packagingId}/warehouses${q ? `?${q}` : ""}`,
          {
            headers: await getHeaders(),
          }
        );
      return res.data;
    } catch (error: unknown) {
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(
          `findWarehousesByPackagingIdAction func error: ${res.data.message}`
        );
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(
          `findWarehousesByPackagingIdAction func error: ${error.message}`
        );
      }
      console.log(`findWarehousesByPackagingIdAction func error: ${error}`);
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
