import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { nftApiUrl } from "@/config/constants";
import { AppRouter } from "backend/src/router/router";

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
