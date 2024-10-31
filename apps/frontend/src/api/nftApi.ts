import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "backend/src";
import { nftApiUrl } from "@/config/constants";

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("supabase.auth.token");
  }
  return "";
};

export const nftApi = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: nftApiUrl,
      headers() {
        return {
          Authorization: `Bearer ${getAuthToken()}`,
        };
      },
    }),
  ],
});
