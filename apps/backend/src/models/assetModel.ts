import { supabase } from "../db";

export interface AssetInput {
  name: string;
  description: string;
  ownerId: string;
}

export interface TransferInput {
  assetId: string;
  fromUserId: string;
  toUserEmail: string;
}

export const AssetModel = {
  async getUserAssets(userId: string) {
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("owner", userId);

    if (error) throw error;
    return data;
  },

  async getAssetDetails(assetId: string) {
    const { data: asset, error: assetError } = await supabase
      .from("assets")
      .select("id, name, description, owner, created_at")
      .eq("id", assetId)
      .single();

    if (assetError || !asset) {
      throw new Error("Asset not found");
    }

    const { data: transactions, error: transactionsError } = await supabase
      .from("transactions")
      .select("id, from_user_id, to_user_id, transaction_date")
      .eq("asset_id", assetId);

    if (transactionsError) {
      throw new Error("Error fetching transactions");
    }

    return {
      id: asset.id,
      name: asset.name,
      description: asset.description,
      owner: asset.owner,
      created_at: asset.created_at,
      transactions: transactions.map((transaction: any) => ({
        id: transaction.id,
        fromUserId: transaction.from_user_id,
        toUserId: transaction.to_user_id,
        transactionDate: transaction.transaction_date,
      })),
    };
  },

  async createAsset(input: AssetInput) {
    const { data, error } = await supabase
      .from("assets")
      .insert({
        name: input.name,
        description: input.description,
        owner: input.ownerId,
      })
      .select();
    if (error) throw error;
    return data[0];
  },

  async transferAsset(input: TransferInput, userId: string) {
    const { data: assetData, error: assetError } = await supabase
      .from("assets")
      .select("owner")
      .eq("id", input.assetId)
      .single();

    if (assetError || !assetData) {
      throw new Error("Asset not found");
    }

    if (assetData.owner !== input.fromUserId) {
      throw new Error("Not authorized to transfer this asset");
    }

    const { data: toUserId, error: userError } = await supabase
      .rpc("get_user_id_by_email", {
        p_email: input.toUserEmail,
      })
      .single();

    if (userError || !toUserId) {
      throw new Error(`No user found with email: ${input.toUserEmail}`);
    }

    const { data, error } = await supabase.rpc("transfer_asset", {
      p_asset_id: input.assetId,
      p_from_user_id: input.fromUserId,
      p_to_user_id: toUserId,
    });

    if (error) throw error;
    return { message: "Asset transferred successfully" };
  },
};
