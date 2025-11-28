import { env } from "@/config";
import { FetchAPI } from "../api";

export const roleInstance = FetchAPI.create({
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Encoding": "gzip, deflate, br",
  },
  baseUrl: `${env.SERVER_URL}/api/v1/roles`,
});
