import { AssetModel, AssetInput, TransferInput } from "../models/assetModel";

export const AssetController = {
  async getUserAssets(userId: string) {
    return await AssetModel.getUserAssets(userId);
  },

  async getAssetDetails(assetId: string) {
    return await AssetModel.getAssetDetails(assetId);
  },

  async createAsset(input: AssetInput) {
    return await AssetModel.createAsset(input);
  },

  async transferAsset(input: TransferInput, userId: string) {
    if (!userId) {
      throw new Error("Not authenticated");
    }

    if (userId !== input.fromUserId) {
      throw new Error("Not authorized to transfer this asset");
    }

    return await AssetModel.transferAsset(input, userId);
  },
};
