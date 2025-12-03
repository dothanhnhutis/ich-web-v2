"use server";

import { cache } from "react";
import type { PackagingDetail } from "@/types/summary-types";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { packagingInstance } from "./instance";

type FindManyPackagingAPIRes = {
  statusCode: number;
  data: {
    packagings: PackagingDetail[];
    metadata: Metadata;
  };
};

export type FindManyPackagingAction = FindManyPackagingAPIRes["data"];

export const findManyPackagingAction = cache(
  async (
    searchParams?: Record<string, string> | string | [string, string][]
  ): Promise<FindManyPackagingAction> => {
    try {
      const q = new URLSearchParams(searchParams || "").toString();

      const res = await packagingInstance.get<FindManyPackagingAPIRes>(
        q ? `?${q}` : "",
        {
          headers: await getHeaders(),
          cache: "no-store",
        }
      );

      return res.data.data;
    } catch (error) {
      if (error instanceof FetchAPINetWorkError) {
        console.log(`findManyPackagingAction func error: ${error.message}`);
      }
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`findManyPackagingAction func error: ${res.data.message}`);
      } else {
        console.log(`findManyPackagingAction func error: ${error}`);
      }

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
