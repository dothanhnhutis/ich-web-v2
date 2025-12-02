"use server";
import { cache } from "react";
import type {
  Packaging,
  PackagingAtWarehouse,
  UserWithoutPassword,
  WarehouseDetail,
} from "@/types/summary-types";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { warehouseInstance } from "./instance";

type FindPackagingsByWarehouseIdAPIRes = {
  statusCode: number;
  data: {
    metadata: Metadata;
    packagings: PackagingAtWarehouse[];
  };
};

type GetUsersByRoleIdAction = FindPackagingsByWarehouseIdAPIRes["data"];

export const findPackagingsByWarehouseIdAction = cache(
  async (
    warehouseId: string,
    searchParams?: Record<string, string> | string | [string, string][]
  ): Promise<GetUsersByRoleIdAction> => {
    const q = new URLSearchParams(searchParams || "").toString();

    try {
      const {
        data: { data },
      } = await warehouseInstance.get<FindPackagingsByWarehouseIdAPIRes>(
        `/${warehouseId}/packagings${q ? `?${q}` : ""}`,
        {
          headers: await getHeaders(),
        }
      );
      return data;
    } catch (error: unknown) {
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(
          `findPackagingsByWarehouseIdAction func error: ${res.data.message}`
        );
      }
      if (error instanceof FetchAPINetWorkError) {
        console.log(
          `findPackagingsByWarehouseIdAction func error: ${error.message}`
        );
      }
      console.log(`findPackagingsByWarehouseIdAction func error: ${error}`);
      return {
        packagings: [],
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
