import { API_BASE_URL } from "@/lib/site";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const SERVER_API_BASE_URL = trimTrailingSlash(
  process.env.API_BASE_URL || API_BASE_URL,
);
