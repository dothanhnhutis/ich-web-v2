"use server";

import { cache } from "react";
import type { Packaging } from "@/types/summary-types";
import {
  FetchAPIError,
  FetchAPINetWorkError,
  type FetchAPIResponse,
} from "../api";
import { getHeaders } from "../utils";
import { packagingInstance } from "./instance";

type FindPackagingByIdAPIRes = {
  statusCode: number;
  message: string;
  data: Packaging;
};

export const findPackagingByIdAction = cache(
  async (packagingId: string): Promise<Packaging | null> => {
    try {
      const { data: res } =
        await packagingInstance.get<FindPackagingByIdAPIRes>(
          `/${packagingId}`,
          {
            headers: await getHeaders(),
          }
        );

      return res.data;
    } catch (error) {
      if (error instanceof FetchAPINetWorkError) {
        console.log(`findPackagingByIdAction func error: ${error.message}`);
      }
      if (error instanceof FetchAPIError) {
        const res = error.response as FetchAPIResponse<{ message: string }>;
        console.log(`findPackagingByIdAction func error: ${res.data.message}`);
      } else {
        console.log(`findPackagingByIdAction func error: ${error}`);
      }

      return null;
    }
  }
);
