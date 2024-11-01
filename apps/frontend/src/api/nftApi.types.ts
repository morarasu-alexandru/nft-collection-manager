import type { inferRouterOutputs, inferRouterInputs } from "@trpc/server";
import { AppRouter } from "backend/src/router/router";

type RouterOutput = inferRouterOutputs<AppRouter>;
type RouterInput = inferRouterInputs<AppRouter>;

// Outputs
export type AssetDetails = RouterOutput["getAssetDetails"];
export type Assets = RouterOutput["getAssets"];
export type AddAssetResponse = RouterOutput["addAsset"];
export type TransferAssetResponse = RouterOutput["transferAsset"];

// Inputs
export type AddAssetInput = RouterInput["addAsset"];
export type TransferAssetInput = RouterInput["transferAsset"];
