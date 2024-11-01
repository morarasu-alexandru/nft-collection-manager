import type { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "backend/src/router/router";

type RouterOutput = inferRouterOutputs<AppRouter>;
export type AssetDetails = RouterOutput["getAssetDetails"];